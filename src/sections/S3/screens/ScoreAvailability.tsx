import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";

const ScoreAvailability = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const [freeze, setFreeze] = useState<string | null>(null);
  const [twoBureaus, setTwoBureaus] = useState<string | null>(null);
  const [oneScore, setOneScore] = useState<string | null>(null);
  
  // Non-traditional credit fields
  const [ausRequiresNonTrad, setAusRequiresNonTrad] = useState<string | null>(null);
  const [validatedByDu, setValidatedByDu] = useState<string | null>(null);
  const [nonTradAvailable, setNonTradAvailable] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [checklistChecks, setChecklistChecks] = useState<string[]>([]);

  const showPrompt3 = (freeze === "No" && twoBureaus === "No") || (freeze === "Yes" && twoBureaus === "No");
  const branchACondition = freeze === "Yes" && twoBureaus === "No";

  const handleDocumentChange = (doc: string) => {
    setSelectedDocuments(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
  };

  const handleChecklistChange = (val: string) => {
    setChecklistChecks(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  const handleContinue = () => {
    // Validations
    if (!freeze || !twoBureaus) {
      toast.error("Please answer initial prompts.");
      return;
    }

    if (showPrompt3 && !oneScore) {
       toast.error("Please specify if a single score exists.");
       return;
    }

    // Direct advances
    if (freeze === "Yes" && twoBureaus === "Yes") {
      navigate("/s3/qualifying-score");
      return;
    }

    if (freeze === "No" && twoBureaus === "Yes") {
      navigate("/s3/qualifying-score");
      return;
    }

    if (showPrompt3 && oneScore === "Yes") {
      navigate("/s3/qualifying-score");
      return;
    }

    // Branch logic mapping
    if (showPrompt3 && oneScore === "No") {
      if (!ausRequiresNonTrad) {
         toast.error("Please specify if AUS requires non-traditional credit history.");
         return;
      }
      
      if (ausRequiresNonTrad === "No") {
        navigate("/s3/qualifying-score");
        return;
      }

      if (ausRequiresNonTrad === "Yes") {
         if (!validatedByDu) {
           toast.error("Please specify DU validation status.");
           return;
         }

         if (validatedByDu === "Yes") {
           navigate("/s3/qualifying-score");
           return;
         }

         if (validatedByDu === "No") {
           if (!nonTradAvailable) {
              toast.error("Please specify if non-traditional credit reports are available.");
              return;
           }

           if (nonTradAvailable === "Yes") {
              if (selectedDocuments.length === 0) {
                 toast.error("Please select received documents.");
                 return;
              }

              // Checklist logic handling
              if (checklistChecks.length === 0) {
                 // Non traditional satisfied
                 navigate("/s3/qualifying-score");
                 return;
              } else {
                 toast("Condition B logged for discrepancy", { icon: "⚠️" });
                 navigate("/s3/qualifying-score");
                 return;
              }
           } else {
              // Non trad not available
              toast("Condition B logged (Option 2).", { icon: "⚠️" });
              navigate("/s3/qualifying-score");
              return;
           }
         }
      }
    }
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s2/previous-address"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeze, twoBureaus, oneScore, ausRequiresNonTrad, validatedByDu, nonTradAvailable, selectedDocuments, checklistChecks, navigate, registerActions]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">3.1 Credit Score Availability & Freeze Handling</h2>

      <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
        <div className="mb-4">
           <p className="text-sm font-medium mb-2">Is credit freeze noted on credit report for this borrower?</p>
           <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={freeze === opt} onChange={() => setFreeze(opt)} />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
        </div>

        {freeze && (
           <div className="mb-4">
             <p className="text-sm font-medium mb-2">Does credit report reflect scores from at least 2 bureaus?</p>
             <div className="flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={twoBureaus === opt} onChange={() => setTwoBureaus(opt)} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
           </div>
        )}

        {branchACondition && (
           <div className="border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
             Alert: Condition required as per Branch A
           </div>
        )}

        {showPrompt3 && (
            <div className="mt-4 border-t pt-4">
             <p className="text-sm font-medium mb-2">Does credit report reflect 1 score for either borrower/co-borrower?</p>
             <div className="flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={oneScore === opt} onChange={() => setOneScore(opt)} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
           </div>
        )}

        {oneScore === "No" && (
           <div className="mt-4 border-t pt-4 space-y-4">
             <div className="border border-orange-400 bg-orange-50 p-3 rounded text-sm text-orange-800">
               Alert: Branch B (Investigate non-traditional credit) 
             </div>

             <p className="text-sm font-medium mb-2">Prompt 4: Check if AUS requires non-traditional credit history?</p>
             <div className="flex gap-4 mb-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={ausRequiresNonTrad === opt} onChange={() => setAusRequiresNonTrad(opt)} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
            </div>

            {ausRequiresNonTrad === "Yes" && (
              <>
                 <p className="text-sm font-medium mb-2">Prompt 5: Is non-traditional credit history validated by DU or satisfy requirements?</p>
                 <div className="flex gap-4 mb-4">
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={validatedByDu === opt} onChange={() => setValidatedByDu(opt)} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                </div>

                {validatedByDu === "No" && (
                  <>
                     <p className="text-sm font-medium mb-2">Prompt 6: Most recent Non-Traditional Reports Available?</p>
                     <div className="flex gap-4 mb-4">
                        {["Yes", "No"].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={nonTradAvailable === opt} onChange={() => setNonTradAvailable(opt)} />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                    </div>

                    {nonTradAvailable === "Yes" && (
                        <div className="space-y-3 bg-gray-50 border p-3 rounded mt-2">
                           <p className="text-sm font-medium">Check available documents:</p>
                           {["Non-Traditional Credit report / Credit Supplement", "Cancelled check", "VOR", "Electricity / Utility Bill"].map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={selectedDocuments.includes(opt)} onChange={() => handleDocumentChange(opt)} />
                                <span className="text-xs">{opt}</span>
                              </label>
                           ))}

                           {selectedDocuments.length > 0 && (
                              <div className="mt-4 border-t pt-4">
                                 <p className="text-sm font-medium text-red-600 mb-2">Discrepancy Check (Check if true)</p>
                                 {["Name/SSN mismatch", "Missing History", ">12 mo delinquencies"].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={checklistChecks.includes(opt)} onChange={() => handleChecklistChange(opt)} />
                                      <span className="text-xs">{opt}</span>
                                    </label>
                                 ))}
                              </div>
                           )}
                        </div>
                    )}
                  </>
                )}
              </>
            )}
           </div>
        )}
      </div>
    </div>
  );
};

export default ScoreAvailability;
