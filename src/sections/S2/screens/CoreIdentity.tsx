import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFlowContext } from "../../../store/FlowContext";
import { useSectionStore } from "../../../store/SectionStore";
import { useNavigate } from "react-router-dom";
import { User, Shield, Calendar, FileCheck } from "lucide-react";
import EditableCondition from "../../../components/EditableCondition";

/* =========================
   🧠 Dynamic Message Builder
========================= */

const getIssueText = (value: string) => {
  if (value === "Does Not Match") return "does not match";
  if (value === "Missing") return "is missing";
  return "";
};

const buildMessage = (fieldLabel: string, value: string) => {
  const issue = getIssueText(value);
  return `Borrower identity information - ${fieldLabel} on the credit report ${issue} when compared to borrower details reflected in the loan application. Please provide corrected documentation or re-pull the credit report.`;
};

const nameConfig = [
  {
    key: "firstLastName",
    label: `Does the borrower First/last name on the credit report match the borrower’s first/last name on the loan application ?`,
    options: ["Matches", "Does Not Match", "Missing"],
    showCondition: (ctx: any) =>
      ctx.firstLastName && ctx.firstLastName !== "Matches",
    getMessage: (ctx: any) =>
      buildMessage("first & last name", ctx.firstLastName),
  },
  {
    key: "middleName",
    label:
      "Does the borrower Middle Name on the credit report match the borrower’s Middle Name on the loan application?",
    options: ["Matches", "Does Not Match", "Missing"],
    showCondition: (ctx: any) => ctx.middleName && ctx.middleName !== "Matches",
    getMessage: (ctx: any) =>
      ctx.middleName === "Missing"
        ? "Borrower’s Middle name is either missing on credit reports or does not match with LOS. Review lender’s requirement and proceed accordingly"
        : "Borrower’s Middle name is either missing on credit reports or does not match with LOS. Review lender’s requirement and proceed accordingly",
  },
  {
    key: "suffix",
    label:
      "Does the borrower suffix on the credit report match the borrower’s suffix on the loan application?",
    options: ["Matches", "Does Not Match", "Missing"],
    showCondition: (ctx: any) => ctx.suffix && ctx.suffix !== "Matches",
    getMessage: (ctx: any) => buildMessage("suffix", ctx.suffix),
  },
];

const ssnConfig = [
  {
    key: "ssn",
    label:
      "Is SSN, if displayed on the credit report, matches with the loan application?",
    options: ["Matches", "Does Not Match", "Missing"],
    showCondition: (ctx: any) => ctx.ssn && ctx.ssn !== "Matches",
    getMessage: (ctx: any) => buildMessage("SSN", ctx.ssn),
  },
];

const dobConfig = [
  {
    key: "dob",
    label:
      "Does Date of Birth on the credit report match the loan application?",
    options: ["Matches", "Does Not Match", "Missing"],
    showCondition: (ctx: any) => ctx.dob && ctx.dob !== "Matches",
    getMessage: (ctx: any) => buildMessage("Date of Birth", ctx.dob),
  },
  {
    key: "akaSsn",
    label: "Is any additional or AKA SSN reflected on the credit report?",
    options: ["No", "Yes"],
    showCondition: (ctx: any) => ctx.akaSsn === "Yes",
    getMessage: () =>
      "Borrower’s SSN verification is required as an additional SSN is reflected on the credit report.",
  },
];

/* =========================
   🧩 Question Component
========================= */

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
      <p className="text-md text-black font-semibold">{label}</p>
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
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

/* =========================
   🚀 MAIN COMPONENT
========================= */

const CoreIdentity = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();

  const {
    coreIdentity,
    setCoreIdentity,
    coreIdentityConditions,
    setCoreIdentityConditions,
  } = useSectionStore();

  const ctx = coreIdentity;
  type CoreIdentityKey =
    | "firstLastName"
    | "middleName"
    | "suffix"
    | "ssn"
    | "dob"
    | "akaSsn";

  /* =========================
     👉 Continue Logic
  ========================= */

  const handleContinue = () => {
    const requiredFields = [
      "firstLastName",
      "middleName",
      "suffix",
      "ssn",
      "dob",
      "akaSsn",
    ];

    for (const field of requiredFields) {
      if (!coreIdentity[field]) {
        return toast.error(`Please answer ${field}`);
      }
    }

    navigate("/s2/core-identity-summary");
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s1/section1-summary"),
    });
  }, [coreIdentity]);

  /* =========================
     🖥 UI
  ========================= */

  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* HEADER */}
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

          {nameConfig.map((q) => {
            const value = coreIdentity[q.key as CoreIdentityKey];
            return (
              <div key={q.key} className="space-y-4">
                <Question
                  label={q.label}
                  value={value}
                  field={q.key}
                  options={q.options}
                  onChange={(f, v) => setCoreIdentity({ [f]: v })}
                />

                {q.showCondition(coreIdentity) && (
                  <EditableCondition
                    type="condition"
                    value={
                      coreIdentityConditions[q.key] ||
                      q.getMessage(coreIdentity)
                    }
                    onChange={(val) =>
                      setCoreIdentityConditions({ [q.key]: val })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Shield className="w-5 h-5 text-gray-600" />
            SSN Verification
          </div>
          {ssnConfig.map((q) => {
            const value = coreIdentity[q.key];

            return (
              <div key={q.key} className="space-y-4">
                <Question
                  label={q.label}
                  value={value}
                  field={q.key}
                  options={q.options}
                  onChange={(f, v) => setCoreIdentity({ [f]: v })}
                />

                {q.showCondition(coreIdentity) && (
                  <EditableCondition
                    type="condition"
                    value={
                      coreIdentityConditions[q.key] ||
                      q.getMessage(coreIdentity)
                    }
                    onChange={(val) =>
                      setCoreIdentityConditions({ [q.key]: val })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Calendar className="w-5 h-5 text-gray-600" />
            DOB / AKA SSN Verification
          </div>

          {dobConfig.map((q) => {
            const value = coreIdentity[q.key];

            return (
              <div key={q.key} className="space-y-4">
                <Question
                  label={q.label}
                  value={value}
                  field={q.key}
                  options={q.options}
                  onChange={(f, v) => setCoreIdentity({ [f]: v })}
                />

                {q.showCondition(coreIdentity) && (
                  <EditableCondition
                    type="condition"
                    value={
                      coreIdentityConditions[q.key] ||
                      q.getMessage(coreIdentity)
                    }
                    onChange={(val) =>
                      setCoreIdentityConditions({ [q.key]: val })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoreIdentity;
