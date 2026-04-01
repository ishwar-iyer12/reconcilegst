import { NormalizedRecord } from "@/lib/matching/types";
import {
  normalizeGSTIN,
  normalizeInvoiceNumber,
  parseDate,
} from "@/lib/matching/normalizers";

interface GSTR2ATaxDetail {
  txval?: number;
  camt?: number;
  samt?: number;
  iamt?: number;
  // Alternate field names used by some portal versions
  csamt?: number;
  ssamt?: number;
}

interface GSTR2AInvoiceItem {
  num?: number;
  itm_det?: GSTR2ATaxDetail;
  // Some portal exports put tax fields directly on the item
  txval?: number;
  camt?: number;
  samt?: number;
  iamt?: number;
  csamt?: number;
  ssamt?: number;
}

interface GSTR2AInvoice {
  inum: string;
  idt: string;
  val: number;
  itms?: GSTR2AInvoiceItem[];
}

interface GSTR2ASupplier {
  ctin: string;
  inv: GSTR2AInvoice[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractB2B(json: any): GSTR2ASupplier[] {
  // Standard portal format: data.docdata.b2b
  if (json?.data?.docdata?.b2b) return json.data.docdata.b2b;
  // Alternate: docdata.b2b
  if (json?.docdata?.b2b) return json.docdata.b2b;
  // Direct b2b array
  if (json?.b2b) return json.b2b;
  // Maybe it's already an array of suppliers
  if (Array.isArray(json) && json.length > 0 && json[0].ctin) return json;
  throw new Error(
    "Could not find B2B data in GSTR-2A JSON. Expected path: data.docdata.b2b or b2b"
  );
}

export async function parseGSTR2A(file: File): Promise<NormalizedRecord[]> {
  const text = await file.text();
  const json = JSON.parse(text);
  const suppliers = extractB2B(json);
  const records: NormalizedRecord[] = [];

  for (const supplier of suppliers) {
    const gstin = normalizeGSTIN(supplier.ctin);

    for (const inv of supplier.inv) {
      let taxableValue = 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (inv.itms && inv.itms.length > 0) {
        for (const item of inv.itms) {
          // Tax details can be nested under itm_det or directly on the item
          const det: GSTR2ATaxDetail = item.itm_det || item;
          taxableValue += det.txval || 0;
          cgst += det.camt || det.csamt || 0;
          sgst += det.samt || det.ssamt || 0;
          igst += det.iamt || 0;
        }
      }

      records.push({
        gstin,
        invoiceNumber: normalizeInvoiceNumber(inv.inum),
        invoiceDate: parseDate(inv.idt),
        taxableValue,
        cgst,
        sgst,
        igst,
        totalValue: inv.val,
        source: "gstr2a",
        rawData: inv as unknown as Record<string, unknown>,
      });
    }
  }

  return records;
}
