export const InstallmentFlow = [
  /* ---------------- PROMPT 2a ---------------- */
  {
    id: "2a",
    type: "radio",
    label: "Check if the installment account has less than 10 payments?",
    options: ["Yes", "No"],
    storeKey: "installmentLessThan10Payments",
  },
  /* ---------------- PROMPT 2b ---------------- */

  {
    id: "2b",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the installment account?",
    options: ["Yes", "No"],
    storeKey: "installmentSupportingDocs",
    condition: (s) => s.installmentLessThan10Payments === "No",
  },
  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */

  {
    id: "2b-account-select",
    type: "select", // ✅ NEW TYPE
    label: "Select account number/name",
    storeKey: "selectedInstallmentAccount",
    condition: (s: any) =>
      s.installmentSupportingDocs === "Yes" ||
      s.installmentSupportingDocs === "No",
  },

  {
    id: "2b-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected =
        s.selectedInstallmentAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have less than 10 months payment remaining. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s) => s.installmentSupportingDocs === "No",
  },

  {
    id: "2c",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Account is being paid by the business/other party",
        storeKey: "installmentReasonBusiness",
        accountStoreKey: "installmentAccountBusiness",
        nextPromptId: "2d",
      },
      {
        label: "Account is already paid off by the borrower",
        storeKey: "installmentReasonBorrower",
        accountStoreKey: "installmentAccountBorrower",
        nextPromptId: "2e",
      },
      {
        label: "Account paid by other parties through gift",
        storeKey: "installmentReasonGift",
        accountStoreKey: "installmentAccountGift",
        nextPromptId: "2f",
      },
    ],
    condition: (s: any) => s.installmentSupportingDocs === "Yes",
  },

  // ─── PROMPT 2d ───────────────────────────────────────────────
  {
    id: "2d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "installmentDocs2d",
    checklistStoreKey: "installmentChecklist2d",
    condition: (s: any) => !!s.installmentReasonBusiness,
    documents: [
      {
        label: "Most recent 12 months cancelled checks",
        value: "cancelledChecks",
        checklist: [
          "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
          "Cancelled check reflects Payor name as Borrower's name. Clarification needed as debt would require to be included in LOS.",
          "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
          "Consecutive 12 months cancelled check is not available",
          "Delinquency reflected 12 months of check provided.",
          "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
        ],
      },
      {
        label: "Most recent 12 months bank statements",
        value: "bankStatements",
        checklist: [
          "Most recent consecutive 12 months bank statement is not available.",
          "Bank statement provided is jointly owned by the borrower",
          "Bank statement provided reflects borrower name instead of some other person/business.",
          "Bank statement for any month is missing",
          "The bank statement provided does not reflect withdrawal amount.",
          "Withdrawal amount should be debited towards the creditor's name.",
          "Business name reflected on bank statements are not owned by the borrower.",
        ],
      },
    ],
    conditionBranch: "2",
  },

  // ─── PROMPT 2e ───────────────────────────────────────────────
  {
    id: "2e",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "installmentDocs2e",
    checklistStoreKey: "installmentChecklist2e",
    condition: (s: any) => !!s.installmentReasonBorrower,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Account statement from creditor reflecting 0 balance",
        value: "accountStatement",
        checklist: [
          "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account. Hence, the source of funds required for the large deposit is noted.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report. Clarification required for discrepancy in amount.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 2f ───────────────────────────────────────────────
  {
    id: "2f",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "installmentDocs2f",
    checklistStoreKey: "installmentChecklist2f",
    condition: (s: any) => !!s.installmentReasonGift,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Account statement from creditor reflecting 0 balance",
        value: "accountStatement",
        checklist: [
          "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Bank statement reflects another person's name and gift letter is not available/LOS is not updated.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "Payor name does not reflect borrower's name but different individual's name. However, gift letter is not available/LOS is not updated.",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report. Clarification required for discrepancy in amount.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
      {
        label: "Gift letter",
        value: "giftLetter",
        checklist: [
          "Gift letter is not properly executed.",
          "Gift amount does not match the amount paid to the creditor.",
          "Gift letter does not reflect complete donor details.",
          "Gift letter provided reflects incorrect borrower name.",
        ],
      },
    ],
    conditionBranch: "4",
  },
];

export const RevolvingFlow = [
  /* ---------------- PROMPT 3a ---------------- */
  {
    id: "3a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the revolving account?",
    options: ["Yes", "No"],
    storeKey: "revolvingSupportingDocs",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "3a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedRevolvingAccount",
    condition: (s: any) =>
      s.revolvingSupportingDocs === "Yes" || s.revolvingSupportingDocs === "No",
  },

  {
    id: "3a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedRevolvingAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.revolvingSupportingDocs === "No",
  },

  /* ---------------- PROMPT 3b ---------------- */
  {
    id: "3b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Account is already paid off by the borrower",
        storeKey: "revolvingReasonBorrower",
        accountStoreKey: "revolvingAccountBorrower",
        nextPromptId: "3c",
      },
      {
        label: "Account paid by other parties through gift",
        storeKey: "revolvingReasonGift",
        accountStoreKey: "revolvingAccountGift",
        nextPromptId: "3d",
      },
    ],
    condition: (s: any) => s.revolvingSupportingDocs === "Yes",
  },

  // ─── PROMPT 3c ───────────────────────────────────────────────
  {
    id: "3c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "revolvingDocs3c",
    checklistStoreKey: "revolvingChecklist3c",
    condition: (s: any) => !!s.revolvingReasonBorrower,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Credit card statement reflecting 0 balance",
        value: "creditCardStatement",
        checklist: [
          "Credit Card statement does not reflect an account having $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Creditor's name on statement does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account. Hence, the source of funds required for the large deposit is noted.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report. Clarification required for discrepancy in amount.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 3d ───────────────────────────────────────────────
  {
    id: "3d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "revolvingDocs3d",
    checklistStoreKey: "revolvingChecklist3d",
    condition: (s: any) => !!s.revolvingReasonGift,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Credit card statement reflecting 0 balance",
        value: "creditCardStatement",
        checklist: [
          "Credit card statement does not reflect an account having $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Creditor's name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Bank statement reflects another person's name and gift letter is not available/LOS is not updated.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "Payor name does not reflect borrower's name but different individual's name. However, gift letter is not available/LOS is not updated.",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report. Clarification required for discrepancy in amount.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
      {
        label: "Gift letter",
        value: "giftLetter",
        checklist: [
          "Gift letter is not properly executed.",
          "Gift amount does not match the amount paid to the creditor.",
          "Gift letter does not reflect complete donor details.",
          "Gift letter provided reflects incorrect borrower name.",
        ],
      },
    ],
    conditionBranch: "4",
  },
];

export const MortgageFlow = [
  /* ---------------- PROMPT 4a ---------------- */
  {
    id: "4a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the Mortgage account?",
    options: ["Yes", "No"],
    storeKey: "mortgageSupportingDocs",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "4a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedMortgageAccount",
    condition: (s: any) =>
      s.mortgageSupportingDocs === "Yes" || s.mortgageSupportingDocs === "No",
  },

  {
    id: "4a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedMortgageAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.mortgageSupportingDocs === "No",
  },

  /* ---------------- PROMPT 4b ---------------- */
  {
    id: "4b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Mortgage Account is being paid by the business/other party",
        storeKey: "mortgageReasonBusiness",
        accountStoreKey: "mortgageAccountBusiness",
        nextPromptId: "4c",
      },
      {
        label: "Mortgage Account is already paid off by the borrower",
        storeKey: "mortgageReasonBorrower",
        accountStoreKey: "mortgageAccountBorrower",
        nextPromptId: "4d",
      },
      {
        label: "Mortgage account is transferred/refinanced",
        storeKey: "mortgageReasonTransfer",
        accountStoreKey: "mortgageAccountTransfer",
        nextPromptId: "4e",
      },
      {
        label: "Mortgage account is on pending sale property",
        storeKey: "mortgageReasonSale",
        accountStoreKey: "mortgageAccountSale",
        nextPromptId: "4f",
      },
    ],
    condition: (s: any) => s.mortgageSupportingDocs === "Yes",
  },

  // ─── PROMPT 4c — BUSINESS/OTHER PARTY ────────────────────────
  {
    id: "4c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "mortgageDocs4c",
    checklistStoreKey: "mortgageChecklist4c",
    condition: (s: any) => !!s.mortgageReasonBusiness,
    documents: [
      {
        label: "Most recent 12 months cancelled checks",
        value: "cancelledChecks",
        checklist: [
          "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
          "Cancelled check reflects Payor name as Borrower's name. Clarification needed as debt would require to be included in LOS.",
          "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
          "Consecutive 12 months cancelled check is not available",
          "Delinquency reflected 12 months of check provided.",
          "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
          "Rental income is being used for the property associated to the mortgage being excluded.",
        ],
      },
      {
        label: "Most recent 12 months bank statements",
        value: "bankStatements",
        checklist: [
          "Most recent consecutive 12 months bank statement is not available.",
          "Bank statement provided is jointly owned by the borrower",
          "Bank statement provided reflects borrower name instead of some other person/business.",
          "Bank statement for any month is missing",
          "The bank statement provided does not reflect withdrawal amount.",
          "Withdrawal amount should be debited towards the creditor's name.",
          "Business name reflected on bank statements are not owned by the borrower.",
          "Rental income is being used for the property associated to the mortgage being excluded.",
        ],
      },
    ],
    conditionBranch: "2",
  },

  // ─── PROMPT 4d — PAID OFF BY BORROWER ────────────────────────
  {
    id: "4d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "mortgageDocs4d",
    checklistStoreKey: "mortgageChecklist4d",
    condition: (s: any) => !!s.mortgageReasonBorrower,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Final CD/Settlement statement",
        value: "finalCD",
        checklist: [
          "Final CD/settlement statement reflect signature space however same is not executed by all the parties.",
          "Final CD/settlement statement reflects property address which is not matching with the property.",
        ],
      },
      {
        label: "Bank statement reflecting withdrawal",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off.",
          "Bank statement/transaction history reflects undisclosed withdrawal.",
          "Bank statement/transaction history reflects large deposits used to pay off the charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "Payor name does not reflect borrower's name.",
          "The amount reflected on the check is less than the outstanding balance.",
          "Cashier check provided however bank statement reflecting withdrawal is not available.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 4e — TRANSFERRED / REFINANCED ────────────────────
  {
    id: "4e",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "mortgageDocs4e",
    checklistStoreKey: "mortgageChecklist4e",
    condition: (s: any) => !!s.mortgageReasonTransfer,
    documents: [
      {
        label: "Credit supplement reflecting account is transferred",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance with latest DLA.",
          "Mortgage transferred to another account and new account is not included in DTI.",
        ],
      },
    ],
    conditionBranch: "5",
  },

  // ─── PROMPT 4f — PENDING SALE PROPERTY ───────────────────────
  {
    id: "4f",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "mortgageDocs4f",
    checklistStoreKey: "mortgageChecklist4f",
    condition: (s: any) => !!s.mortgageReasonSale,
    documents: [
      {
        label: "Estimated CD",
        value: "estimatedCD",
        checklist: [
          "Estimated CD provided does not reflect the seller's name as our borrower's name.",
          "Property address on estimated CD does not match the address associated against the mortgage.",
          "Closing/disbursement date on estimated CD is after closing date of subject loan.",
        ],
      },
      {
        label: "Purchase Contract for property of which mortgage is excluded",
        value: "purchaseContract",
        checklist: [
          "The purchase contract provided does not reflect the seller's name as our borrower's name.",
          "Property address on purchase contract does not match the address associated with the mortgage.",
          "Closing/disbursement date on purchase contract is after closing date of subject loan.",
          "The purchase contract provided is not executed by all parties.",
        ],
      },
    ],
    conditionBranch: "6",
  },
];

