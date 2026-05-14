import { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import {
  FileCheck,
  FileWarning,
  Stethoscope,
  Wallet,
  Home,
  Building,
  CreditCard,
  Plus,
  User,
  Hash,
  DollarSign,
  Trash2,
} from "lucide-react";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";
import EditableCondition from "../../../components/EditableCondition";

const CollectionAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { collectionHandling, setCollectionHandling } = useS4Store();

  const [showPopup, setShowPopup] = useState(false);
  const [accountRows, setAccountRows] = useState([
    {
      accountName: "",
      accountNumber: "",
      individualBalance: "",
    },
  ]);

  const {
    hasCollection,
    collectionType,
    cumulativeBalance,
    occupancy,
    unit,
    conditionMsg,
    accounts = [],
  } = collectionHandling;

  const showPrompt2 = hasCollection === "Yes";

  /* ---------- RULE ENGINE ---------- */

  const evaluateRules = () => {
    const indiv = Number(
      accounts.reduce(
        (sum, acc) => sum + Number(acc.individualBalance || 0),
        0,
      ),
    );
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

  const handleRowChange = (
    index: number,
    field: "accountName" | "accountNumber" | "individualBalance",
    value: string,
  ) => {
    const updated = [...accountRows];

    updated[index][field] = value;

    setAccountRows(updated);
  };

  const addRow = () => {
    setAccountRows([
      ...accountRows,
      {
        accountName: "",
        accountNumber: "",
        individualBalance: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = accountRows.filter((_, i) => i !== index);

    setAccountRows(updated);
  };

  const nonMedicalCondn = () => {
    const hasEmptyFields = accountRows.some(
      (acc) => !acc.accountName || !acc.accountNumber || !acc.individualBalance,
    );

    if (hasEmptyFields) {
      return toast.error("Please fill all account details");
    }

    if (!cumulativeBalance || Number(cumulativeBalance) <= 0)
      return toast.error("Enter valid cumulative balance");

    if (!occupancy) return toast.error("Select occupancy");

    if (!unit) return toast.error("Select unit");

    const result = evaluateRules();

    const formattedAccounts = accountRows.map((acc) => ({
      accountName: acc.accountName,
      accountNumber: acc.accountNumber,
      individualBalance: acc.individualBalance,
    }));

    let generatedCondition = "";

    const accountText = formattedAccounts
      .map((acc) => `${acc.accountName}#${acc.accountNumber}`)
      .join(", ");

    if (result === "none") {
      setCollectionHandling({
        conditionMsg: "",
        accounts: formattedAccounts,
      });

      toast.success("No condition required");
      setShowPopup(false);
      return;
    }

    if (result === "branch4") {
      generatedCondition = `Credit report reflects collection account ${accountText} with cumulative balance of $${cumulativeBalance}, which exceeds $5,000. The account must be paid in full prior to or at closing.`;
    }

    if (result === "branch5_1") {
      generatedCondition = `Cumulative balance for all active collection accounts ${accountText} is $${cumulativeBalance}, which exceeds $1,000 for an investment property. These accounts must be paid in full prior to or at closing.`;
    }

    if (result === "branch5_2") {
      generatedCondition = `Credit report reflects collection account(s) ${accountText} with individual balance exceeding $250 for an investment property. These accounts must be paid in full prior to or at closing.`;
    }

    setCollectionHandling({
      conditionMsg: generatedCondition,
      accounts: formattedAccounts,
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
          <div className="space-y-5  max-h-70 overflow-y-auto pr-2 ">
            {/* Collection Handling */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Collection Handling
              </p>
            </div>

            {/* Cumulative Balance */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                Cumulative Balance
              </label>
              <input
                type="number"
                placeholder="e.g. 12500"
                value={cumulativeBalance ?? ""}
                onChange={(e) =>
                  setCollectionHandling({ cumulativeBalance: e.target.value })
                }
                className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-full"
              />
            </div>

            {/* Occupancy + Unit */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-gray-400" />
                  Occupancy
                </label>
                <select
                  value={occupancy ?? ""}
                  onChange={(e) =>
                    setCollectionHandling({ occupancy: e.target.value })
                  }
                  className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                >
                  <option value="">Select occupancy</option>
                  <option value="Primary Residence">Primary Residence</option>
                  <option value="Second Home">Second Home</option>
                  <option value="Investment Home">Investment Home</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  Unit
                </label>
                <select
                  value={unit ?? ""}
                  onChange={(e) =>
                    setCollectionHandling({ unit: e.target.value })
                  }
                  className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                >
                  <option value="">Select unit</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Collection Accounts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Collection Accounts
                  {/* <span className="ml-1 bg-blue-50 text-blue-500 text-xs font-medium px-2 py-0.5 rounded-full">
                    {accountRows.length}{" "}
                    {accountRows.length === 1 ? "account" : "accounts"}
                  </span> */}
                </h3>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Account
                </button>
              </div>

              {/* Column Labels */}
              <div className="grid grid-cols-[1fr_1fr_100px_36px] gap-2 px-1 mb-1">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" /> Account Name
                </span>
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Account Number
                </span>
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Balance
                </span>
                <span />
              </div>

              {/* Account Rows */}
              <div className="space-y-2  overflow-y-auto pr-1">
                {accountRows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_100px_36px] gap-2 items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                  >
                    <input
                      type="text"
                      placeholder="Chase Checking"
                      value={row.accountName}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "accountName",
                          e.target.value.replace(/[^A-Za-z\s]/g, ""),
                        )
                      }
                      className="border border-gray-200 bg-white rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all min-w-0"
                    />
                    <input
                      type="text"
                      placeholder="000123456"
                      value={row.accountNumber}
                      onChange={(e) =>
                        handleRowChange(index, "accountNumber", e.target.value)
                      }
                      className="border border-gray-200 bg-white rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all min-w-0"
                    />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.individualBalance}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "individualBalance",
                          e.target.value,
                        )
                      }
                      className="border border-gray-200 bg-white rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all min-w-0"
                    />
                    {accountRows.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="flex items-center justify-center w-9 h-9 text-red-400 border border-red-100 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Remove account ${index + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default CollectionAccountHandling;
