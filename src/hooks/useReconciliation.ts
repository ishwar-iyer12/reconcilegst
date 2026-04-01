"use client";

import { useState, useCallback } from "react";
import { ReconciliationResult } from "@/lib/matching/types";
import { parseGSTR2A } from "@/lib/parsers/gstr2a";
import { parsePurchaseRegister } from "@/lib/parsers/purchaseRegister";
import { reconcile } from "@/lib/matching/reconcile";
import { exportReconciliation } from "@/lib/export/excelExport";

interface ReconciliationState {
  gstr2aFile: File | null;
  prFile: File | null;
  loading: boolean;
  error: string | null;
  result: ReconciliationResult | null;
}

export function useReconciliation() {
  const [state, setState] = useState<ReconciliationState>({
    gstr2aFile: null,
    prFile: null,
    loading: false,
    error: null,
    result: null,
  });

  const setGSTR2AFile = useCallback((file: File) => {
    setState((s) => ({ ...s, gstr2aFile: file, result: null, error: null }));
  }, []);

  const setPRFile = useCallback((file: File) => {
    setState((s) => ({ ...s, prFile: file, result: null, error: null }));
  }, []);

  const runReconciliation = useCallback(async () => {
    if (!state.gstr2aFile || !state.prFile) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const [gstrRecords, prRecords] = await Promise.all([
        parseGSTR2A(state.gstr2aFile),
        parsePurchaseRegister(state.prFile),
      ]);

      const result = reconcile(gstrRecords, prRecords);
      setState((s) => ({ ...s, loading: false, result }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during reconciliation";
      setState((s) => ({ ...s, loading: false, error: message }));
    }
  }, [state.gstr2aFile, state.prFile]);

  const handleExport = useCallback(() => {
    if (state.result) {
      exportReconciliation(state.result);
    }
  }, [state.result]);

  const reset = useCallback(() => {
    setState({
      gstr2aFile: null,
      prFile: null,
      loading: false,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    setGSTR2AFile,
    setPRFile,
    runReconciliation,
    handleExport,
    reset,
  };
}
