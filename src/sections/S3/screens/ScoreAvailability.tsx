import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import PromptRadio from "../../../components/PromptRadio";

import {
  //  CheckCircle,
  // ShieldAlert,
  AlertTriangle,
  FileCheck,
  Lock,
  BarChart3,
  FileWarning,
} from "lucide-react";

const ScoreAvailability = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { scoreAvailability, setScoreAvailability } = useSectionStore();
  const {
    freeze,
    twoBureaus,
    oneScore,
    ausRequiresNonTrad,
    validatedByDu,
    nonTradAvailable,
    documents,
    discrepancies,
  } = scoreAvailability;

  const checklistMap: Record<string, string[]> = {
    "Non-Traditional Credit Report / Credit Supplement": [
      "Borrower name, SSN, and current address is missing or mismatch with LOS ",
      "At least 2 non-traditional tradelines are not present ",
      "At least one housing expense and one non-housing expense are not included",
      "Tradelines does not reflect 12 months of history",
      "Delinquencies are reflected in last 12 months",
    ],

    "Cancelled Check": [
      "The borrower's name is not the payor. ",
      "Consecutive 12 months of cancelled check is not available.",
      "Delinquencies have been reflected in the last 12 months' cancelled check.",
      "Payee name is not the landlord's name ",
    ],

    VOR: [
      "Borrower name is not the tenant name",
      "Recent 12 months history not available",
      "Delinquencies reflected in last 12 months",
      "Landlord name is not present and cannot be verified. ",
      "VOR is not properly executed and filled out. ",
      "Discrepant information is present",
    ],

    "Electricity / Water / Other Bill": [
      "The borrower's name is not present on the bill. ",
      "Recent 12 months of borrower history is not available. ",
      "Delinquencies have been reflected in the last 12 months.",
      "Company name is not present and cannot be verified. ",
      "Discrepant information is present",
    ],
  };

  const documentOptions = Object.keys(checklistMap);

  /* ---------- BRANCH RULES ---------- */

  const showPrompt3 = freeze !== null && twoBureaus === "No";
  const showPrompt4 = showPrompt3 && oneScore === "No";
  const showPrompt5 = showPrompt4 && ausRequiresNonTrad === "Yes";
  const showPrompt6 = showPrompt5 && validatedByDu === "No";
  const showPrompt7 = showPrompt6 && nonTradAvailable === "Yes";

  const branchACondition = freeze === "Yes" && twoBureaus === "No";

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!freeze || !twoBureaus)
      toast.error("Please answer the first two prompts.");

    if (showPrompt3 && !oneScore)
      toast.error("Please answer the score availability prompt.");

    // if (showPrompt4 && !ausRequiresNonTrad)
    //   toast.error("Please confirm AUS requirement.");

    if (showPrompt5 && !validatedByDu)
      toast.error("Please confirm DU validation.");

    if (showPrompt6 && !nonTradAvailable)
      toast.error("Please confirm document availability.");

    if (showPrompt7 && documents.length === 0) {
      toast.error("Please select available documents.");
    }

    if (showPrompt7 && documents.length === 0) {
      toast.error("Please select available documents.");
    }

    navigate("/s3/qualifying-score");
  };

  const toggleDocument = (doc: string) => {
    const updated = documents.includes(doc)
      ? documents.filter((d) => d !== doc)
      : [...documents, doc];

    setScoreAvailability({ documents: updated });
  };

  const toggleDiscrepancy = (item: string) => {
    const updated = discrepancies.includes(item)
      ? discrepancies.filter((d) => d !== item)
      : [...discrepancies, item];

    setScoreAvailability({ discrepancies: updated });
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/section2-summary"),
    });
  }, [freeze, twoBureaus, oneScore]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Credit Score Availability
          </h2>
        </div>

        {/* INSTRUCTION */}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Determine whether sufficient credit scores are available for the
          borrower and whether non-traditional credit verification is required.
        </div>

        {/* CREDIT FREEZE BLOCK */}

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Lock className="w-5 h-5 text-gray-600" />
            Credit Freeze Verification
          </div>

          <PromptRadio
            label="Is credit freeze noted on credit report for this borrower ?"
            value={freeze}
            options={["Yes", "No"]}
            onChange={(v) => setScoreAvailability({ freeze: v })}
          />

          <PromptRadio
            label="Does credit report reflect scores from at least 2 bureaus?"
            value={twoBureaus}
            options={["Yes", "No"]}
            onChange={(v) => setScoreAvailability({ twoBureaus: v })}
          />

          {branchACondition && (
            <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Condition: Credit freeze present with insufficient bureau scores.
            </div>
          )}
        </div>

        {/* SCORE AVAILABILITY */}

        {showPrompt3 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Score Availability Review
            </div>

            <PromptRadio
              label="Does credit report reflect 1 score for borrower/co-borrower?"
              value={oneScore}
              options={["Yes", "No"]}
              onChange={(v) => setScoreAvailability({ oneScore: v })}
            />
          </div>
        )}

        {/* NON TRADITIONAL CREDIT */}

        {showPrompt4 && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <FileWarning className="w-5 h-5 text-gray-600" />
              Non-Traditional Credit Evaluation
            </div>

            <PromptRadio
              label="Check if AUS requires non-traditional credit history ? "
              value={ausRequiresNonTrad}
              options={["Yes", "No"]}
              onChange={(v) => setScoreAvailability({ ausRequiresNonTrad: v })}
            />

            {showPrompt5 && (
              <PromptRadio
                label="Is non-traditional credit history validated by DU” or “if DU indicates that third-party asset verification may satisfy requirements ?"
                value={validatedByDu}
                options={["Yes", "No"]}
                onChange={(v) => setScoreAvailability({ validatedByDu: v })}
              />
            )}

            {showPrompt6 && (
              <PromptRadio
                label="Check if the most recent Non-Traditional Credit Report / Credit Supplement/other documents are Available ? "
                value={nonTradAvailable}
                options={["Yes", "No"]}
                onChange={(v) => setScoreAvailability({ nonTradAvailable: v })}
              />
            )}

            {showPrompt7 && (
              <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <FileCheck className="w-5 h-5 text-gray-600" />
                  Document Availability
                </div>

                <p className="text-sm font-medium">
                  Check all the documents which are available:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {documentOptions.map((doc) => (
                    <label
                      key={doc}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={documents.includes(doc)}
                        onChange={() => toggleDocument(doc)}
                      />
                      <span className="text-sm">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="border rounded-xl p-6 bg-blue-50 border-blue-200 space-y-6">
                <div className="font-semibold text-gray-800">
                  Validation Checklist
                </div>

                {documents.map((doc) => (
                  <div key={doc} className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">{doc}</p>

                    {(checklistMap[doc] || []).map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={discrepancies.includes(item)}
                          onChange={() => toggleDiscrepancy(item)}
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {discrepancies.length > 0 && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Condition: Non-traditional credit documentation discrepancy
                detected.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreAvailability;
