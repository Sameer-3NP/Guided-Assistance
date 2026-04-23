import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useS1Store } from "../../../store/useS1Store";
import { useNavigate } from "react-router-dom";
import { Building, UserCheck, ShieldCheck, FileSearch } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

const SourceRequestIntegrity = () => {
  const { registerActions } = useFlowContext();
  const navigate = useNavigate();

  const {
    sourceRequestIntegrity,
    setSourceRequestIntegrity,
    sourceIntegrityConditions,
    setSourceIntegrityConditions,
  } = useS1Store();

  const {
    agencyName,
    agencyAddress,
    agencyPhone,
    lenderName,
    requestedRole,
    lastNameMatch,
    loanMatch,
  } = sourceRequestIntegrity;

  const allAgencyPresent =
    agencyName === "yes" &&
    agencyAddress === "yes" &&
    agencyPhone === "yes" &&
    lenderName === "yes";

  const requestedByBorrower = requestedRole === "Borrower";
  const lastNameMatches = lastNameMatch === "yes";

  const missingFields: string[] = [];

  if (agencyName === "no") missingFields.push("Agency Name");
  if (agencyAddress === "no") missingFields.push("Agency Address");
  if (agencyPhone === "no") missingFields.push("Agency Phone");
  if (lenderName === "no") missingFields.push("Lender Name");
  if (requestedByBorrower) missingFields.push("requested by borrower");
  if (lastNameMatch === "no")
    missingFields.push(
      `requested by the ${requestedRole} & last name matches the borrower’s last name`,
    );

  const missingTextReadable =
    missingFields.length > 1
      ? missingFields.slice(0, -1).join(", ") +
        " and " +
        missingFields.slice(-1)
      : missingFields[0] || "";

  const handleContinue = () => {
    if (!agencyName || !agencyAddress || !agencyPhone || !lenderName) {
      toast.error("Please answer all Agency Information fields");
      return;
    }

    if (allAgencyPresent) {
      if (!requestedRole || !lastNameMatch) {
        toast.error("Please complete Requested By section");
        return;
      }
    }

    if (allAgencyPresent && !requestedByBorrower && !lastNameMatches) {
      if (!loanMatch) {
        toast.error("Please confirm LOS loan number alignment");
      }
    }

    navigate("/s1/system-alignment-review");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/credit-report-validity"),
    });
  }, [sourceRequestIntegrity, navigate]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Credit Report Source & Request Integrity
          </h2>
        </div>

        {/* GROUP A — Agency Info */}
        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Building className="w-5 h-5 text-gray-600" />
            Agency Information
          </div>

          {[
            ["Agency Name present?", "agencyName"],
            ["Agency Address present?", "agencyAddress"],
            ["Agency Phone present?", "agencyPhone"],
            ["Lender Name present?", "lenderName"],
          ].map(([label, field]) => (
            <div key={field} className="flex items-center justify-between">
              <p className="text-sm text-gray-700">{label}</p>

              <div className="flex gap-6">
                {["yes", "no"].map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={sourceRequestIntegrity[field] === val}
                      onChange={() =>
                        setSourceRequestIntegrity({ [field]: val })
                      }
                      className={`accent-${val === "yes" ? "blue" : "red"}-500`}
                    />
                    {val === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Missing Agency Warning */}
        {!allAgencyPresent &&
          agencyName &&
          agencyAddress &&
          agencyPhone &&
          lenderName && (
            <EditableCondition
              type="condition"
              value={sourceIntegrityConditions.missingAgency.replace(
                /{missingFields}/g,
                missingTextReadable,
              )}
              onChange={(val) =>
                setSourceIntegrityConditions({
                  missingAgency: val,
                })
              }
            />
          )}

        {/* GROUP B — Requested By */}
        {allAgencyPresent && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <UserCheck className="w-5 h-5 text-gray-600" />
              Requested By Verification
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Requested By Role
              </label>

              <select
                value={requestedRole}
                onChange={(e) =>
                  setSourceRequestIntegrity({ requestedRole: e.target.value })
                }
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="">Select</option>
                <option value="Loan Officer">Loan Officer</option>
                <option value="Loan Processor">Loan Processor</option>
                <option value="Borrower">Borrower</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
                {/* <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" /> */}
                <p className="text-sm text-black leading-relaxed font-semibold">
                  Does the Requested By last name match the Borrower last name ?
                </p>
              </div>

              <div className="flex gap-6">
                {["yes", "no"].map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={lastNameMatch === value}
                      onChange={() =>
                        setSourceRequestIntegrity({ lastNameMatch: value })
                      }
                      className={`accent-${
                        value === "yes"
                          ? "blue"
                          : value === "no"
                            ? "red"
                            : "gray"
                      }-500`}
                    />

                    {value === "unknown"
                      ? "Unable to determine"
                      : value.charAt(0).toUpperCase() + value.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {requestedByBorrower && (
          <EditableCondition
            type="condition"
            value={sourceIntegrityConditions.requestedByIssue.replace(
              /{missingFields}/g,
              missingTextReadable,
            )}
            onChange={(val) =>
              setSourceIntegrityConditions({
                requestedByIssue: val,
              })
            }
          />
        )}

        {lastNameMatch === "no" && (
          <EditableCondition
            type="condition"
            value={sourceIntegrityConditions.requestedByIssue.replace(
              /{missingFields}/g,
              missingTextReadable,
            )}
            onChange={(val) =>
              setSourceIntegrityConditions({
                requestedByIssue: val,
              })
            }
          />
        )}

        {/* GROUP C — LOS Alignment */}
        {allAgencyPresent && !requestedByBorrower && !lastNameMatches && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <FileSearch className="w-5 h-5 text-gray-600" />
              LOS Alignment Verification
            </div>

            <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" /> */}

              <p className="text-sm text-black leading-relaxed font-semibold">
                Does the loan number match the Loan Origination System (LOS) ?
              </p>
            </div>

            <div className="flex gap-10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={loanMatch === "yes"}
                  onChange={() =>
                    setSourceRequestIntegrity({ loanMatch: "yes" })
                  }
                  className="accent-blue-500"
                />
                Yes
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={loanMatch === "no"}
                  onChange={() =>
                    setSourceRequestIntegrity({ loanMatch: "no" })
                  }
                  className="accent-red-500"
                />
                No
              </label>
            </div>
          </div>
        )}

        {loanMatch === "no" && (
          <EditableCondition
            type="condition"
            value={sourceIntegrityConditions.loanMismatch}
            onChange={(val) =>
              setSourceIntegrityConditions({
                loanMismatch: val,
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default SourceRequestIntegrity;
