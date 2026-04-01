import {
  NormalizedRecord,
  MatchKey,
  MatchedRecord,
  MismatchedRecord,
  MismatchReason,
  MissingRecord,
  ReconciliationResult,
  ReconciliationConfig,
  DEFAULT_CONFIG,
} from "./types";
import { makeMatchKey, formatDate, formatCurrency } from "./normalizers";

function buildMatchMap(
  records: NormalizedRecord[]
): Map<MatchKey, NormalizedRecord[]> {
  const map = new Map<MatchKey, NormalizedRecord[]>();
  for (const rec of records) {
    const key = makeMatchKey(rec.gstin, rec.invoiceNumber);
    const existing = map.get(key) || [];
    existing.push(rec);
    map.set(key, existing);
  }
  return map;
}

function checkTolerances(
  gstr: NormalizedRecord,
  pr: NormalizedRecord,
  config: ReconciliationConfig
): MismatchReason[] {
  const reasons: MismatchReason[] = [];

  // Amount check
  const base = Math.max(Math.abs(gstr.totalValue), 1);
  const amountDiffPct = (Math.abs(gstr.totalValue - pr.totalValue) / base) * 100;
  if (amountDiffPct > config.amountTolerancePct) {
    reasons.push({
      field: "amount",
      gstr2aValue: gstr.totalValue,
      prValue: pr.totalValue,
      description: `Amount differs by ${amountDiffPct.toFixed(1)}% (GSTR-2A: ${formatCurrency(gstr.totalValue)}, PR: ${formatCurrency(pr.totalValue)})`,
    });
  }

  // Date check
  const daysDiff = Math.abs(
    Math.round(
      (gstr.invoiceDate.getTime() - pr.invoiceDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  if (daysDiff > config.dateToleranceDays) {
    reasons.push({
      field: "date",
      gstr2aValue: formatDate(gstr.invoiceDate),
      prValue: formatDate(pr.invoiceDate),
      description: `Date differs by ${daysDiff} days (GSTR-2A: ${formatDate(gstr.invoiceDate)}, PR: ${formatDate(pr.invoiceDate)})`,
    });
  }

  // Tax component checks
  for (const component of ["cgst", "sgst", "igst"] as const) {
    const gVal = gstr[component];
    const pVal = pr[component];
    if (gVal === 0 && pVal === 0) continue;
    const compBase = Math.max(Math.abs(gVal), Math.abs(pVal), 1);
    const diff = (Math.abs(gVal - pVal) / compBase) * 100;
    if (diff > config.amountTolerancePct) {
      reasons.push({
        field: component,
        gstr2aValue: gVal,
        prValue: pVal,
        description: `${component.toUpperCase()} differs: GSTR-2A ${formatCurrency(gVal)} vs PR ${formatCurrency(pVal)}`,
      });
    }
  }

  return reasons;
}

export function reconcile(
  gstrRecords: NormalizedRecord[],
  prRecords: NormalizedRecord[],
  config: ReconciliationConfig = DEFAULT_CONFIG
): ReconciliationResult {
  const gstrMap = buildMatchMap(gstrRecords);
  const prMap = buildMatchMap(prRecords);

  const matched: MatchedRecord[] = [];
  const mismatched: MismatchedRecord[] = [];
  const processedGSTRKeys = new Set<MatchKey>();
  const processedPRKeys = new Set<MatchKey>();

  for (const [key, gstrGroup] of gstrMap) {
    const prGroup = prMap.get(key);
    if (!prGroup || prGroup.length === 0) continue;

    processedGSTRKeys.add(key);
    processedPRKeys.add(key);

    const usedPRIndices = new Set<number>();

    for (const gstrRec of gstrGroup) {
      let bestMatch: { index: number; reasons: MismatchReason[] } | null = null;

      for (let i = 0; i < prGroup.length; i++) {
        if (usedPRIndices.has(i)) continue;
        const reasons = checkTolerances(gstrRec, prGroup[i], config);

        if (reasons.length === 0) {
          bestMatch = { index: i, reasons: [] };
          break;
        } else if (!bestMatch || reasons.length < bestMatch.reasons.length) {
          bestMatch = { index: i, reasons };
        }
      }

      if (bestMatch) {
        usedPRIndices.add(bestMatch.index);
        if (bestMatch.reasons.length === 0) {
          matched.push({
            gstr2a: gstrRec,
            purchaseRegister: prGroup[bestMatch.index],
          });
        } else {
          mismatched.push({
            gstr2a: gstrRec,
            purchaseRegister: prGroup[bestMatch.index],
            reasons: bestMatch.reasons,
          });
        }
      }
    }

    // Handle unmatched PR records within matched keys
    for (let i = 0; i < prGroup.length; i++) {
      if (!usedPRIndices.has(i)) {
        // These PR records have matching keys but no GSTR counterpart left
      }
    }
  }

  const missingInPR: MissingRecord[] = [];
  for (const [key, recs] of gstrMap) {
    if (!processedGSTRKeys.has(key)) {
      for (const r of recs) {
        missingInPR.push({ record: r, missingFrom: "purchase_register" });
      }
    }
  }

  const missingInGSTR: MissingRecord[] = [];
  for (const [key, recs] of prMap) {
    if (!processedPRKeys.has(key)) {
      for (const r of recs) {
        missingInGSTR.push({ record: r, missingFrom: "gstr2a" });
      }
    }
  }

  return {
    matched,
    mismatched,
    missingInPR,
    missingInGSTR,
    summary: {
      totalGSTR2A: gstrRecords.length,
      totalPR: prRecords.length,
      matchedCount: matched.length,
      mismatchedCount: mismatched.length,
      missingInPRCount: missingInPR.length,
      missingInGSTRCount: missingInGSTR.length,
    },
  };
}
