import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFlowContext } from "../../../store/FlowContext";
import { useS5Store } from "../../../store/useS5Store";
import { useS1Store } from "../../../store/useS1Store";

import PromptRadio from "../../../components/PromptRadio";
import PopUp from "../../../components/PopUp";
import { AlertTriangle } from "lucide-react";

// ---------------------------------------------------------------------------
// Type (mirrors useS5Store shape)
// ---------------------------------------------------------------------------
type JudgmentHandlingState = {
  judgmentTypes: string[];
  selectedAccount: { creditorName: string; accountNumber: string };
  judgmentStatus: string[];
  releasedCreditorName: string;
  releasedCaseNumber: string;
  releasedDate: string;
  notReleasedCreditorName: string;
  notReleasedCaseNumber: string;
  releaseDateBeforeAppDate: string | null;
  judgmentSourceDocsProvided: string | null;
  judgmentDocTypes: string[];
  bankStatementChecklist: string[];
  checkChecklist: string[];
  giftLetterChecklist: string[];
  judgmentAdditionalDocsProvided: string | null;
  judgmentDocTypes3: string[];
  creditorLetterChecklist3: string[];
  bankStatementChecklist3: string[];
  checkChecklist3: string[];
  giftLetterChecklist3: string[];
  losUpdatedForJudgment: string | null;
  payoffAvailable: string | null;
  payoffChecklist: string[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const InfoBox = ({
  color,
  text,
}: {
  color: "green" | "yellow" | "red" | "blue";
  text: string;
}) => {
  const styles = {
    green: "border-green-400 bg-green-50 text-green-700",
    yellow: "border-yellow-400 bg-yellow-50 text-yellow-700",
    red: "border-red-400 bg-red-50 text-red-700",
    blue: "border-blue-400 bg-blue-50 text-blue-700",
  };
  return (
    <div className={`border ${styles[color]} p-3 rounded-xl text-sm`}>
      {text}
    </div>
  );
};

const SectionCard = ({
  children,
  shade = "gray",
}: {
  children: React.ReactNode;
  shade?: "gray" | "blue";
}) => (
  <div
    className={`border rounded-xl p-6 space-y-4 ${shade === "blue" ? "bg-blue-50" : "bg-gray-50"}`}
  >
    {children}
  </div>
);

const PromptLabel = ({ text }: { text: string }) => (
  <div className="text-md font-medium text-gray-800">{text}</div>
);

const TextInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      className="w-full border rounded-md p-2 text-sm mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="date"
      className="w-full border rounded-md p-2 text-sm mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const CheckboxList = ({
  items,
  checked,
  onChange,
}: {
  items: string[];
  checked: string[];
  onChange: (updated: string[]) => void;
}) => (
  <div className="space-y-3 text-sm">
    {items.map((item) => (
      <label key={item} className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 shrink-0"
          checked={checked.includes(item)}
          onChange={(e) => {
            const updated = e.target.checked
              ? [...checked, item]
              : checked.filter((i) => i !== item);
            onChange(updated);
          }}
        />
        <span>{item}</span>
      </label>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const JudgmentHandling = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();
  const [showCreditInventoryPopup, setShowCreditInventoryPopup] =
    useState(false);
  const [popupDestination, setPopupDestination] = useState<
    "inventory" | "final"
  >("final");

  const { judgmentHandling, setJudgmentHandling } = useS5Store();
  const { s1 } = useS1Store();
  const creditReports = s1;

  const jh = judgmentHandling as JudgmentHandlingState;

  // ── Derived visibility flags ──────────────────────────────────────────────

  /** Prompt 1 answered "Yes" */
  const p1Yes = jh.judgmentTypes.includes("Yes");

  /** Judgment is Released */
  const isReleased = jh.judgmentStatus.includes("Released");
  /** Judgment is Not Released */
  const isNotReleased = jh.judgmentStatus.includes("Not Released");

  /** 2a: release date NOT before app date → show 2b */
  const show2b = isReleased && jh.releaseDateBeforeAppDate === "No";

  /** 2b: docs provided → show 2c */
  const show2c = show2b && jh.judgmentSourceDocsProvided === "Yes";

  // Checklist sections (2d / 2e / 2f) are visible when the corresponding
  // doc type is selected in 2c
  const show2d = show2c && jh.judgmentDocTypes.includes("Bank statement");
  const show2e =
    show2c && jh.judgmentDocTypes.includes("Cancelled check/cashier's check");
  const show2f = show2c && jh.judgmentDocTypes.includes("Gift letter");

  /**
   * Whether any Prompt-2 checklist has a discrepancy selected.
   * If true → Condition 1 / Branch A3 is triggered and we do NOT proceed to
   * Prompt 3.
   */
  const has2Discrepancy =
    jh.bankStatementChecklist.length > 0 ||
    jh.checkChecklist.length > 0 ||
    jh.giftLetterChecklist.length > 0;

  /**
   * Prompt 3 should appear when:
   *  (a) "Not Released" is selected (skip 2b/2c entirely), OR
   *  (b) Released path went through 2c and NO discrepancy was found in
   *      any of the Prompt-2 checklists (clean pass-through to Prompt 3),
   *  AND in case (b), at least one doc-type checkbox was visible (i.e. 2c
   *  was reached).
   *
   * According to spec:
   *   • If checklist NOT filled → Proceed to Prompt 3
   *   • If checklist filled with discrepancy → Condition 1 / Branch A3
   *
   * We also reach Prompt 3 directly from "Not Released".
   */
  const showPrompt3 =
    p1Yes &&
    (isNotReleased ||
      (show2c && !has2Discrepancy) ||
      // Edge case: 2b answered No → Condition 2 fires; no Prompt 3 in this path
      // Edge case: 2c reached but no doc types selected yet → still show Prompt 3
      (show2b && jh.judgmentSourceDocsProvided === "No"
        ? false
        : show2b &&
          jh.judgmentSourceDocsProvided === "Yes" &&
          !has2Discrepancy));

  /** Prompt 3a: borrower provided additional supporting docs */
  const showPrompt3a =
    showPrompt3 && jh.judgmentAdditionalDocsProvided === "Yes";

  const show3b =
    showPrompt3a && jh.judgmentDocTypes3.includes("Letter from creditor");
  const show3c =
    showPrompt3a && jh.judgmentDocTypes3.includes("Bank statement");
  const show3d =
    showPrompt3a &&
    jh.judgmentDocTypes3.includes("Cancelled check/cashier's check");
  const show3e = showPrompt3a && jh.judgmentDocTypes3.includes("Gift letter");

  const has3Discrepancy =
    jh.creditorLetterChecklist3.length > 0 ||
    jh.bankStatementChecklist3.length > 0 ||
    jh.checkChecklist3.length > 0 ||
    jh.giftLetterChecklist3.length > 0;

  /**
   * Prompt 4 appears after Prompt 3 path completes:
   *  • Prompt 3 answered "No" (no additional docs), OR
   *  • Prompt 3a doc checklists filled with no discrepancy (clean), OR
   *  • Prompt 3a doc checklists all empty (none selected → proceed to 4)
   */
  const showPrompt4 =
    showPrompt3 &&
    (jh.judgmentAdditionalDocsProvided === "No" ||
      (showPrompt3a && !has3Discrepancy));

  const showPrompt4a = showPrompt4 && jh.losUpdatedForJudgment === "Yes";
  const showPrompt4b = showPrompt4a && jh.payoffAvailable === "Yes";

  // ── Navigation helpers ────────────────────────────────────────────────────
  const navigateAfterSection = () => {
    if (creditReports && creditReports.length > 0) {
      setPopupDestination("inventory");
    } else {
      setPopupDestination("final");
    }
    setShowCreditInventoryPopup(true);
  };

  const handleCreditInventoryConfirm = () => {
    setShowCreditInventoryPopup(false);
    if (popupDestination === "inventory") {
      navigate("/S1/inventory");
    } else {
      navigate("/S5/last-screen");
    }
  };

  // ── Continue handler ──────────────────────────────────────────────────────
  const handleContinue = () => {
    // ── Prompt 1 ──
    if (!jh.judgmentTypes || jh.judgmentTypes.length === 0) {
      toast.error("Please answer Prompt 1.");
      return;
    }

    // "No" → navigate away (popup handles it)
    if (jh.judgmentTypes.includes("No")) {
      navigateAfterSection();
      return;
    }

    // ── Prompt 2 ──
    if (jh.judgmentStatus.length === 0) {
      toast.error("Please select Released / Not Released in Prompt 2.");
      return;
    }

    // ── Released branch ──
    if (isReleased) {
      if (!jh.releasedCreditorName) {
        toast.error("Please enter Creditor Name for Released judgment.");
        return;
      }
      if (!jh.releasedCaseNumber) {
        toast.error("Please enter Case Number for Released judgment.");
        return;
      }
      if (!jh.releasedDate) {
        toast.error("Please enter Released Date.");
        return;
      }

      // 2a
      if (!jh.releaseDateBeforeAppDate) {
        toast.error("Please answer Prompt 2a.");
        return;
      }

      if (jh.releaseDateBeforeAppDate === "Yes") {
        // Navigate away
        navigateAfterSection();
        return;
      }

      // 2b
      if (!jh.judgmentSourceDocsProvided) {
        toast.error("Please answer Prompt 2b.");
        return;
      }

      if (jh.judgmentSourceDocsProvided === "No") {
        // Condition 2 / Branch A3 — operator must acknowledge
        toast.error(
          "Condition 2 triggered (Branch A3). Cannot proceed until resolved.",
        );
        return;
      }

      // 2c — at least one doc type should be selected (or operator proceeds to 3)
      // Per spec: if checklist not filled → proceed to Prompt 3
      // If discrepancy found → Condition 1 / Branch A3
      if (has2Discrepancy) {
        toast.error(
          "Condition 1 triggered (Branch A3). Cannot proceed until resolved.",
        );
        return;
      }
    }

    // ── Not Released branch ──
    if (isNotReleased) {
      if (!jh.releasedCreditorName && !jh.notReleasedCreditorName) {
        // creditor name for not-released path
      }
      // Spec says operator updates Creditor name + Case# for Not Released
      if (!jh.notReleasedCreditorName) {
        toast.error("Please enter Creditor Name for Not Released judgment.");
        return;
      }
      if (!jh.notReleasedCaseNumber) {
        toast.error("Please enter Case Number for Not Released judgment.");
        return;
      }
    }

    // ── Prompt 3 (if visible) ──
    if (showPrompt3) {
      if (!jh.judgmentAdditionalDocsProvided) {
        toast.error("Please answer Prompt 3.");
        return;
      }

      if (jh.judgmentAdditionalDocsProvided === "Yes") {
        // Prompt 3a checklists — if any discrepancy → Branch B2
        if (has3Discrepancy) {
          toast.error(
            "Condition triggered (Branch B2). Cannot proceed until resolved.",
          );
          return;
        }
      }
    }

    // ── Prompt 4 (if visible) ──
    if (showPrompt4) {
      if (!jh.losUpdatedForJudgment) {
        toast.error("Please answer Prompt 4.");
        return;
      }

      if (jh.losUpdatedForJudgment === "No") {
        toast.error(
          "Condition triggered (Branch B1). Cannot proceed until resolved.",
        );
        return;
      }

      // 4a
      if (!jh.payoffAvailable) {
        toast.error("Please answer Prompt 4a.");
        return;
      }

      if (jh.payoffAvailable === "No") {
        toast.error(
          "Condition triggered (Branch B6). Cannot proceed until resolved.",
        );
        return;
      }

      // 4b checklist
      if (jh.payoffChecklist.length > 0) {
        toast.error(
          "Condition triggered (Branch B7). Cannot proceed until resolved.",
        );
        return;
      }
    }

    // ── All clear ──
    toast.success("Judgment flow completed successfully.");
    navigateAfterSection();
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => navigate("/s5/tax-lien"),
    });
  }, [judgmentHandling]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {/* ── HEADER ── */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Judgment Handling (Released &amp; Not Released)
        </h2>

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 1 — Does credit report reflect a Judgment?
        ════════════════════════════════════════════════════════════════ */}
        <SectionCard>
          <PromptRadio
            label="Does Credit Report/lien and Judgment Report Reflect Judgment?"
            value={
              jh.judgmentTypes.includes("Yes")
                ? "Yes"
                : jh.judgmentTypes.includes("No")
                  ? "No"
                  : ""
            }
            options={["Yes", "No"]}
            onChange={(v) => {
              setJudgmentHandling({ judgmentTypes: [v] });
            }}
          />

          {jh.judgmentTypes.includes("No") && (
            <InfoBox
              color="blue"
              text="Move to Section 1 (if multiple credit reports available) else Final Screen."
            />
          )}
          {jh.judgmentTypes.includes("Yes") && (
            <InfoBox color="green" text="Proceed to Prompt 2." />
          )}
        </SectionCard>

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2 — Released or Not Released?
        ════════════════════════════════════════════════════════════════ */}
        {p1Yes && (
          <SectionCard>
            <PromptLabel text="Is the Judgment released or not released?" />

            <div className="space-y-3 text-sm">
              {(["Released", "Not Released"] as const).map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={jh.judgmentStatus.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...jh.judgmentStatus, option]
                        : jh.judgmentStatus.filter((i) => i !== option);
                      setJudgmentHandling({ judgmentStatus: updated });
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>

            {/* ── Released fields ── */}
            {isReleased && (
              <div className="border rounded-xl p-4 bg-white space-y-4 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Released — Judgment Details
                </p>
                <TextInput
                  label="Creditor Name"
                  value={jh.releasedCreditorName || ""}
                  onChange={(v) =>
                    setJudgmentHandling({ releasedCreditorName: v })
                  }
                />
                <TextInput
                  label="Case Number"
                  value={jh.releasedCaseNumber || ""}
                  onChange={(v) =>
                    setJudgmentHandling({ releasedCaseNumber: v })
                  }
                />
                <DateInput
                  label="Released Date"
                  value={jh.releasedDate || ""}
                  onChange={(v) => setJudgmentHandling({ releasedDate: v })}
                />
              </div>
            )}

            {/* ── Not Released fields ── */}
            {isNotReleased && (
              <div className="border rounded-xl p-4 bg-white space-y-4 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Not Released — Judgment Details
                </p>
                <TextInput
                  label="Creditor Name"
                  value={jh.notReleasedCreditorName || ""}
                  onChange={(v) =>
                    setJudgmentHandling({ notReleasedCreditorName: v })
                  }
                />
                <TextInput
                  label="Case Number"
                  value={jh.notReleasedCaseNumber || ""}
                  onChange={(v) =>
                    setJudgmentHandling({ notReleasedCaseNumber: v })
                  }
                />
              </div>
            )}

            {isNotReleased && (
              <InfoBox
                color="yellow"
                text="Not Released — proceed to Prompt 3."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2a — Is release date before application date?
        ════════════════════════════════════════════════════════════════ */}
        {isReleased && (
          <SectionCard>
            <PromptRadio
              label="Is the release date before the application date?"
              value={jh.releaseDateBeforeAppDate || ""}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({ releaseDateBeforeAppDate: v })
              }
            />

            {jh.releaseDateBeforeAppDate === "Yes" && (
              <InfoBox
                color="green"
                text="Move to Section 1 (if multiple credit reports available) else Final Screen."
              />
            )}
            {jh.releaseDateBeforeAppDate === "No" && (
              <InfoBox color="yellow" text="Proceed to Prompt 2b." />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2b — Has borrower provided source-of-funds documents?
        ════════════════════════════════════════════════════════════════ */}
        {show2b && (
          <SectionCard>
            <PromptRadio
              label="Has the borrower provided documents in file to verify the source of funds used to pay Judgment?"
              value={jh.judgmentSourceDocsProvided || ""}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({ judgmentSourceDocsProvided: v })
              }
            />

            {jh.judgmentSourceDocsProvided === "No" && (
              <InfoBox
                color="red"
                text="Condition 2 appears as per Branch A3 for Decision Logic A."
              />
            )}
            {jh.judgmentSourceDocsProvided === "Yes" && (
              <InfoBox color="green" text="Proceed to Prompt 2c." />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2c — What document has been received?
        ════════════════════════════════════════════════════════════════ */}
        {show2c && (
          <SectionCard>
            <PromptLabel text="What document has been received? (Select all that apply)" />

            <CheckboxList
              items={[
                "Bank statement",
                "Cancelled check/cashier's check",
                "Gift letter",
              ]}
              checked={jh.judgmentDocTypes}
              onChange={(updated) =>
                setJudgmentHandling({ judgmentDocTypes: updated })
              }
            />

            {jh.judgmentDocTypes.length === 0 && (
              <InfoBox
                color="yellow"
                text="No document selected — proceed to Prompt 3."
              />
            )}
            {jh.judgmentDocTypes.length > 0 && (
              <InfoBox
                color="green"
                text="Proceed to respective checklist (2d / 2e / 2f)."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2d — Bank Statement Checklist
        ════════════════════════════════════════════════════════════════ */}
        {show2d && (
          <SectionCard shade="blue">
            <PromptLabel text="If Bank statement is available:" />

            <CheckboxList
              items={[
                "Bank statement provided does not reflect borrower's name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report.",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the judgment and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
              ]}
              checked={jh.bankStatementChecklist}
              onChange={(updated) =>
                setJudgmentHandling({ bankStatementChecklist: updated })
              }
            />

            {jh.bankStatementChecklist.length > 0 && (
              <InfoBox
                color="red"
                text="Condition 1 appears as per Branch A3 for Decision Logic A."
              />
            )}
            {jh.bankStatementChecklist.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 3."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2e — Cancelled Check / Cashier's Check Checklist
        ════════════════════════════════════════════════════════════════ */}
        {show2e && (
          <SectionCard shade="blue">
            <PromptLabel text="If Cancelled Check/cashier's check is available:" />

            <CheckboxList
              items={[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against judgment.",
                "The check provided reflects payor name different than the borrower's name which is considered a gift; however, gift documents are missing in file.",
                "Cashier's check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
              ]}
              checked={jh.checkChecklist}
              onChange={(updated) =>
                setJudgmentHandling({ checkChecklist: updated })
              }
            />

            {jh.checkChecklist.length > 0 && (
              <InfoBox
                color="red"
                text="Condition 1 appears as per Branch A3 for Decision Logic A."
              />
            )}
            {jh.checkChecklist.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 3."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 2f — Gift Letter Checklist
        ════════════════════════════════════════════════════════════════ */}
        {show2f && (
          <SectionCard shade="blue">
            <PromptLabel text="If Gift letter is available:" />

            <CheckboxList
              items={[
                "Gift letter provided is not executed.",
                "Donor name on gift letter does not match with the check/bank statement available.",
                "Gift letter is not completely filled.",
              ]}
              checked={jh.giftLetterChecklist}
              onChange={(updated) =>
                setJudgmentHandling({ giftLetterChecklist: updated })
              }
            />

            {jh.giftLetterChecklist.length > 0 && (
              <InfoBox
                color="red"
                text="Condition 1 appears as per Branch A3 for Decision Logic A."
              />
            )}
            {jh.giftLetterChecklist.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 3."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3 — Has borrower provided additional supporting docs?
            Visible for: "Not Released" path, OR clean pass from 2c/2d/2e/2f
        ════════════════════════════════════════════════════════════════ */}
        {showPrompt3 && (
          <SectionCard>
            <PromptRadio
              label="Has any other supporting document reflecting judgment has been paid off and released provided by borrower?"
              value={jh.judgmentAdditionalDocsProvided || ""}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({ judgmentAdditionalDocsProvided: v })
              }
            />

            {jh.judgmentAdditionalDocsProvided === "No" && (
              <InfoBox color="yellow" text="Proceed to Prompt 4." />
            )}
            {jh.judgmentAdditionalDocsProvided === "Yes" && (
              <InfoBox color="green" text="Proceed to Prompt 3a." />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3a — What document has been received?
        ════════════════════════════════════════════════════════════════ */}
        {showPrompt3a && (
          <SectionCard>
            <PromptLabel text="What document has been received? (Select all that apply)" />

            <CheckboxList
              items={[
                "Letter from creditor",
                "Bank statement",
                "Cancelled check/cashier's check",
                "Gift letter",
              ]}
              checked={jh.judgmentDocTypes3}
              onChange={(updated) =>
                setJudgmentHandling({ judgmentDocTypes3: updated })
              }
            />

            {jh.judgmentDocTypes3.length === 0 && (
              <InfoBox
                color="yellow"
                text="No document selected — proceed to Prompt 4."
              />
            )}
            {jh.judgmentDocTypes3.length > 0 && (
              <InfoBox
                color="green"
                text="Proceed to respective checklist (3b / 3c / 3d / 3e)."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3b — Letter from Creditor Checklist
        ════════════════════════════════════════════════════════════════ */}
        {show3b && (
          <SectionCard shade="blue">
            <PromptLabel text="If letter from creditor is available:" />

            <CheckboxList
              items={[
                "Letter from creditor does not reflect case number matching with the one reflected on credit report.",
                "Letter from creditor does not reflect creditor name matching with the one reflected on credit report.",
                "Letter from creditor reflects pending amount matching with the one reflected on credit report and the same is not acceptable as it should reflect $0 balance.",
                "Letter from creditor is expired and not latest.",
                "Letter from creditor is available reflecting judgment is released however complete source of funds used to pay off the lien is not available.",
              ]}
              checked={jh.creditorLetterChecklist3}
              onChange={(updated) =>
                setJudgmentHandling({ creditorLetterChecklist3: updated })
              }
            />

            {jh.creditorLetterChecklist3.length > 0 && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B2 for Decision Logic B."
              />
            )}
            {jh.creditorLetterChecklist3.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 4."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3c — Bank Statement Checklist (Not Released / Prompt 3 path)
        ════════════════════════════════════════════════════════════════ */}
        {show3c && (
          <SectionCard shade="blue">
            <PromptLabel text="If Bank statement is available:" />

            <CheckboxList
              items={[
                "Bank statement provided does not reflect borrower's name hence it will be treated as Gift and Gift letter is not available.",
                "Bank statement provided reflects withdrawal towards the creditor however amount does not match exactly with the one reflected on credit report.",
                "Bank statement provided reflects withdrawal which matches with the amount mentioned on credit report but description does not reflect creditor name.",
                "Bank statement provided is for borrower and reflects large deposit just before paying off the Judgment and no other documents available in file to source the large deposit.",
                "Bank statement provided is for borrower and reflects undisclosed withdrawal which cannot be identified on credit report and hence clarification is required.",
                "Bank statement provided reflects withdrawal towards the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting judgment is released has not been received.",
              ]}
              checked={jh.bankStatementChecklist3}
              onChange={(updated) =>
                setJudgmentHandling({ bankStatementChecklist3: updated })
              }
            />

            {jh.bankStatementChecklist3.length > 0 && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B2 for Decision Logic B."
              />
            )}
            {jh.bankStatementChecklist3.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 4."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3d — Cancelled Check / Cashier's Check (Prompt 3 path)
        ════════════════════════════════════════════════════════════════ */}
        {show3d && (
          <SectionCard shade="blue">
            <PromptLabel text="If Cancelled Check/cashier's check is available:" />

            <CheckboxList
              items={[
                "Check available in file does not reflect payee name matching with creditor name.",
                "The amount on check is different than the amount mentioned in credit report against Judgment.",
                "The check provided reflects payor name different than the borrower's name which is considered a gift; however, gift documents are missing in file.",
                "Cashier's check provided with amount and creditor name matching however, bank statement reflecting withdrawal is missing.",
                "Cancelled check/cashier's check provided reflects payment to the creditor and amount matches exactly with the one reflected on credit report however letter from creditor reflecting judgment is released has not been received.",
              ]}
              checked={jh.checkChecklist3}
              onChange={(updated) =>
                setJudgmentHandling({ checkChecklist3: updated })
              }
            />

            {jh.checkChecklist3.length > 0 && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B2 for Decision Logic B."
              />
            )}
            {jh.checkChecklist3.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 4."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 3e — Gift Letter Checklist (Prompt 3 path)
        ════════════════════════════════════════════════════════════════ */}
        {show3e && (
          <SectionCard shade="blue">
            <PromptLabel text="If Gift letter is available:" />

            <CheckboxList
              items={[
                "Gift letter provided is not executed.",
                "Donor name on gift letter does not match with the check/bank statement available.",
                "Gift letter is not completely filled.",
                "Only gift letter is provided however, bank statement/check reflecting payment made to the creditor is not available.",
                "Only gift letter is provided along with the bank statement/check reflecting payment made to the creditor however, letter from creditor reflecting judgment is released is not available.",
              ]}
              checked={jh.giftLetterChecklist3}
              onChange={(updated) =>
                setJudgmentHandling({ giftLetterChecklist3: updated })
              }
            />

            {jh.giftLetterChecklist3.length > 0 && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B2 for Decision Logic B."
              />
            )}
            {jh.giftLetterChecklist3.length === 0 && (
              <InfoBox
                color="yellow"
                text="No discrepancy selected — proceed to Prompt 4."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 4 — Is LOS updated for judgment being paid off at closing?
        ════════════════════════════════════════════════════════════════ */}
        {showPrompt4 && (
          <SectionCard>
            <PromptRadio
              label="Is LOS updated for judgment being paid off at closing?"
              value={jh.losUpdatedForJudgment || ""}
              options={["Yes", "No"]}
              onChange={(v) =>
                setJudgmentHandling({ losUpdatedForJudgment: v })
              }
            />

            {jh.losUpdatedForJudgment === "No" && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B1 for Decision Logic B."
              />
            )}
            {jh.losUpdatedForJudgment === "Yes" && (
              <InfoBox color="green" text="Proceed to Prompt 4a." />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 4a — Do we have payoff in file?
        ════════════════════════════════════════════════════════════════ */}
        {showPrompt4a && (
          <SectionCard>
            <PromptRadio
              label="Do we have payoff in file for judgment getting paid off at closing?"
              value={jh.payoffAvailable || ""}
              options={["Yes", "No"]}
              onChange={(v) => setJudgmentHandling({ payoffAvailable: v })}
            />

            {jh.payoffAvailable === "No" && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B6 for Decision Logic B."
              />
            )}
            {jh.payoffAvailable === "Yes" && (
              <InfoBox color="green" text="Proceed to Prompt 4b." />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PROMPT 4b — Payoff Statement Checklist
        ════════════════════════════════════════════════════════════════ */}
        {showPrompt4b && (
          <SectionCard shade="blue">
            <PromptLabel text="Validate the checkpoint to review payoff and select all that apply:" />

            <CheckboxList
              items={[
                "Payoff statement provided different case number.",
                "Payoff statement provided different creditor name.",
                "Payoff statement is for different borrower.",
                "Payoff statement provided is not the latest copy.",
                "Payoff statement provided does not reflect payoff amount.",
              ]}
              checked={jh.payoffChecklist}
              onChange={(updated) =>
                setJudgmentHandling({ payoffChecklist: updated })
              }
            />

            {jh.payoffChecklist.length > 0 && (
              <InfoBox
                color="red"
                text="Condition appears as per Branch B7 for Decision Logic B."
              />
            )}
            {jh.payoffChecklist.length === 0 && (
              <InfoBox
                color="green"
                text="No discrepancies found — proceed to Section 1 (if multiple credit reports) else Final Screen."
              />
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════════════════════════════════
            Navigation Popup
        ════════════════════════════════════════════════════════════════ */}
        <PopUp
          open={showCreditInventoryPopup}
          title="Navigation Confirmation"
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          onConfirm={handleCreditInventoryConfirm}
          onClose={() => setShowCreditInventoryPopup(false)}
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium">Judgment handling complete.</p>
            <p className="mt-1">
              Do you want to move to{" "}
              {popupDestination === "inventory" ? (
                <>
                  <strong>Credit Inventory (Section 1)</strong>?
                </>
              ) : (
                <>
                  the <strong>Final Screen</strong>?
                </>
              )}
            </p>
          </div>
        </PopUp>
      </div>
    </div>
  );
};

export default JudgmentHandling;
