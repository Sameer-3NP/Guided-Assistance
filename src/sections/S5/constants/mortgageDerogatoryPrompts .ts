export const mortgageDerogatoryPrompts = [
  /* PROMPT 1 */

  {
    id: "prompt-1",
    type: "checkbox",
    label:
      "Does credit report reflect any mortgage with the keywords below? (Select all that apply)",
    options: [
      "Foreclosure",
      "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
      "Mortgage Charge-Off",
    ],
    storeKey: "derogatoryTypes",
  },

  /* ---------------- FORECLOSURE ---------------- */
  /* ---------------- FORECLOSURE ---------------- */

  {
    id: "prompt-2",
    type: "radio",
    label:
      "Check if we have any documents available in file to validate the property associated with the mortgage?",
    options: ["Yes", "No"],
    storeKey: "foreclosureDocsAvailable",
    condition: (s: any) => s.derogatoryTypes?.includes("Foreclosure"),
  },

  /* ❗ CONDITION → Branch 4 (if NO) */

  {
    id: "condition-2-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 4 of decision logic A",
    condition: (s: any) => s.foreclosureDocsAvailable === "No",
  },

  /* ---------------- PROMPT 2A ---------------- */

  {
    id: "prompt-2a",
    type: "checkbox",
    label: "What documents are available in file? (Select all that apply)",
    options: ["Trustee’s deed", "Property Profile"],
    storeKey: "foreclosureDocTypes",
    condition: (s: any) => s.foreclosureDocsAvailable === "Yes",
  },

  /* ❗ ALERT → Branch 5 (NONE SELECTED) */

  {
    id: "alert-2a-none",
    type: "alert",
    variant: "warning",
    label:
      "Alert as per Branch 5. Escalate to management review or proceed based on other selections.",
    condition: (s: any) =>
      s.foreclosureDocsAvailable === "Yes" &&
      (!s.foreclosureDocTypes || s.foreclosureDocTypes.length === 0),
  },

  /* ---------------- PROMPT 2B ---------------- */

  {
    id: "prompt-2b",
    type: "checkbox",
    label: "Trustee's deed validation checklist",
    options: [
      "Party name i.e lender name does not match tradeline hence clarification is required",
      "Property addresses is not available.",
      "High Balance on tradeline does not match the amount mentioned on trustee's deed.",
      "Document is not executed/notarized (if applicable)",
      "Disposition / recording / transfer date is not clearly identifiable",
    ],
    storeKey: "trusteesDeedChecklist",
    condition: (s: any) => s.foreclosureDocTypes?.includes("Trustee’s deed"),
  },

  /* ---------------- PROMPT 2C ---------------- */

  {
    id: "prompt-2c",
    type: "checkbox",
    label: "Property profile validation checklist",
    options: [
      "Party name i.e lender name does not match tradeline",
      "Property addresses is not available.",
      "High Balance on tradeline does not match the amount mentioned on property profile as mortgage amount/loan amount.",
      "Disposition / recording / transfer date not clearly identifiable",
    ],
    storeKey: "propertyProfileChecklist",
    condition: (s: any) => s.foreclosureDocTypes?.includes("Property Profile"),
  },

  /* ❗ CONDITION → Branch 2 (if ANY checklist filled) */

  {
    id: "condition-2-checklist",
    type: "alert",
    variant: "error",
    label:
      "Condition appears as per Branch 2 for decision logic A (Select account from dropdown)",
    condition: (s: any) =>
      s.trusteesDeedChecklist?.length > 0 ||
      s.propertyProfileChecklist?.length > 0,
  },

  /* ---------------- PROMPT 2D ---------------- */

  {
    id: "prompt-2d",
    type: "radio",
    label:
      "From the available document, has the waiting period of 7 years met?",
    options: ["Yes", "No"],
    storeKey: "foreclosureWaitingPeriod",
    condition: (s: any) =>
      s.foreclosureDocsAvailable === "Yes" && s.foreclosureDocTypes?.length > 0,
  },

  /* ❗ CONDITION → Branch 3 */

  {
    id: "condition-2d-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 3 for decision logic A",
    condition: (s: any) => s.foreclosureWaitingPeriod === "No",
  },

  /* ---------------- PRE FORECLOSURE ---------------- */

  {
    id: "prompt-3",
    type: "radio",
    label:
      "Check if we have any documents available in file to validate the property associated with the mortgage?",
    options: ["Yes", "No"],
    storeKey: "preForeclosureDocsAvailable",
    condition: (s: any) =>
      s.derogatoryTypes?.includes(
        "Pre-Foreclosure / Short Sale / Deed-in-Lieu",
      ),
  },

  /* ❗ CONDITION → Branch 4 (Decision Logic B) */

  {
    id: "condition-3-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 4 for decision logic B",
    condition: (s: any) => s.preForeclosureDocsAvailable === "No",
  },

  /* ---------------- PROMPT 3A ---------------- */

  {
    id: "prompt-3a",
    type: "checkbox",
    label: "What documents are available in file? (Select all that apply)",
    options: [
      "Short Sale Approval Letter",
      "Settlement Statement (HUD-1 / Closing Disclosure)",
      "Property Profile",
    ],
    storeKey: "preForeclosureDocTypes",
    condition: (s: any) => s.preForeclosureDocsAvailable === "Yes",
  },

  /* ❗ ALERT → Branch 5 */

  {
    id: "alert-3a-none",
    type: "alert",
    variant: "warning",
    label:
      "Alert appears as per Branch 5 for decision logic B. Escalate to management review.",
    condition: (s: any) =>
      s.preForeclosureDocsAvailable === "Yes" &&
      (!s.preForeclosureDocTypes || s.preForeclosureDocTypes.length === 0),
  },

  /* ---------------- PROMPT 3B ---------------- */

  {
    id: "prompt-3b",
    type: "checkbox",
    label: "Short sale approval validation checklist",
    options: [
      "Party name i.e lender name on short sale letter do not match tradeline",
      "Property addresses is not available.",
      "Document is not executed/notarized (if applicable)",
      "Short sale / recording / transfer date not clearly identifiable",
    ],
    storeKey: "shortSaleChecklist",
    condition: (s: any) =>
      s.preForeclosureDocTypes?.includes("Short Sale Approval Letter"),
  },

  /* ---------------- PROMPT 3C ---------------- */

  {
    id: "prompt-3c",
    type: "checkbox",
    label: "Settlement statement validation checklist",
    options: [
      "Party name i.e lender name on closing disclosure on seller side does not match tradeline",
      "Property addresses is not available.",
      "Document is not executed (if applicable)",
      "Disposition / closing date not clearly identifiable",
    ],
    storeKey: "settlementChecklist",
    condition: (s: any) =>
      s.preForeclosureDocTypes?.includes(
        "Settlement Statement (HUD-1 / Closing Disclosure)",
      ),
  },

  /* ---------------- PROMPT 3D ---------------- */

  {
    id: "prompt-3d",
    type: "checkbox",
    label: "Property profile validation checklist",
    options: [
      "Party name i.e lender name does not match tradeline",
      "Property addresses is not available.",
      "Disposition / recording / transfer date not clearly identifiable",
    ],
    storeKey: "propertyProfileChecklistB",
    condition: (s: any) =>
      s.preForeclosureDocTypes?.includes("Property Profile"),
  },

  /* ❗ CONDITION → Branch 2 */

  {
    id: "condition-3-checklist",
    type: "alert",
    variant: "error",
    label:
      "Condition appears as per Branch 2 for decision logic B (Select account from dropdown)",
    condition: (s: any) =>
      s.shortSaleChecklist?.length > 0 ||
      s.settlementChecklist?.length > 0 ||
      s.propertyProfileChecklistB?.length > 0,
  },

  /* ---------------- PROMPT 3E ---------------- */

  {
    id: "prompt-3e",
    type: "radio",
    label:
      "From the available document, has the waiting period of 4 years met?",
    options: ["Yes", "No"],
    storeKey: "preForeclosureWaitingPeriod",
    condition: (s: any) =>
      s.preForeclosureDocsAvailable === "Yes" &&
      s.preForeclosureDocTypes?.length > 0,
  },

  /* ❗ CONDITION → Branch 3 */

  {
    id: "condition-3e-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 3 for decision logic B",
    condition: (s: any) => s.preForeclosureWaitingPeriod === "No",
  },

  /* ---------------- CHARGE OFF ---------------- */

  {
    id: "prompt-4",
    type: "radio",
    label:
      "Check if we have any documents available in file to validate the property associated with the mortgage?",
    options: ["Yes", "No"],
    storeKey: "chargeOffDocsAvailable",
    condition: (s: any) => s.derogatoryTypes?.includes("Mortgage Charge-Off"),
  },

  /* ❗ CONDITION → Branch 4 */

  {
    id: "condition-4-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 4 for decision logic C",
    condition: (s: any) => s.chargeOffDocsAvailable === "No",
  },

  /* ---------------- PROMPT 4A ---------------- */

  {
    id: "prompt-4a",
    type: "checkbox",
    label: "What documents are available in file? (Select all that apply)",
    options: ["Cancellation of debt", "Lender Letter Confirming disposition"],
    storeKey: "chargeOffDocTypes",
    condition: (s: any) => s.chargeOffDocsAvailable === "Yes",
  },

  /* ❗ ALERT → Branch 5 */

  {
    id: "alert-4a-none",
    type: "alert",
    variant: "warning",
    label:
      "Alert appears as per Branch 5 for decision logic C. Escalate to management review.",
    condition: (s: any) =>
      s.chargeOffDocsAvailable === "Yes" &&
      (!s.chargeOffDocTypes || s.chargeOffDocTypes.length === 0),
  },

  /* ---------------- PROMPT 4B ---------------- */

  {
    id: "prompt-4b",
    type: "checkbox",
    label: "Cancellation of debt validation checklist",
    options: [
      "Party name i.e creditor name and account number on 1099-C does not matches tradeline",
      "Property addresses are not available.",
      "Date of identifiable event not clearly identifiable",
      "Debt Description does not reflect Mortgage",
    ],
    storeKey: "cancellationChecklist",
    condition: (s: any) =>
      s.chargeOffDocTypes?.includes("Cancellation of debt"),
  },

  /* ---------------- PROMPT 4C ---------------- */

  {
    id: "prompt-4c",
    type: "checkbox",
    label: "Lender letter confirming disposition validation checklist",
    options: [
      "Party name i.e lender name on document available does not matches tradeline",
      "Property addresses is not available.",
      "Document is not executed/notarized (if applicable)",
      "Recording / transfer date not clearly identifiable",
      "No information provided for Debt cancelled account.",
    ],
    storeKey: "lenderLetterChecklist",
    condition: (s: any) =>
      s.chargeOffDocTypes?.includes("Lender Letter Confirming disposition"),
  },

  /* ❗ CONDITION → Branch 2 */

  {
    id: "condition-4-checklist",
    type: "alert",
    variant: "error",
    label:
      "Condition appears as per Branch 2 for decision logic C (Select account from dropdown)",
    condition: (s: any) =>
      s.cancellationChecklist?.length > 0 ||
      s.lenderLetterChecklist?.length > 0,
  },

  /* ---------------- PROMPT 4D ---------------- */

  {
    id: "prompt-4d",
    type: "radio",
    label:
      "From the available document, has the waiting period of 4 years met?",
    options: ["Yes", "No"],
    storeKey: "chargeOffWaitingPeriod",
    condition: (s: any) =>
      s.chargeOffDocsAvailable === "Yes" && s.chargeOffDocTypes?.length > 0,
  },

  /* ❗ CONDITION → Branch 3 */

  {
    id: "condition-4d-no",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 3 for decision logic C",
    condition: (s: any) => s.chargeOffWaitingPeriod === "No",
  },
];
