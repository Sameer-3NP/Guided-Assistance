import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useS4Store } from "../../../store/useS4Store";
import { useAppStore } from "../../../store/useAppStore";
import PromptRadio from "../../../components/PromptRadio";
import CheckboxGroup from "../../../components/CheckboxGroup";
import PopUp from "../../../components/PopUp";
import { AlertTriangle, FileWarning } from "lucide-react";
import { useS1Store } from "../../../store/useS1Store";
import EditableCondition from "../../../components/EditableCondition";
import DynamicChecklist from "../../../components/DynamicChecklist";

const agreementChecklistItems = [
  "Child support document reflects case# and creditor name which does not match with the tradeline reflected on credit report",
  "Child support document reflects different monthly payment than the one reflected on credit report",
  "Child support payment is active as per child support document however, tradeline on credit report is inactive.",
  "Child support document is not executed/notarized completely.",
  "Child support reflects missing pages.",
  "Child support tradeline reflects account is in collection, but child support document provided does not reflect any delinquent information. Clarification is required for the same.",
];

const divorceChecklistItems = [
  "Divorce decree reflects case# and creditor name which does not match with the tradeline reflected on credit report",
  "Divorce decree reflects different monthly payment than the one reflected on credit report",
  "Child support payment is active as per Divorce decree; however, tradeline on credit report is inactive.",
  "Divorce decree is not executed/notarized completely.",
  "Divorce decree reflects missing pages.",
  "Divorce decree tradeline reflects account is in collection, but child support document provided does not reflect any delinquent information. Clarification is required for the same purpose.",
  "Divorce decree reflects that additional debt is assigned to the borrower which is not included in DTI, and divorce is recent. After including the payment in DTI ratios will exceed the limit of 50%",
  "Divorce decree reflects additional real estate assigned to borrowers and PITIA hit for the same is not included in LOS. Need clarification on the current disposition of the property.",
];

const ChildSupportHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();
  const { setSectionStatus } = useAppStore();
  const { childSupportHandling, setChildSupportHandling } = useS4Store();
  const { s1 } = useS1Store();

  const {
    hasChildSupportTradeline,
    supportingDocument,
    documentType,
    agreementDiscrepancies = [],
    divorceDiscrepancies = [],
    lenderRequirement,
    accounts,
    selectedAccount,
    dlaLessThan7Years,
    conditionMsg,
    customAgreementChecklist = [],
    customDivorceChecklist = [],
  } = childSupportHandling;

  /* ---------- LOCAL STATE ---------- */

  const [showPopup, setShowPopup] = useState(false);
  const [showCreditInventoryPopup, setShowCreditInventoryPopup] =
    useState(false);
  const [creditorName, setCreditorName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  /* ---------- COMPLETE S4 HELPER ---------- */

  const completeS4AndNavigate = (path = "/s5") => {
    setSectionStatus((prev) => ({
      ...prev,
      S4: "completed",
      S5: "active",
    }));
    navigate(path);
  };

  const setCustomAgreementChecklist = (
    value: string[] | ((prev: string[]) => string[]),
  ) => {
    const next =
      typeof value === "function" ? value(customAgreementChecklist) : value;

    setChildSupportHandling({
      customAgreementChecklist: next,
    });
  };

  const setCustomDivorceChecklist = (
    value: string[] | ((prev: string[]) => string[]),
  ) => {
    const next =
      typeof value === "function" ? value(customDivorceChecklist) : value;

    setChildSupportHandling({
      customDivorceChecklist: next,
    });
  };

  const finalAgreementDiscrepancies = [
    ...(agreementDiscrepancies || []),
    ...(customAgreementChecklist || []),
  ];

  const finalDivorceDiscrepancies = [
    ...(divorceDiscrepancies || []),
    ...(customDivorceChecklist || []),
  ];

  const accountText =
    selectedAccount?.creditorName && selectedAccount?.accountNumber
      ? `${selectedAccount.creditorName}#${selectedAccount.accountNumber}`
      : "[Account Name_Number]";

  /* ---------- POPUP SUBMIT ---------- */

  const handleAccountSubmit = () => {
    if (!creditorName || !accountNumber)
      return toast.error("Please enter account details.");

    setChildSupportHandling({
      accounts: [...accounts, { creditorName, accountNumber, balance }],
    });

    setShowPopup(false);
    setCreditorName("");
    setAccountNumber("");
    setBalance("");
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!hasChildSupportTradeline)
      return toast.error("Please answer the first prompt.");

    // CASE 1: No tradeline
    if (hasChildSupportTradeline === "No") {
      setShowCreditInventoryPopup(true);
      return;
    }

    if (!selectedAccount) return toast.error("Please select an account.");

    if (!dlaLessThan7Years)
      return toast.error("Please answer the DLA question.");

    // CASE 2: DLA >= 7 years
    if (dlaLessThan7Years === "No") {
      completeS4AndNavigate();
      return;
    }

    if (!supportingDocument) return toast.error("Please answer prompt 3.");

    // CASE 3: No supporting document
    if (supportingDocument === "No") {
      if (!lenderRequirement)
        return toast.error("Please answer lender requirement prompt.");

      if (lenderRequirement === "Yes")
        toast.error("Condition appears as per Branch 3");

      completeS4AndNavigate();
      return;
    }

    if (documentType.length === 0)
      return toast.error(
        "No document selected. Escalate documentation for manager review.",
      );

    completeS4AndNavigate();
  };

  /* ---------- CREDIT INVENTORY CONFIRM ---------- */

  const handleCreditInventoryConfirm = () => {
    setShowCreditInventoryPopup(false);
    completeS4AndNavigate(s1.length > 0 ? "/s1/inventory" : "/s5");
  };

  /* ---------- REGISTER ACTIONS ---------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/liability-paid-off"),
    });
  }, [
    hasChildSupportTradeline,
    dlaLessThan7Years,
    supportingDocument,
    documentType,
    agreementDiscrepancies,
    divorceDiscrepancies,
    lenderRequirement,
    selectedAccount,
    accounts,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Child Support Handling
          </h2>
        </div>

        {/* PROMPT 1 */}
        <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
          <PromptRadio
            label="Does credit report reflect any tradeline with remarks as Child support / Support / Alimony?"
            value={hasChildSupportTradeline}
            options={["Yes", "No"]}
            onChange={(v) => {
              setChildSupportHandling({ hasChildSupportTradeline: v });
              if (v === "Yes") {
                setShowCreditInventoryPopup(false);
                setShowPopup(true);
              }
              if (v === "No") {
                setShowPopup(false);
                setShowCreditInventoryPopup(true);
              }
            }}
          />

          {hasChildSupportTradeline === "No" && (
            <div className="border border-green-400 bg-green-50 p-3 rounded text-sm text-green-700">
              ✔ Proceed to final screen
            </div>
          )}
        </div>

        {/* ACCOUNT DROPDOWN */}
        {accounts.length > 0 && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <label className="text-sm font-medium">
              Select account number/name
            </label>
            <select
              className="border rounded-md p-2 text-sm w-full"
              value={selectedAccount?.accountNumber || ""}
              onChange={(e) =>
                setChildSupportHandling({
                  selectedAccount: accounts.find(
                    (a) => a.accountNumber === e.target.value,
                  ),
                })
              }
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.creditorName} - {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PROMPT 2 */}
        {selectedAccount && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Does child support account have DLA of less than 7 years?"
              value={dlaLessThan7Years}
              options={["Yes", "No"]}
              onChange={(v) => {
                setChildSupportHandling({ dlaLessThan7Years: v });
                if (v === "No") setShowCreditInventoryPopup(true);
              }}
            />
          </div>
        )}

        {/* PROMPT 3 */}
        {dlaLessThan7Years === "Yes" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check if we have divorce decree or child support agreement available in file"
              value={supportingDocument}
              options={["Yes", "No"]}
              onChange={(v) =>
                setChildSupportHandling({ supportingDocument: v })
              }
            />
          </div>
        )}

        {/* DOCUMENT TYPE */}
        {supportingDocument === "Yes" && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <CheckboxGroup
              label="What document is provided for child support tradeline?"
              options={["Child support agreement", "Divorce decree"]}
              values={documentType}
              onChange={(v) => setChildSupportHandling({ documentType: v })}
            />
          </div>
        )}

        {documentType.includes("Child support agreement") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <DynamicChecklist
              items={agreementChecklistItems}
              selectedItems={agreementDiscrepancies ?? []}
              customItems={customAgreementChecklist ?? []}
              onToggle={(item) => {
                const updated = agreementDiscrepancies?.includes(item)
                  ? agreementDiscrepancies.filter((i) => i !== item)
                  : [...(agreementDiscrepancies || []), item];

                setChildSupportHandling({ agreementDiscrepancies: updated });
              }}
              onCustomChange={setCustomAgreementChecklist}
            />
          </div>
        )}

        {documentType.includes("Divorce decree") && (
          <div className="border rounded-xl p-6 bg-blue-50 space-y-6">
            <DynamicChecklist
              items={divorceChecklistItems}
              selectedItems={divorceDiscrepancies ?? []}
              customItems={customDivorceChecklist ?? []}
              onToggle={(item) => {
                const updated = divorceDiscrepancies?.includes(item)
                  ? divorceDiscrepancies.filter((i) => i !== item)
                  : [...(divorceDiscrepancies || []), item];

                setChildSupportHandling({ divorceDiscrepancies: updated });
              }}
              onCustomChange={setCustomDivorceChecklist}
            />
          </div>
        )}

        {documentType.includes("Child support agreement") &&
          finalAgreementDiscrepancies.length > 0 && (
            <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700 space-y-2">
              <div className="font-semibold">
                Child Support Agreement Issues
              </div>

              <div className="mt-2">
                {`Credit report reflects account ${accountText} which is a
                child support account and child support/divorce decree document
                is available in file which has inconsistent information as
                mentioned below:`}
              </div>

              {finalAgreementDiscrepancies.map((item, i) => (
                <div key={i}>
                  {String.fromCharCode(97 + i)}){item}
                </div>
              ))}

              <div className="mt-2">
                Please provide clarification and updated documentation for
                validation.
              </div>
            </div>
          )}

        {documentType.includes("Divorce decree") &&
          finalDivorceDiscrepancies.length > 0 && (
            <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700 space-y-2">
              <div className="font-semibold">Divorce Decree Issues</div>

              <div className="mt-2">
                {`Credit report reflects account ${accountText} which is a
                child support account and child support/divorce decree document
                is available in file which has inconsistent information as
                mentioned below:`}
              </div>

              {finalDivorceDiscrepancies.map((item, i) => (
                <div key={i}>
                  {String.fromCharCode(97 + i)}) {item}
                </div>
              ))}

              <div className="mt-2">
                Please provide clarification and updated documentation for
                validation.
              </div>
            </div>
          )}

        {/* PROMPT 4 */}
        {supportingDocument === "No" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="Check out lender requirements for child support/divorce decree?"
              value={lenderRequirement}
              options={["Yes", "No"]}
              onChange={(v) =>
                setChildSupportHandling({ lenderRequirement: v })
              }
            />
            {lenderRequirement === "Yes" && (
              <EditableCondition
                type="condition"
                value={
                  conditionMsg ||
                  `Credit report reflects account ${accountText} which is a child support account and no other document is available in file. However, as per lender’s requirement, we require either a child support agreement or divorce decree to validate the actual payment.`
                }
                onChange={(v) => setChildSupportHandling({ conditionMsg: v })}
              />
            )}
          </div>
        )}

        {/* ACCOUNT POPUP */}
        <PopUp
          open={showPopup}
          title="Child Support Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Creditor name</label>
              <input
                type="text"
                value={creditorName}
                onChange={(e) =>
                  setCreditorName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
                }
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="number"
                min="0"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Balance</label>
              <input
                type="number"
                min="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>

        {/* NAVIGATION POPUP */}
        <PopUp
          open={showCreditInventoryPopup}
          title="Navigation Confirmation"
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          onConfirm={handleCreditInventoryConfirm}
          onClose={() => setShowCreditInventoryPopup(false)}
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium">No child support tradeline found.</p>
            <p className="mt-1">
              Do you want to move to{" "}
              <strong>Credit Inventory (Section-1)</strong>?
            </p>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default ChildSupportHandling;
