import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";
import PromptRadio from "../../../components/PromptRadio";

import { FileCheck, Lock, BarChart3, FileWarning } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

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
  }, []);

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
            <EditableCondition
              type="condition"
              value={
                scoreAvailability.branchACondition ||
                "Credit Freeze is marked as Yes and less than 2 scores are noted on credit report. Obtain updated credit report removing freeze."
              }
              onChange={(val) =>
                setScoreAvailability({ branchACondition: val })
              }
            />
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

            {oneScore === "No" && (
              <EditableCondition
                type="condition"
                value={
                  scoreAvailability.freezeCondition ||
                  "Credit Freeze is marked as No and no scores are noted on credit report. Review the availability of non-traditional credit report."
                }
                onChange={(val) =>
                  setScoreAvailability({ freezeCondition: val })
                }
              />
            )}
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

            {nonTradAvailable === "No" && (
              <EditableCondition
                type="alert"
                value={
                  scoreAvailability.oneScoreCondition ||
                  "Borrower [Borrower Name] do not have a credit score and non-traditional credit report/credit supplement is missing in file. Please provide the same."
                }
                onChange={(val) =>
                  setScoreAvailability({ oneScoreCondition: val })
                }
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
              <div className="border rounded-xl bg-white shadow-sm space-y-4 overflow-hidden">
                {/* Grouped discrepancy list */}
                <div className="px-6 pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">
                      Selected discrepancies
                    </span>
                    <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      {discrepancies.length} item
                      {discrepancies.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {(() => {
                    let globalIdx = 0;
                    return documents.map((doc, docIdx) => {
                      const items = (checklistMap[doc] || []).filter((item) =>
                        discrepancies.includes(item),
                      );
                      if (!items.length) return null;

                      return (
                        <div key={doc} className="space-y-1">
                          {docIdx > 0 && (
                            <hr className="border-gray-100 mb-3" />
                          )}
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {doc}
                          </p>
                          {items.map((item) => {
                            const letter = String.fromCharCode(
                              97 + globalIdx++,
                            );
                            return (
                              <div
                                key={item}
                                className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0"
                              >
                                <span className="min-w-[20px] h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500 mt-0.5 flex-shrink-0">
                                  {letter}
                                </span>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                  {item}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Generated condition
                  </p>
                  <EditableCondition
                    type="condition"
                    value={
                      scoreAvailability.discrepanciesCondition ||
                      (() => {
                        const selectedLines: string[] = [];
                        documents.forEach((doc) => {
                          (checklistMap[doc] || [])
                            .filter((item) => discrepancies.includes(item))
                            .forEach((item) => selectedLines.push(item));
                        });
                        const lettered = selectedLines
                          .map(
                            (line, i) =>
                              `${String.fromCharCode(97 + i)}) ${line}`,
                          )
                          .join("\n");
                        return `${documents.join(" / ")} has been received for borrower [Borrower Name] however, same does not meet the agency guidelines requirement and has below discrepancy/missing information:\n\n${lettered}\n\nUpdated nontraditional credit report/credit supplement/supporting document is required.`;
                      })()
                    }
                    onChange={(val) =>
                      setScoreAvailability({ discrepanciesCondition: val })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreAvailability;
