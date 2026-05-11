import { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import { FileCheck, FileWarning, Stethoscope } from "lucide-react";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";
import EditableCondition from "../../../components/EditableCondition";

const CollectionAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { collectionHandling, setCollectionHandling } = useS4Store();

  const [showPopup, setShowPopup] = useState(false);

  const {
    hasCollection,
    collectionType,
    individualBalance,
    cumulativeBalance,
    occupancy,
    unit,
    accountName,
    accountNumber,
    conditionMsg,
  } = collectionHandling;

  const showPrompt2 = hasCollection === "Yes";

  /* ---------- RULE ENGINE ---------- */

  const evaluateRules = () => {
    const indiv = Number(individualBalance);
    const cum = Number(cumulativeBalance);
    const units = Number(unit);

    if (occupancy === "Primary Residence" && units === 1) return "none";

    if (
      occupancy === "Primary Residence" &&
      units >= 2 &&
      units <= 4 &&
      cum < 5000
    )
      return "none";

    if (
      occupancy === "Primary Residence" &&
      units >= 2 &&
      units <= 4 &&
      cum > 5000
    )
      return "branch4";

    if (occupancy === "Second Home" && units === 1 && cum < 5000) return "none";

    if (occupancy === "Second Home" && units === 1 && cum > 5000)
      return "branch4";

    if (occupancy === "Investment Home" && units >= 1 && units <= 4) {
      if (cum > 1000) return "branch5_2";
      if (indiv > 250) return "branch5_1";
      return "none";
    }

    return null;
  };

  const nonMedicalCondn = () => {
    if (!individualBalance || Number(individualBalance) <= 0)
      return toast.error("Enter valid individual balance");

    if (!cumulativeBalance || Number(cumulativeBalance) <= 0)
      return toast.error("Enter valid cumulative balance");

    if (!occupancy) return toast.error("Select occupancy");

    if (!unit) return toast.error("Select unit");

    if (!accountName || !accountNumber)
      return toast.error("Enter account details");

    const result = evaluateRules();

    if (result === "none") {
      setCollectionHandling({ conditionMsg: "" });
      toast.success("No condition required");
      setShowPopup(false);
      return;
    }

    let generatedCondition = "";

    if (result === "branch4") {
      generatedCondition = `Credit report reflects collection account ${accountName}, ${accountNumber} with balance of $${cumulativeBalance}, which exceeds $5,000. The account must be paid in full prior to or at closing.`;
    }

    if (result === "branch5_1") {
      generatedCondition = `Cumulative balance for all active collection account ${accountName}, ${accountNumber}  has balance of $${cumulativeBalance}, which is more than $1000 with investment property hence same needs to be paid in full prior to or at closing.`;
    }

    if (result === "branch5_2") {
      generatedCondition = `Credit report reflects individual collection account ${accountName}, ${accountNumber} with balance of $${cumulativeBalance}, which is more than $250 and it is an investment property hence same needs to be paid in full prior to or at closing.`;
    }

    setCollectionHandling({
      conditionMsg: generatedCondition,
    });

    setShowPopup(false);
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = useCallback(() => {
    if (!hasCollection)
      return toast.error("Please confirm collection account presence.");

    if (hasCollection === "No") {
      navigate("/s4/disputed-account");
      return;
    }

    if (!collectionType) return toast.error("Please select collection type.");

    navigate("/s4/disputed-account");
  }, [hasCollection, collectionType, navigate]);

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/missing-tradeline-payment"),
    });
  }, [handleContinue, navigate, registerActions]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Collection Account Handling
          </h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Review collection accounts and determine underwriting conditions.
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any collection account?"
            value={hasCollection}
            options={["Yes", "No"]}
            onChange={(v) => setCollectionHandling({ hasCollection: v })}
          />
        </div>

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Is a collection account a medical or non-medical collection ? "
              value={collectionType}
              options={["Medical", "Non-Medical"]}
              onChange={(v) => {
                setCollectionHandling({ collectionType: v });
                if (v === "Non-Medical") setShowPopup(true);
              }}
            />

            {collectionType === "Medical" && (
              <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded-xl text-sm text-green-700">
                <Stethoscope className="w-4 h-4" />
                Medical Condition , No action required.
              </div>
            )}
          </div>
        )}

        {collectionType === "Non-Medical" && conditionMsg && (
          <EditableCondition
            type="condition"
            value={conditionMsg}
            onChange={(val) => setCollectionHandling({ conditionMsg: val })}
          />
        )}

        <PopUp
          open={showPopup}
          title="Non-Medical Collection Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          confirmText="Save"
          onClose={() => setShowPopup(false)}
          onConfirm={nonMedicalCondn}
        >
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Individual Balance"
              value={individualBalance ?? ""}
              onChange={(e) =>
                setCollectionHandling({ individualBalance: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />

            <input
              type="number"
              placeholder="Cumulative Balance"
              value={cumulativeBalance ?? ""}
              onChange={(e) =>
                setCollectionHandling({ cumulativeBalance: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />

            <PromptRadio
              label="Occupancy"
              value={occupancy}
              options={["Primary Residence", "Second Home", "Investment Home"]}
              onChange={(v) => setCollectionHandling({ occupancy: v })}
            />

            <PromptRadio
              label="Unit"
              value={unit}
              options={["1", "2", "3", "4"]}
              onChange={(v) => setCollectionHandling({ unit: v })}
            />

            <input
              type="text"
              placeholder="Account Name"
              value={accountName ?? ""}
              onChange={(e) =>
                setCollectionHandling({
                  accountName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                })
              }
              className="w-full border p-2 rounded-md"
            />

            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber ?? ""}
              onChange={(e) =>
                setCollectionHandling({ accountNumber: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default CollectionAccountHandling;