export const HelocFlow = [
  /* ---------------- PROMPT 5a ---------------- */
  {
    id: "5a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the HELOC account?",
    options: ["Yes", "No"],
    storeKey: "helocSupportingDocs",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "5a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedHelocAccount",
    condition: (s: any) =>
      s.helocSupportingDocs === "Yes" || s.helocSupportingDocs === "No",
  },

  {
    id: "5a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedHelocAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.helocSupportingDocs === "No",
  },

  /* ---------------- PROMPT 5b ---------------- */
  {
    id: "5b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "HELOC Account is being paid by the business/other party",
        storeKey: "helocReasonBusiness",
        accountStoreKey: "helocAccountBusiness",
        nextPromptId: "5c",
      },
      {
        label: "HELOC Account is already paid off by the borrower",
        storeKey: "helocReasonBorrower",
        accountStoreKey: "helocAccountBorrower",
        nextPromptId: "5d",
      },
      {
        label: "HELOC account is transferred/refinanced",
        storeKey: "helocReasonTransfer",
        accountStoreKey: "helocAccountTransfer",
        nextPromptId: "5e",
      },
      {
        label: "HELOC account is on pending sale property",
        storeKey: "helocReasonSale",
        accountStoreKey: "helocAccountSale",
        nextPromptId: "5f",
      },
      {
        label: "HELOC statement received reflecting no amount withdrawn",
        storeKey: "helocReasonNoDraw",
        accountStoreKey: "helocAccountNoDraw",
        nextPromptId: "5g",
      },
    ],
    condition: (s: any) => s.helocSupportingDocs === "Yes",
  },

  // ─── PROMPT 5c — BUSINESS/OTHER PARTY ────────────────────────
  {
    id: "5c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "helocDocs5c",
    checklistStoreKey: "helocChecklist5c",
    condition: (s: any) => !!s.helocReasonBusiness,
    documents: [
      {
        label: "Most recent 12 months cancelled checks",
        value: "cancelledChecks",
        checklist: [
          "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
          "Cancelled check reflects Payor name as Borrower's name. Clarification needed as debt would require to be included in LOS.",
          "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
          "Consecutive 12 months cancelled check is not available",
          "Delinquency reflected 12 months of check provided.",
          "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
          "Rental income is being used for the property associated to the mortgage being excluded.",
        ],
      },
      {
        label: "Most recent 12 months bank statements",
        value: "bankStatements",
        checklist: [
          "Most recent consecutive 12 months bank statement is not available.",
          "Bank statement provided is jointly owned by the borrower",
          "Bank statement provided reflects borrower name instead of some other person/business.",
          "Bank statement for any month is missing",
          "The bank statement provided does not reflect withdrawal amount.",
          "Withdrawal amount should be debited towards the creditor's name.",
          "Business name reflected on bank statements are not owned by the borrower.",
          "Rental income is being used for the property associated to the mortgage being excluded.",
        ],
      },
    ],
    conditionBranch: "2",
  },

  // ─── PROMPT 5d — PAID OFF BY BORROWER ────────────────────────
  {
    id: "5d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "helocDocs5d",
    checklistStoreKey: "helocChecklist5d",
    condition: (s: any) => !!s.helocReasonBorrower,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Final CD/Settlement statement",
        value: "finalCD",
        checklist: [
          "Final CD/settlement statement reflect signature space however same is not executed by all the parties.",
          "Final CD/settlement statement reflects property address which is not matching with the property being attached to the HELOC being excluded.",
        ],
      },
      {
        label: "Bank statement reflecting withdrawal",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 5e — TRANSFERRED / REFINANCED ────────────────────
  {
    id: "5e",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "helocDocs5e",
    checklistStoreKey: "helocChecklist5e",
    condition: (s: any) => !!s.helocReasonTransfer,
    documents: [
      {
        label: "Credit supplement reflecting account is transferred",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance with the latest DLA and has not been transferred.",
          "Mortgage transferred to another account and new account is not included in DTI",
        ],
      },
    ],
    conditionBranch: "5",
  },

  // ─── PROMPT 5f — PENDING SALE PROPERTY ───────────────────────
  {
    id: "5f",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "helocDocs5f",
    checklistStoreKey: "helocChecklist5f",
    condition: (s: any) => !!s.helocReasonSale,
    documents: [
      {
        label: "Estimated CD",
        value: "estimatedCD",
        checklist: [
          "The estimated CD provided does not reflect the seller's name as our borrower's name.",
          "Property address on estimated CD does not match the address associated with the HELOC being excluded from DTI.",
          "Closing/disbursement date on estimated CD is after the closing date of subject loan transaction and DTI exceeds after including the payment in LOS.",
        ],
      },
      {
        label: "Purchase Contract for property of which HELOC is excluded",
        value: "purchaseContract",
        checklist: [
          "The purchase contract provided does not reflect the seller's name as our borrower's name.",
          "Property address on purchase contract does not match the address associated with the mortgage being excluded from DTI.",
          "The purchase contract provided is not executed by all parties.",
        ],
      },
    ],
    conditionBranch: "6",
  },

  // ─── PROMPT 5g — NO WITHDRAWAL ───────────────────────────────
  {
    id: "5g",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "helocDocs5g",
    checklistStoreKey: "helocChecklist5g",
    condition: (s: any) => !!s.helocReasonNoDraw,
    documents: [
      {
        label:
          "HELOC statement reflecting funds not withdrawn and there is no outstanding balance",
        value: "helocStatement",
        checklist: [
          "The HELOC statement reflects an outstanding balance with monthly payment and after including the payment DTI will exceeds the 50%",
          "The HELOC statement reflects different creditor names/account numbers which does not match with credit report.",
          "HELOC statement is not the latest statement.",
          "HELOC statement has other discrepancies.",
        ],
      },
    ],
    conditionBranch: "7",
  },
];

