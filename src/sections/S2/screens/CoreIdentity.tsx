import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useSectionStore } from "../../../store/SectionStore";
import { useNavigate } from "react-router-dom";

import {
  User,
  Shield,
  Calendar,
  // HelpCircle,
  // CheckCircle,
  // XCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

type QuestionProps = {
  label: string;
  value: string | null;
  field: string;
  options?: string[];
  onChange: (field: string, value: string) => void;
};

const Question = ({
  label,
  value,
  field,
  options = ["Matches", "Does Not Match", "Missing"],
  onChange,
}: QuestionProps) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3 bg-blue-100 border border-blue-200 rounded-lg p-3">
      {/* <HelpCircle className="w-5 h-5 text-red-400 mt-0.5" /> */}
      <p className="text-md text-black font-semibold ">{label}</p>
    </div>

    <div className="flex gap-10">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(field, opt)}
            className="accent-blue-500"
          />

          {/* {opt === "Matches" && (
            <CheckCircle className="w-4 h-4 text-blue-500" />
          )}
          {opt === "Does Not Match" && (
            <XCircle className="w-4 h-4 text-blue-500" />
          )}
          {opt === "Missing" && (
            <AlertTriangle className="w-4 h-4 text-blue-500" />
          )}
          {opt === "Yes" && <CheckCircle className="w-4 h-4 text-blue-500" />}
          {opt === "No" && <XCircle className="w-4 h-4 text-blue-500" />} */}

          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CoreIdentity = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const { coreIdentity, setCoreIdentity } = useSectionStore();
  const { firstLastName, middleName, suffix, ssn, dob, akaSsn } = coreIdentity;

  const handleContinue = () => {
    if (!firstLastName)
      return toast.error("Please answer the First/Last Name prompt.");

    if (!middleName)
      return toast.error("Please answer the Middle Name prompt.");

    if (!suffix) return toast.error("Please answer the Suffix prompt.");

    if (!ssn) return toast.error("Please answer the SSN prompt.");

    if (!dob) return toast.error("Please answer the DOB prompt.");

    if (!akaSsn)
      return toast.error("Please answer the Additional / AKA SSN prompt.");

    const hasNameMismatch =
      firstLastName !== "Matches" ||
      middleName !== "Matches" ||
      suffix !== "Matches";

    const hasSsnMismatch = ssn !== "Matches";
    const hasDobMismatch = dob !== "Matches";
    const hasAkaSsn = akaSsn === "Yes";

    if (hasNameMismatch || hasSsnMismatch || hasDobMismatch || hasAkaSsn) {
      toast(
        "Identity Conditions noted. Please mark specific conditions as raised.",
        { icon: "⚠️" },
      );
    }

    navigate("/s2/core-identity-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/section1-summary"),
    });
  }, [firstLastName, middleName, suffix, ssn, dob, akaSsn]);

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        <div className="flex items-center gap-3">
          <FileCheck className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Borrower Core Identity Verification
          </h2>
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <User className="w-5 h-5 text-gray-600" />
            Borrower Name Verification
          </div>

          <Question
            label="Does the borrower First/Last name on the credit report match the loan application?"
            value={firstLastName}
            field="firstLastName"
            onChange={(f, v) => setCoreIdentity({ [f]: v })}
          />

          {firstLastName &&
            firstLastName !== "Matches" &&
            firstLastName !== "Missing" && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Alert: First and Last Name mismatch detected
              </div>
            )}

          {firstLastName && firstLastName === "Missing" && (
            <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              Alert: First and Last Name missing
            </div>
          )}

          {firstLastName && (
            <Question
              label="Does the borrower Middle Name match the loan application?"
              value={middleName}
              field="middleName"
              onChange={(f, v) => setCoreIdentity({ [f]: v })}
            />
          )}

          {middleName &&
            middleName !== "Matches" &&
            middleName !== "Missing" && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Alert: Middle Name mismatch detected
              </div>
            )}

          {middleName && middleName === "Missing" && (
            <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              Alert: Middle Name missing
            </div>
          )}

          {middleName && (
            <Question
              label="Does the borrower suffix match the loan application?"
              value={suffix}
              field="suffix"
              onChange={(f, v) => setCoreIdentity({ [f]: v })}
            />
          )}

          {suffix && suffix !== "Matches" && suffix !== "Missing" && (
            <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Alert: Suffix mismatch detected
            </div>
          )}

          {suffix && suffix === "Missing" && (
            <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              Alert: Suffix missing
            </div>
          )}
        </div>

        {suffix && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Shield className="w-5 h-5 text-gray-600" />
              SSN Verification
            </div>

            <Question
              label="Is SSN matching with the loan application?"
              value={ssn}
              field="ssn"
              onChange={(f, v) => setCoreIdentity({ [f]: v })}
            />

            {ssn && ssn !== "Matches" && ssn !== "Missing" && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Alert: SSN mismatch or missing
              </div>
            )}

            {ssn && ssn !== "Matches" && ssn === "Missing" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Alert: SSN missing
              </div>
            )}
          </div>
        )}

        {ssn && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Calendar className="w-5 h-5 text-gray-600" />
              DOB / AKA SSN Verification
            </div>

            <Question
              label="Does Date of Birth match the loan application?"
              value={dob}
              field="dob"
              onChange={(f, v) => setCoreIdentity({ [f]: v })}
            />

            {dob && dob !== "Matches" && dob !== "Missing" && (
              <div className="flex items-center gap-2 border border-red-400 bg-red-50 p-3 rounded text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Alert: DOB mismatch or missing
              </div>
            )}

            {dob && dob !== "Matches" && dob === "Missing" && (
              <div className="flex items-center gap-2 border border-yellow-400 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Alert: DOB missing
              </div>
            )}

            {dob && (
              <Question
                label="Is any additional or AKA SSN reflected on the credit report ?"
                value={akaSsn}
                field="akaSsn"
                options={["No", "Yes"]}
                onChange={(field, value) => setCoreIdentity({ [field]: value })}
              />
            )}

            {akaSsn === "Yes" && (
              <div className="flex items-center gap-2 border border-orange-400 bg-orange-50 p-3 rounded text-sm text-orange-800">
                <AlertTriangle className="w-4 h-4" />
                Condition: Additional SSN requires verification
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreIdentity;
