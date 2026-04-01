export interface NormalizedRecord {
  gstin: string;
  invoiceNumber: string;
  invoiceDate: Date;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
  source: "gstr2a" | "purchase_register";
  rawData: Record<string, unknown>;
}

export type MatchKey = `${string}::${string}`;

export interface MatchedRecord {
  gstr2a: NormalizedRecord;
  purchaseRegister: NormalizedRecord;
}

export interface MismatchReason {
  field: "amount" | "date" | "cgst" | "sgst" | "igst";
  gstr2aValue: string | number;
  prValue: string | number;
  description: string;
}

export interface MismatchedRecord {
  gstr2a: NormalizedRecord;
  purchaseRegister: NormalizedRecord;
  reasons: MismatchReason[];
}

export interface MissingRecord {
  record: NormalizedRecord;
  missingFrom: "gstr2a" | "purchase_register";
}

export interface ReconciliationResult {
  matched: MatchedRecord[];
  mismatched: MismatchedRecord[];
  missingInPR: MissingRecord[];
  missingInGSTR: MissingRecord[];
  summary: {
    totalGSTR2A: number;
    totalPR: number;
    matchedCount: number;
    mismatchedCount: number;
    missingInPRCount: number;
    missingInGSTRCount: number;
  };
}

export interface ReconciliationConfig {
  amountTolerancePct: number;
  dateToleranceDays: number;
}

export const DEFAULT_CONFIG: ReconciliationConfig = {
  amountTolerancePct: 2,
  dateToleranceDays: 7,
};