export const LeaseFlow = [
  /* ---------------- PROMPT 6a ---------------- */
  {
    id: "6a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the Lease account?",
    options: ["Yes", "No"],
    storeKey: "leaseSupportingDocs",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "6a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedLeaseAccount",
    condition: (s: any) =>
      s.leaseSupportingDocs === "Yes" || s.leaseSupportingDocs === "No",
  },

  {
    id: "6a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedLeaseAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.leaseSupportingDocs === "No",
  },

  /* ---------------- PROMPT 6b ---------------- */
  {
    id: "6b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Lease account is terminated",
        storeKey: "leaseReasonTerminated",
        accountStoreKey: "leaseAccountTerminated",
        nextPromptId: "6c",
      },
    ],
    condition: (s: any) => s.leaseSupportingDocs === "Yes",
  },

  // ─── PROMPT 6c — LEASE TERMINATED ────────────────────────────
  {
    id: "6c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "leaseDocs6c",
    checklistStoreKey: "leaseChecklist6c",
    condition: (s: any) => !!s.leaseReasonTerminated,
    documents: [
      {
        label: "Credit Supplement",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects active and not terminated.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
        ],
      },
      {
        label: "Lease account statement",
        value: "leaseStatement",
        checklist: [
          "Letter from creditor does not reflect account has been terminated and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
    ],
    conditionBranch: "8",
  },
];

