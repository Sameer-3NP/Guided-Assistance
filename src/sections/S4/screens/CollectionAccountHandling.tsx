import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import ConditionBanner from "../../../components/ConditionBanner";
import { FileCheck, FileWarning, Stethoscope } from "lucide-react";

import PromptRadio from "../../S3/components/PromptRadio";
import PopUp from "../../../components/PopUp";

const CollectionAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { collectionHandling, setCollectionHandling } = useSectionStore();
  const [showPopup, setShowPopup] = useState(false);
  const [conditionMessage, setConditionMessage] = useState<string | null>(null);

  const {
    hasCollection,
    collectionType,
    individualBalance,
    cumulativeBalance,
    occupancy,
    unit,
    accountName,
    accountNumber,
  } = collectionHandling;

  const showPrompt2 = hasCollection === "Yes";

  /* ---------- CONDITION OUTPUT ---------- */

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
      if (indiv < 250) return "none";
      if (cum < 1000) return "none";
      if (indiv > 250) return "branch5_1";
      if (cum > 1000) return "branch5_2";
    }

    return null;
  };

  const nonMedicalCondn = () => {
    if (!individualBalance || !cumulativeBalance)
      return toast.error("Please enter collection balances.");

    if (!occupancy) return toast.error("Please select occupancy.");

    if (!unit) return toast.error("Please select unit.");

    if (!accountName || !accountNumber)
      return toast.error("Please enter account details.");

    const result = evaluateRules();

    if (result === "branch4") {
      setConditionMessage(
        "Condition appears as per Branch 4 and account name/account number will be updated.",
      );
    }

    if (result === "branch5_1") {
      setConditionMessage(
        "Condition appears as per Branch 5.1 and account name/account number will be updated.",
      );
    }

    if (result === "branch5_2") {
      setConditionMessage(
        "Condition appears as per Branch 5.2 and account name/account number will be updated.",
      );
    }

    setShowPopup(false);
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!hasCollection)
      return toast.error("Please confirm collection account presence.");

    if (hasCollection === "No") {
      navigate("/s4/disputed-account");
      return;
    }

    if (!collectionType) return toast.error("Please select collection type.");

    if (collectionType === "Medical") {
      navigate("/s4/disputed-account");
      return;
    }

    navigate("/s4/disputed-account");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/missing-tradeline-payment"),
    });
  }, [
    hasCollection,
    collectionType,
    individualBalance,
    cumulativeBalance,
    occupancy,
    unit,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Collection Account Handling
          </h2>
        </div>

        {/* INSTRUCTION */}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Review collection accounts reflected on the credit report and
          determine if underwriting conditions are required based on occupancy,
          units, and collection balances.
        </div>

        {/* COLLECTION PRESENCE */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <PromptRadio
            label="Does credit report reflect any collection account?"
            value={hasCollection}
            options={["Yes", "No"]}
            onChange={(v) => setCollectionHandling({ hasCollection: v })}
          />

          {hasCollection === "No" && (
            <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
              ✔ No collection accounts present.
            </div>
          )}
        </div>

        {/* COLLECTION TYPE */}

        {showPrompt2 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <PromptRadio
              label="Is the collection account medical or non-medical?"
              value={collectionType}
              options={["Medical", "Non-Medical"]}
              onChange={(v) => {
                setCollectionHandling({ collectionType: v });

                if (v === "Non-Medical") {
                  // setCollectionHandling({
                  //   collectionType: v,
                  //   individualBalance: "",
                  //   cumulativeBalance: "",
                  //   occupancy: "",
                  //   unit: "",
                  //   accountName: "",
                  //   accountNumber: "",
                  // });

                  setShowPopup(true);
                }
              }}
            />

            {collectionType === "Medical" && (
              <div className="flex items-center gap-2 border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
                <Stethoscope className="w-4 h-4" />
                Medical Condition , No action required.
              </div>
            )}
          </div>
        )}
        {conditionMessage && (
          <ConditionBanner
            type="condition"
            message={
              "As the collection amount is non- medical, " + conditionMessage
            }
          />
        )}

        {/* NON MEDICAL COLLECTION FORM */}

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
              placeholder="Individual Collection Balance"
              value={individualBalance ?? ""}
              onChange={(e) =>
                setCollectionHandling({ individualBalance: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            />

            <input
              type="number"
              placeholder="Cumulative Collection Balance"
              value={cumulativeBalance ?? ""}
              onChange={(e) =>
                setCollectionHandling({ cumulativeBalance: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
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
                setCollectionHandling({ accountName: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            />

            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber ?? ""}
              onChange={(e) =>
                setCollectionHandling({ accountNumber: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default CollectionAccountHandling;
