import { useEffect } from "react";
import { useSectionStore } from "../../../store/SectionStore";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import EditableCondition from "../../../components/EditableCondition";
import {
  CreditCard,
  CalendarCheck,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

const CreditReportValidity = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const {
    s0,
    s1,
    activeCreditReport,
    creditValidityStep,
    setCreditValidityStep,
    pullType,
    setPullType,
    CreditCondition,
    setCreditCondition,
  } = useSectionStore();

  const activeReport =
    s1.length === 1
      ? s1[0]
      : s1.find((report) => report.label === activeCreditReport);

  const borrower = activeReport?.borrowerSlot || "Unknown";

  useEffect(() => {
    if (!CreditCondition.softPull) {
      setCreditCondition({
        softPull: `Credit report provided for borrower ${borrower} is a soft pull. Loan Officer to pull new credit report reflecting credit report type as hard pull.`,
      });
    }
  });

  if (!activeReport || !s0) return null;

  const expirationDate = new Date(activeReport.expirationDate);
  const closingDate = new Date(s0.closingDate);
  const expirationCondition = expirationDate < closingDate;

  const handleContinue = () => {
    if (creditValidityStep === "pullCheck") {
      if (!pullType) {
        toast.error("Please select Hard Pull or Soft Pull");
        return;
      }

      setCreditValidityStep("expirationCheck");
      return;
    }

    if (expirationCondition) {
      toast.error(
        "Credit report expires before the estimated closing date. An updated credit report must be obtained.",
      );
    }

    navigate("/s1/source-request-integrity");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {
        if (creditValidityStep === "expirationCheck") {
          setCreditValidityStep("pullCheck");
        } else {
          navigate("/s1/repository-check");
        }
      },
    });
  }, [creditValidityStep, pullType, expirationCondition, navigate]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Credit Report Validity
          </h2>
        </div>

        {/* STEP 1 */}
        {creditValidityStep === "pullCheck" && (
          <div className="border bg-gray-50 border-gray-300 rounded-xl p-5  shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              Credit Pull Type Verification
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}

              <p className="text-md text-black leading-relaxed font-semibold">
                Is the credit report a Hard pull or Soft pull ?
              </p>
            </div>

            <div className="flex gap-10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pullType"
                  value="hard"
                  checked={pullType === "hard"}
                  onChange={(e) => setPullType(e.target.value)}
                  className="accent-blue-600"
                />
                Hard Pull
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pullType"
                  value="soft"
                  checked={pullType === "soft"}
                  onChange={(e) => setPullType(e.target.value)}
                  className="accent-red-600"
                />
                Soft Pull
              </label>
            </div>
            {pullType === "soft" && (
              <EditableCondition
                type="condition"
                value={CreditCondition.softPull}
                onChange={(val) => setCreditCondition({ softPull: val })}
              />
            )}
          </div>
        )}

        {/* STEP 2 */}
        {creditValidityStep === "expirationCheck" && (
          <div className="border-gray-200 bg-gray-50 rounded-xl p-5  shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <CalendarCheck className="w-5 h-5 text-blue-400" />
              Credit Expiration Validation
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
              <p className="text-md text-black leading-relaxed font-semibold">
                Does the credit report expiration date cover the Estimated
                Closing Date ?
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              Credit Expiration Date:
              <span className="font-medium ml-2">
                {activeReport.expirationDate}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              Estimated Closing Date:
              <span className="font-medium ml-2">{s0.closingDate}</span>
            </div>

            {expirationCondition && (
              // <div className="flex items-start gap-2 border border-red-300 bg-red-50 p-4 rounded-lg text-sm text-red-700">
              //   <AlertCircle className="w-5 h-5 mt-0.5" />
              //   {`Provide updated credit report valid till closing as provided
              //   credit report has expired on ${expirationDate.toISOString().split("T")[0]}.`}
              // </div>
              <EditableCondition
                type="condition"
                value={
                  CreditCondition.expiredCR ||
                  `Provide updated credit report valid till closing as provided
                credit report has expired on ${expirationDate.toISOString().split("T")[0]}.`
                }
                onChange={(val) => setCreditCondition({ expiredCR: val })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditReportValidity;