export const ChargeAccountFlow = [
  /* ---------------- PROMPT 7a ---------------- */
  {
    id: "7a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the 30-day charge account?",
    options: ["Yes", "No"],
    storeKey: "chargeSupportingDocs",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "7a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedChargeAccount",
    condition: (s: any) =>
      s.chargeSupportingDocs === "Yes" || s.chargeSupportingDocs === "No",
  },

  {
    id: "7a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedChargeAccount;
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.chargeSupportingDocs === "No",
  },

  /* ---------------- PROMPT 7b ---------------- */
  {
    id: "7b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "30-day charge account is paid off by the borrower",
        storeKey: "chargeReasonPaidOff",
        accountStoreKey: "chargeAccountPaidOff",
        nextPromptId: "7c",
      },
      {
        label: "Borrower has reserves to cover the account balance",
        storeKey: "chargeReasonReserves",
        accountStoreKey: "chargeAccountReserves",
        nextPromptId: "7d",
      },
      {
        label: "Borrower pays minimum due amount and not the entire balance",
        storeKey: "chargeReasonMinimum",
        accountStoreKey: "chargeAccountMinimum",
        nextPromptId: "7e",
      },
    ],
    condition: (s: any) => s.chargeSupportingDocs === "Yes",
  },

  // ─── PROMPT 7c — PAID OFF BY BORROWER ────────────────────────
  {
    id: "7c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "chargeDocs7c",
    checklistStoreKey: "chargeChecklist7c",
    condition: (s: any) => !!s.chargeReasonPaidOff,
    documents: [
      {
        label: "Credit supplement reflecting account is paid in full",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects outstanding balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
          "Other supporting documents reflecting source of funds is not available",
        ],
      },
      {
        label: "Credit card statement from creditor reflecting 0 balance",
        value: "creditCardStatement",
        checklist: [
          "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 7d — RESERVES ─────────────────────────────────────
  {
    id: "7d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "chargeDocs7d",
    checklistStoreKey: "chargeChecklist7d",
    condition: (s: any) => !!s.chargeReasonReserves,
    documents: [
      {
        label:
          "Bank statement/transaction history to verify funds available to meet reserve requirement",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not have sufficient funds to meet additional reserves equivalent to the outstanding balance.",
          "Bank statement/Transaction History has missing pages.",
          "Bank statement/Transaction History provided is not provided for 30 days/60 days period",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Gift documentation to meet 6 months reserve requirement",
        value: "giftDocumentation",
        checklist: [
          "Gift letter is missing",
          "Gift letter provided has missing basic information like Donor name, donor phone number, donor address, borrower details, gift amount, repayment clause.",
          "Cancelled check is missing reflecting amount is deposited in borrower's account",
          "The bank statement provided does not reflect the gift deposit amount.",
          "Gift mismatch noted between gift letter and bank statement deposited amount.",
        ],
      },
    ],
    conditionBranch: "9",
  },

  // ─── PROMPT 7e — MINIMUM PAYMENT ─────────────────────────────
  {
    id: "7e",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "chargeDocs7e",
    checklistStoreKey: "chargeChecklist7e",
    condition: (s: any) => !!s.chargeReasonMinimum,
    documents: [
      {
        label: "Credit card statement",
        value: "creditCardStatement",
        checklist: [
          "Credit card statement does not reflect minimum due amount but reflects account balance and payment amount as same.",
          "Credit card statement provided is for different tradeline as account name/number does not match with the one reported on credit report",
          "Other discrepancies are identified on the credit card statement.",
        ],
      },
      {
        label: "Credit supplement",
        value: "creditSupplement",
        checklist: [
          "Credit supplement does not reflect the correct borrower details like SSN, DOB, Borrower name.",
          "Tradeline excluded from LOS still reflects the same monthly payment as account balance.",
          "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
        ],
      },
    ],
    conditionBranch: "10",
  },
];

export const TaxesFlow = [
  /* ---------------- PROMPT 8a ---------------- */
  {
    id: "8a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the taxes account?",
    options: ["Yes", "No"],
    storeKey: "taxDocsAvailable",
  },

  /* ---------------- DROPDOWN (FOR YES & NO) ---------------- */
  {
    id: "8a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedTaxAccount",
    condition: (s: any) =>
      s.taxDocsAvailable === "Yes" || s.taxDocsAvailable === "No",
  },

  {
    id: "8a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedTaxAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.taxDocsAvailable === "No",
  },

  /* ---------------- PROMPT 8b ---------------- */
  {
    id: "8b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Account is already paid off by the borrower",
        storeKey: "taxReasonBorrower",
        accountStoreKey: "taxAccountBorrower",
        nextPromptId: "8c",
      },
      {
        label: "Account paid by other parties through gift",
        storeKey: "taxReasonGift",
        accountStoreKey: "taxAccountGift",
        nextPromptId: "8d",
      },
    ],
    condition: (s: any) => s.taxDocsAvailable === "Yes",
  },

  // ─── PROMPT 8c — PAID OFF BY BORROWER ────────────────────────
  {
    id: "8c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "taxDocs8c",
    checklistStoreKey: "taxChecklist8c",
    condition: (s: any) => !!s.taxReasonBorrower,
    documents: [
      {
        label: "Tax statement reflecting 0 balance",
        value: "taxStatement",
        checklist: [
          "Tax statements still reflect an outstanding balance and after including the payment ratios exceed the limit of 50%.",
          "Case number/creditor name on letter does not match with the other documents.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance or account is released.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Tax letter not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 8d — PAID BY GIFT ─────────────────────────────────
  {
    id: "8d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "taxDocs8d",
    checklistStoreKey: "taxChecklist8d",
    condition: (s: any) => !!s.taxReasonGift,
    documents: [
      {
        label: "Account statement from creditor reflecting 0 balance",
        value: "accountStatement",
        checklist: [
          "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Bank statement reflects another person's name and gift letter is not available/LOS is not updated.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "Payor name does not reflect borrower's name but different individual's name.",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "4",
  },
];

export const TaxLienFlow = [
  /* ---------------- PROMPT 9a ---------------- */
  {
    id: "9a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the tax lien account?",
    options: ["Yes", "No"],
    storeKey: "taxLienDocsAvailable",
  },

  /* ---------------- ACCOUNT SELECT (always shown after 9a) ---------------- */
  {
    id: "9a-account-select",
    type: "select",
    label: "Select account number/name",
    storeKey: "selectedTaxLienAccount",
    condition: (s: any) =>
      s.taxLienDocsAvailable === "Yes" || s.taxLienDocsAvailable === "No",
  },

  {
    id: "9a-condition",
    type: "alert",
    variant: "error",
    label: (s: any) => {
      const selected = s.selectedTaxLienAccount || "[[Account Name_Number]]";
      return `${selected} is excluded in VOL and does not have supporting documents available. Obtain supporting document to omit the liability along with source of funds if paid recently.`;
    },
    condition: (s: any) => s.taxLienDocsAvailable === "No",
  },

  /* ---------------- PROMPT 9b ---------------- */
  {
    id: "9b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      {
        label: "Account is already paid off by the borrower",
        storeKey: "taxLienReasonBorrower",
        accountStoreKey: "taxLienAccountBorrower",
        nextPromptId: "9c",
      },
      {
        label: "Account paid by other parties through gift",
        storeKey: "taxLienReasonGift",
        accountStoreKey: "taxLienAccountGift",
        nextPromptId: "9d",
      },
    ],
    condition: (s: any) => s.taxLienDocsAvailable === "Yes",
  },

  // ─── PROMPT 9c — PAID OFF BY BORROWER ────────────────────────
  {
    id: "9c",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "taxLienDocs9c",
    checklistStoreKey: "taxLienChecklist9c",
    condition: (s: any) => !!s.taxLienReasonBorrower,
    documents: [
      {
        label: "Tax statement reflecting 0 balance",
        value: "taxStatement",
        checklist: [
          "Tax statements still reflect an outstanding balance and after including the payment ratios exceed the limit of 50%.",
          "Case number/creditor name on letter does not match with the other documents.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance or account is released.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Tax letter not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "3",
  },

  // ─── PROMPT 9d — PAID BY GIFT ─────────────────────────────────
  {
    id: "9d",
    type: "document-checklist",
    label: "What documents are received (Select all that apply)",
    docsStoreKey: "taxLienDocs9d",
    checklistStoreKey: "taxLienChecklist9d",
    condition: (s: any) => !!s.taxLienReasonGift,
    documents: [
      {
        label: "Account statement from creditor reflecting 0 balance",
        value: "accountStatement",
        checklist: [
          "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
          "Account number/creditor name on letter does not match with the credit report.",
          "Other discrepancies are noted in the letter.",
        ],
      },
      {
        label:
          "Bank statement/Transaction History reflecting withdrawal amount",
        value: "bankStatement",
        checklist: [
          "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
          "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
          "Bank statement/Transaction History provided reflects other discrepancy.",
          "Bank statement reflects another person's name and gift letter is not available/LOS is not updated.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
          "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
          "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
        ],
      },
      {
        label: "Cancelled check/Cashier's check",
        value: "cancelledCheck",
        checklist: [
          "Cancelled/cashier's check does not reflect creditor name as payee",
          "Payor name does not reflect borrower's name but different individual's name.",
          "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
          "Cashier check provided however; bank statement reflecting withdrawal is not available.",
          "Credit supplement/other supporting document not available reflecting account is paid off with $0 balance.",
        ],
      },
    ],
    conditionBranch: "4",
  },
];
