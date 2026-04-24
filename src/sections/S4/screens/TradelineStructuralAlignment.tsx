import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import PromptRadio from "../../../components/PromptRadio";

import { FileCheck, AlertTriangle, GitCompare, Database } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const TradelineStructuralAlignment = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { tradelineAlignment, setTradelineAlignment } = useS4Store();

  const { losGreater, creditGreater, fieldsMatch } = tradelineAlignment;

  /* ---------- BRANCH LOGIC ---------- */

  const showPrompt2 = losGreater === "No";
  const showPrompt3 = showPrompt2 && creditGreater === "No";

  const branch1Condition = losGreater === "Yes";

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!losGreater) return toast.error("Please answer the first prompt.");

    if (showPrompt2 && !creditGreater)
      return toast.error("Please answer the second prompt.");

    if (showPrompt3 && !fieldsMatch)
      return toast.error("Please confirm tradeline field alignment.");

    navigate("/s4/missing-tradeline-payment");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s3/median-score"),
    });
  }, [losGreater, creditGreater, fieldsMatch]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Tradeline Structure Alignment
          </h2>
        </div>

        {/* TRADELINE COUNT COMPARISON */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <GitCompare className="w-5 h-5 text-gray-600" />
            Tradeline Count Comparison
          </div>

          <PromptRadio
            label="Are tradeline count on LOS greater than tradeline count on credit report?"
            value={losGreater}
            options={["Yes", "No"]}
            onChange={(v) => setTradelineAlignment({ losGreater: v })}
          />

          {branch1Condition && (
            <EditableCondition
              type="condition"
              value={
                tradelineAlignment.branch1 ||
                "Borrower has disclosed tradelines from [[Tradeline Name, Tradeline Account Number]] on LOS however, same is not reflected on credit report. Obtain additional documentation to support the payment."
              }
              onChange={(val) => setTradelineAlignment({ branch1: val })}
            />
          )}

          {showPrompt2 && (
            <PromptRadio
              label="Is tradeline count on credit report greater than tradeline count on LOS?"
              value={creditGreater}
              options={["Yes", "No"]}
              onChange={(v) => setTradelineAlignment({ creditGreater: v })}
            />
          )}

          {creditGreater === "Yes" && (
            <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              Action Required: Update LOS based on tradelines reflected on the
              credit report.
            </div>
          )}
        </div>

        {/* FIELD LEVEL VALIDATION */}

        {showPrompt3 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Database className="w-5 h-5 text-gray-600" />
              Tradeline Field Validation
            </div>

            <PromptRadio
              label="Do all tradeline fields match between credit report and LOS (Creditor name, account number, account type, ownership, outstanding balance, monthly payment, ECOA)?"
              value={fieldsMatch}
              options={["Matches", "Mismatch"]}
              onChange={(v) => setTradelineAlignment({ fieldsMatch: v })}
            />

            {fieldsMatch === "Mismatch" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Action Required: Update LOS tradeline fields based on credit
                report data.
              </div>
            )}

            {fieldsMatch === "Matches" && (
              <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                ✔ No discrepancies detected. No action required.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradelineStructuralAlignment;
