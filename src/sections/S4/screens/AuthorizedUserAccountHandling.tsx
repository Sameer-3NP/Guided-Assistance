import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useNavigate } from "react-router-dom";
import { useSectionStore } from "../../../store/SectionStore";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";

import { UserCheck, FileWarning } from "lucide-react";

const AuthorizedUserAccountHandling = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const { authorizedUserAccountHandling, setAuthorizedUserAccountHandling } =
    useSectionStore();

  const {
    creditorName,
    accountNumber,
    loanType,
    duAuthorizedAccount,
    duBorrowerQualify,
    duClauses,
    lpaAuthorizedAccount,
    lpaBorrowerQualify,
    lpaClauses,
  } = authorizedUserAccountHandling;

  const [showPopup, setShowPopup] = useState(true);
  //const [showPopup, setShowPopup] = useState(!(creditorName && accountNumber));

  /* ---------- POPUP ---------- */

  const handleAccountSubmit = () => {
    if (!creditorName || !accountNumber) {
      toast.error("Please enter account details.");
      return;
    }

    setShowPopup(false);
  };

  /* ---------- CONTINUE ---------- */

  const handleContinue = () => {
    if (!loanType) return toast.error("Please select loan type.");

    if (loanType === "DU") {
      if (!duAuthorizedAccount) return toast.error("Please answer prompt 2.");

      if (duAuthorizedAccount === "Yes" && !duBorrowerQualify)
        return toast.error("Please answer prompt 2a.");

      if (
        duAuthorizedAccount === "Yes" &&
        duBorrowerQualify === "No" &&
        !duClauses
      )
        return toast.error("Please answer prompt 2b.");
    }

    if (loanType === "LPA") {
      if (!lpaAuthorizedAccount) return toast.error("Please answer prompt 3.");

      if (lpaAuthorizedAccount === "Yes" && !lpaBorrowerQualify)
        return toast.error("Please answer prompt 3a.");

      if (
        lpaAuthorizedAccount === "Yes" &&
        lpaBorrowerQualify === "No" &&
        !lpaClauses
      )
        return toast.error("Please answer prompt 3b.");
    }

    navigate("/s4/duplicate-trade"); // screen 4.10
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s4/delinquency-late"),
    });
  }, [
    loanType,
    duAuthorizedAccount,
    duBorrowerQualify,
    duClauses,
    lpaAuthorizedAccount,
    lpaBorrowerQualify,
    lpaClauses,
  ]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <UserCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Authorized User Account Handling
          </h2>
        </div>

        {/* ACCOUNT POPUP */}

        <PopUp
          open={showPopup}
          title="Authorized User Account Details"
          icon={<FileWarning className="w-5 h-5 text-blue-500" />}
          onConfirm={handleAccountSubmit}
          confirmText="Continue"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Creditor name</label>
              <input
                type="text"
                value={creditorName ?? ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setAuthorizedUserAccountHandling({
                    creditorName: value,
                  });
                }}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="number"
                value={accountNumber ?? ""}
                onChange={(e) =>
                  setAuthorizedUserAccountHandling({
                    accountNumber: e.target.value,
                  })
                }
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </PopUp>

        {/* PROMPT 1 */}

        <div className="border rounded-xl p-6 bg-gray-50">
          <PromptRadio
            label="Is this a DU loan or LPA loan?"
            value={loanType}
            options={["DU", "LPA"]}
            onChange={(v) => setAuthorizedUserAccountHandling({ loanType: v })}
          />
        </div>

        {/* DU FLOW */}

        {loanType === "DU" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="If DU, does credit report reflect any authorized account?"
              value={duAuthorizedAccount}
              options={["Yes", "No"]}
              onChange={(v) =>
                setAuthorizedUserAccountHandling({
                  duAuthorizedAccount: v,
                })
              }
            />

            {duAuthorizedAccount === "Yes" && (
              <PromptRadio
                label="Does borrower qualify after considering the authorized user's payment?"
                value={duBorrowerQualify}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setAuthorizedUserAccountHandling({
                    duBorrowerQualify: v,
                  })
                }
              />
            )}

            {duBorrowerQualify === "No" && (
              <PromptRadio
                label="Does DU give clauses to request additional documentation for an Authorized user account?"
                value={duClauses}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setAuthorizedUserAccountHandling({
                    duClauses: v,
                  })
                }
              />
            )}

            {duClauses === "Yes" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Conditions appears as per Branch 2
              </div>
            )}
          </div>
        )}

        {/* LPA FLOW */}

        {loanType === "LPA" && (
          <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
            <PromptRadio
              label="If LPA, does credit report reflect any authorized account?"
              value={lpaAuthorizedAccount}
              options={["Yes", "No"]}
              onChange={(v) =>
                setAuthorizedUserAccountHandling({
                  lpaAuthorizedAccount: v,
                })
              }
            />

            {lpaAuthorizedAccount === "Yes" && (
              <PromptRadio
                label="Does borrower qualify after considering the authorized user's payment?"
                value={lpaBorrowerQualify}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setAuthorizedUserAccountHandling({
                    lpaBorrowerQualify: v,
                  })
                }
              />
            )}

            {lpaBorrowerQualify === "No" && (
              <PromptRadio
                label="Does LPA give clauses to request additional documentation for an Authorized user account?"
                value={lpaClauses}
                options={["Yes", "No"]}
                onChange={(v) =>
                  setAuthorizedUserAccountHandling({
                    lpaClauses: v,
                  })
                }
              />
            )}

            {lpaClauses === "Yes" && (
              <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
                Conditions appears as per Branch 1
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorizedUserAccountHandling;
