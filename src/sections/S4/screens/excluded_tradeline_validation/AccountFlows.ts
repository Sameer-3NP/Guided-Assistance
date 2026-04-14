export const InstallmentFlow = [
  /* ---------------- PROMPT 2a ---------------- */

  {
    id: "2a",
    type: "radio",
    label: "Check if the installment account has less than 10 payments?",
    options: ["Yes", "No"],
    storeKey: "installmentLessThan10Payments",
  },

  {
    id: "2a-alert",
    type: "alert",
    variant: "success",
    label:
      "Check if multiple checkboxes are selected against prompt 2, if multiple selected then proceed (as per branch 11) respective prompts as per account types; If only installment is selected against prompt 2, then proceed (as per Branch 11) to prompt 4.6 will appear.",
    condition: (s) => s.installmentLessThan10Payments === "Yes",
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

  {
    id: "2b-condition",
    type: "alert",
    variant: "error",
    label: "Condition appears as per Branch 1",
    condition: (s) => s.installmentSupportingDocs === "No",
  },

  /* ---------------- PROMPT 2c ---------------- */

  {
    id: "2c",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "Account is being paid by the business/other party",
      "Account is already paid off by the borrower",
      "Account paid by other parties through gift",
    ],
    storeKey: "installmentReason",
    condition: (s) => s.installmentSupportingDocs === "Yes",
  },

  /* ---------------- PROMPT 2d ---------------- */

  {
    id: "2d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Most recent 12 months cancelled checks",
      "Most recent 12 months bank statements",
    ],
    storeKey: "installmentBusinessDocs",
    condition: (s) =>
      s.installmentReason?.includes(
        "Account is being paid by the business/other party",
      ),
  },

  /* CANCELLED CHECK CHECKLIST */

  {
    id: "2d-checklist-1",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
      "Cancelled check reflects Payor name as Borrower’s name. Clarification needed as debt would require to be included in LOS.",
      "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
      "Consecutive 12 months cancelled check is not available",
      "Delinquency reflected 12 months of check provided.",
      "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
    ],
    storeKey: "installmentCancelledCheckChecklist",
    condition: (s) =>
      s.installmentBusinessDocs?.includes(
        "Most recent 12 months cancelled checks",
      ),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "2d-checklist-2",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Most recent consecutive 12 months bank statement is not available.",
      "Bank statement provided is jointly owned by the borrower",
      "Bank statement provided reflects borrower name instead of some other person/business.",
      "Bank statement for any month is missing",
      "The bank statement provided does not reflect withdrawal amount.",
      "Withdrawal amount should be debited towards the creditor's name.",
      "Business name reflected on bank statements are not owned by the borrower.",
    ],
    storeKey: "installmentBankStatementChecklist",
    condition: (s) =>
      s.installmentBusinessDocs?.includes(
        "Most recent 12 months bank statements",
      ),
  },

  /* CONDITION */

  {
    id: "2d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 2",
    condition: (s) =>
      s.installmentCancelledCheckChecklist?.length > 0 ||
      s.installmentBankStatementChecklist?.length > 0,
  },
  /* ---------------- PROMPT 2e ---------------- */

  {
    id: "2e-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Account statement from creditor reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "installmentPaidOffDocs",
    condition: (s) =>
      s.installmentReason?.includes(
        "Account is already paid off by the borrower",
      ),
  },

  /* CREDIT SUPPLEMENT */

  {
    id: "2e-credit-supplement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "installmentCreditSupplementChecklist",
    condition: (s) =>
      s.installmentPaidOffDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  /* ACCOUNT STATEMENT */

  {
    id: "2e-account-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "installmentAccountStatementChecklist",
    condition: (s) =>
      s.installmentPaidOffDocs?.includes(
        "Account statement from creditor reflecting 0 balance.",
      ),
  },

  /* BANK STATEMENT */

  {
    id: "2e-bank-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "installmentBankStatementChecklist",
    condition: (s) =>
      s.installmentPaidOffDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CANCELLED CHECK */

  {
    id: "2e-cancelled-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
    ],
    storeKey: "installmentCancelledCheckChecklist",
    condition: (s) =>
      s.installmentPaidOffDocs?.includes("Cancelled check/Cashier’s check"),
  },

  /* CONDITION */

  {
    id: "2e-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 3",
    condition: (s) =>
      s.installmentCreditSupplementChecklist?.length > 0 ||
      s.installmentAccountStatementChecklist?.length > 0 ||
      s.installmentBankStatementChecklist?.length > 0 ||
      s.installmentCancelledCheckChecklist?.length > 0,
  },

  /* ---------------- PROMPT 2f ---------------- */

  {
    id: "2f-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Account statement from creditor reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
      "Gift letter",
    ],
    storeKey: "installmentGiftDocs",
    condition: (s) =>
      s.installmentReason?.includes(
        "Account paid by other parties through gift",
      ),
  },

  /* CREDIT SUPPLEMENT */

  {
    id: "2f-credit-supplement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "installmentGiftCreditSupplementChecklist",
    condition: (s) =>
      s.installmentGiftDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  /* ACCOUNT STATEMENT */

  {
    id: "2f-account-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "installmentGiftAccountStatementChecklist",
    condition: (s) =>
      s.installmentGiftDocs?.includes(
        "Account statement from creditor reflecting 0 balance.",
      ),
  },

  /* BANK STATEMENT */

  {
    id: "2f-bank-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Bank statement reflects another person’s name and gift letter is not available/LOS is not updated.",
    ],
    storeKey: "installmentGiftBankStatementChecklist",
    condition: (s) =>
      s.installmentGiftDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CANCELLED CHECK */

  {
    id: "2f-cancelled-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "Payor name does not reflect borrower’s name but different individual’s name.",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
    ],
    storeKey: "installmentGiftCancelledCheckChecklist",
    condition: (s) =>
      s.installmentGiftDocs?.includes("Cancelled check/Cashier’s check"),
  },

  /* GIFT LETTER */

  {
    id: "2f-gift-letter",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Gift letter is not properly executed.",
      "Gift amount does not match the amount paid to the creditor.",
      "Gift letter does not reflect complete donor details.",
      "Gift letter provided reflects incorrect borrower name.",
    ],
    storeKey: "installmentGiftLetterChecklist",
    condition: (s) => s.installmentGiftDocs?.includes("Gift letter"),
  },

  /* CONDITION */

  {
    id: "2f-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 4",
    condition: (s) =>
      s.installmentGiftCreditSupplementChecklist?.length > 0 ||
      s.installmentGiftAccountStatementChecklist?.length > 0 ||
      s.installmentGiftBankStatementChecklist?.length > 0 ||
      s.installmentGiftCancelledCheckChecklist?.length > 0 ||
      s.installmentGiftLetterChecklist?.length > 0,
  },
];

export const RevolvingFlow = [
  {
    id: "3a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the revolving account?",
    options: ["Yes", "No"],
    storeKey: "revolvingSupportingDocs",
  },

  {
    id: "3a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 1",
    condition: (s) => s.revolvingSupportingDocs === "No",
  },

  {
    id: "3b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "Account is already paid off by the borrower",
      "Account paid by other parties through gift",
    ],
    storeKey: "revolvingReason",
    condition: (s) => s.revolvingSupportingDocs === "Yes",
  },

  /* ----------------------------- */
  /* PROMPT 3C - PAID OFF BY BORROWER */
  /* ----------------------------- */

  {
    id: "3c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Credit card statement reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "revolvingPaidOffDocs",
    condition: (s) =>
      s.revolvingReason?.includes(
        "Account is already paid off by the borrower",
      ),
  },

  /* Credit supplement checklist */

  {
    id: "3c-checklist-credit",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "revolvingPaidOffChecklist",
    condition: (s) =>
      s.revolvingPaidOffDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  /* Credit card statement checklist */

  {
    id: "3c-checklist-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit Card statement does not reflect an account having $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Creditor's name on statement does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "revolvingPaidOffChecklist",
    condition: (s) =>
      s.revolvingPaidOffDocs?.includes(
        "Credit card statement reflecting 0 balance.",
      ),
  },

  /* Bank statement checklist */

  {
    id: "3c-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "revolvingPaidOffChecklist",
    condition: (s) =>
      s.revolvingPaidOffDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* Check checklist */

  {
    id: "3c-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "revolvingPaidOffChecklist",
    condition: (s) =>
      s.revolvingPaidOffDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "3c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 3",
    condition: (s) => s.revolvingPaidOffChecklist?.length > 0,
  },

  /* ----------------------------- */
  /* PROMPT 3D - GIFT */
  /* ----------------------------- */

  {
    id: "3d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Credit card statement reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
      "Gift letter",
    ],
    storeKey: "revolvingGiftDocs",
    condition: (s) =>
      s.revolvingReason?.includes("Account paid by other parties through gift"),
  },

  /* Credit supplement */

  {
    id: "3d-checklist-credit",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "revolvingGiftChecklist",
    condition: (s) =>
      s.revolvingGiftDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  /* Credit card statement */

  {
    id: "3d-checklist-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit card statement does not reflect an account having $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Creditor's name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "revolvingGiftChecklist",
    condition: (s) =>
      s.revolvingGiftDocs?.includes(
        "Credit card statement reflecting 0 balance.",
      ),
  },

  /* Bank */

  {
    id: "3d-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Bank statement reflects another person’s name and gift letter is not available/LOS is not updated.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "revolvingGiftChecklist",
    condition: (s) =>
      s.revolvingGiftDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* Checks */

  {
    id: "3d-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "Payor name does not reflect borrower’s name but different individual’s name.",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "revolvingGiftChecklist",
    condition: (s) =>
      s.revolvingGiftDocs?.includes("Cancelled check/Cashier’s check"),
  },

  /* Gift letter */

  {
    id: "3d-checklist-gift",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Gift letter is not properly executed.",
      "Gift amount does not match the amount paid to the creditor.",
      "Gift letter does not reflect complete donor details.",
      "Gift letter provided reflects incorrect borrower name.",
    ],
    storeKey: "revolvingGiftChecklist",
    condition: (s) => s.revolvingGiftDocs?.includes("Gift letter"),
  },

  {
    id: "3d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 4",
    condition: (s) => s.revolvingGiftChecklist?.length > 0,
  },
];

export const MortgageFlow = [
  {
    id: "4a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the Mortgage account?",
    options: ["Yes", "No"],
    storeKey: "mortgageSupportingDocs",
  },

  {
    id: "4a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 1",
    condition: (s) => s.mortgageSupportingDocs === "No",
  },

  {
    id: "4b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "Mortgage Account is being paid by the business/other party",
      "Mortgage Account is already paid off by the borrower",
      "Mortgage account is transferred/refinanced",
      "Mortgage account is on pending sale property",
    ],
    storeKey: "mortgageReason",
    condition: (s) => s.mortgageSupportingDocs === "Yes",
  },

  /* ---------------- BUSINESS PAID ---------------- */

  {
    id: "4c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Most recent 12 months cancelled checks",
      "Most recent 12 months bank statements",
    ],
    storeKey: "mortgageBusinessDocs",
    condition: (s) =>
      s.mortgageReason?.includes(
        "Mortgage Account is being paid by the business/other party",
      ),
  },

  {
    id: "4c-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
      "Cancelled check reflects Payor name as Borrower’s name.",
      "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
      "Consecutive 12 months cancelled check is not available",
      "Delinquency reflected 12 months of check provided.",
      "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
      "Rental income is being used for the property associated to the mortgage being excluded.",
    ],
    storeKey: "mortgageBusinessChecklist",
    condition: (s) =>
      s.mortgageBusinessDocs?.includes(
        "Most recent 12 months cancelled checks",
      ),
  },

  {
    id: "4c-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Most recent consecutive 12 months bank statement is not available.",
      "Bank statement provided is jointly owned by the borrower",
      "Bank statement provided reflects borrower name instead of some other person/business.",
      "Bank statement for any month is missing",
      "The bank statement provided does not reflect withdrawal amount.",
      "Withdrawal amount should be debited towards the creditor's name.",
      "Business name reflected on bank statements are not owned by the borrower.",
      "Rental income is being used for the property associated to the mortgage being excluded.",
    ],
    storeKey: "mortgageBusinessChecklist",
    condition: (s) =>
      s.mortgageBusinessDocs?.includes("Most recent 12 months bank statements"),
  },

  {
    id: "4c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 2",
    condition: (s) => s.mortgageBusinessChecklist?.length > 0,
  },

  /* ---------------- PAID OFF ---------------- */

  {
    id: "4d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Final CD/Settlement statement",
      "Bank statement reflecting withdrawal.",
      "Cancelled check/cashier’s check",
    ],
    storeKey: "mortgagePaidOffDocs",
    condition: (s) =>
      s.mortgageReason?.includes(
        "Mortgage Account is already paid off by the borrower",
      ),
  },

  {
    id: "4d-checklist-credit",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "mortgagePaidOffChecklist",
    condition: (s) =>
      s.mortgagePaidOffDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  {
    id: "4d-checklist-cd",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Final CD/settlement statement reflect signature space however same is not executed by all the parties.",
      "Final CD/settlement statement reflects property address which is not matching with the property.",
    ],
    storeKey: "mortgagePaidOffChecklist",
    condition: (s) =>
      s.mortgagePaidOffDocs?.includes("Final CD/Settlement statement"),
  },

  {
    id: "4d-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off.",
      "Bank statement/transaction history reflects undisclosed withdrawal.",
      "Bank statement/transaction history reflects large deposits used to pay off the charge account.",
    ],
    storeKey: "mortgagePaidOffChecklist",
    condition: (s) =>
      s.mortgagePaidOffDocs?.includes("Bank statement reflecting withdrawal."),
  },

  {
    id: "4d-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "Payor name does not reflect borrower’s name.",
      "The amount reflected on the check is less than the outstanding balance.",
      "Cashier check provided however bank statement reflecting withdrawal is not available.",
    ],
    storeKey: "mortgagePaidOffChecklist",
    condition: (s) =>
      s.mortgagePaidOffDocs?.includes("Cancelled check/cashier’s check"),
  },

  {
    id: "4d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 3",
    condition: (s) => s.mortgagePaidOffChecklist?.length > 0,
  },

  /* ---------------- TRANSFERRED / REFINANCED ---------------- */

  {
    id: "4e-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: ["Credit supplement reflecting account is transferred."],
    storeKey: "mortgageTransferDocs",
    condition: (s) =>
      s.mortgageReason?.includes("Mortgage account is transferred/refinanced"),
  },

  {
    id: "4e-checklist",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance with latest DLA.",
      "Mortgage transferred to another account and new account is not included in DTI.",
    ],
    storeKey: "mortgageTransferChecklist",
    condition: (s) => s.mortgageTransferDocs?.length > 0,
  },

  {
    id: "4e-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 5",
    condition: (s) => s.mortgageTransferChecklist?.length > 0,
  },

  /* ---------------- PENDING SALE ---------------- */

  {
    id: "4f-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Estimated CD",
      "Purchase Contract for property of which mortgage is excluded",
    ],
    storeKey: "mortgageSaleDocs",
    condition: (s) =>
      s.mortgageReason?.includes(
        "Mortgage account is on pending sale property",
      ),
  },

  {
    id: "4f-checklist-estimated",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Estimated CD provided does not reflect the seller's name as our borrower's name.",
      "Property address on estimated CD does not match the address associated against the mortgage.",
      "Closing/disbursement date on estimated CD is after closing date of subject loan.",
    ],
    storeKey: "mortgageSaleChecklist",
    condition: (s) => s.mortgageSaleDocs?.includes("Estimated CD"),
  },

  {
    id: "4f-checklist-contract",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "The purchase contract provided does not reflect the seller's name as our borrower's name.",
      "Property address on purchase contract does not match the address associated with the mortgage.",
      "Closing/disbursement date on purchase contract is after closing date of subject loan.",
      "The purchase contract provided is not executed by all parties.",
    ],
    storeKey: "mortgageSaleChecklist",
    condition: (s) =>
      s.mortgageSaleDocs?.includes(
        "Purchase Contract for property of which mortgage is excluded",
      ),
  },

  {
    id: "4f-condition",
    type: "alert",
    variant: "warning",
    label: "Condition appears as per Branch 6",
    condition: (s) => s.mortgageSaleChecklist?.length > 0,
  },
];

export const HelocFlow = [
  /* ---------------- PROMPT 5A ---------------- */

  {
    id: "5a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the HELOC account?",
    options: ["Yes", "No"],
    storeKey: "helocSupportingDocs",
  },

  {
    id: "5a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 4 appears as per Branch 1",
    condition: (s: any) => s.helocSupportingDocs === "No",
  },

  /* ---------------- PROMPT 5B ---------------- */

  {
    id: "5b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "HELOC Account is being paid by the business/other party",
      "HELOC Account is already paid off by the borrower",
      "HELOC account is transferred/refinanced",
      "HELOC account is on pending sale property",
      "HELOC statement received reflecting no amount withdrawn",
    ],
    storeKey: "helocReason",
    condition: (s: any) => s.helocSupportingDocs === "Yes",
  },

  /* =======================================================
     5C BUSINESS PAID
  ======================================================= */

  {
    id: "5c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Most recent 12 months cancelled checks",
      "Most recent 12 months bank statements",
    ],
    storeKey: "helocBusinessDocs",
    condition: (s: any) =>
      s.helocReason?.includes(
        "HELOC Account is being paid by the business/other party",
      ),
  },

  {
    id: "5c-checklist-1",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled check does not reflect payee name as creditor name which is excluded from LOS",
      "Cancelled check reflects Payor name as Borrower’s name. Clarification needed as debt would require to be included in LOS.",
      "Cancelled check reflects Payor name as business name, but business is not owned by the borrower.",
      "Consecutive 12 months cancelled check is not available",
      "Delinquency reflected 12 months of check provided.",
      "Cancelled check reflects payor name which matches the seller's name or real estate agent name.",
      "Rental income is being used for the property associated to the mortgage being excluded.",
    ],
    storeKey: "helocBusinessChecklist",
    condition: (s: any) =>
      s.helocBusinessDocs?.includes("Most recent 12 months cancelled checks"),
  },

  {
    id: "5c-checklist-2",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Most recent consecutive 12 months bank statement is not available.",
      "Bank statement provided is jointly owned by the borrower",
      "Bank statement provided reflects borrower name instead of some other person/business.",
      "Bank statement for any month is missing",
      "The bank statement provided does not reflect withdrawal amount.",
      "Withdrawal amount should be debited towards the creditor's name.",
      "Business name reflected on bank statements are not owned by the borrower.",
      "Rental income is being used for the property associated to the mortgage being excluded.",
    ],
    storeKey: "helocBusinessChecklist",
    condition: (s: any) =>
      s.helocBusinessDocs?.includes("Most recent 12 months bank statements"),
  },

  {
    id: "5c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 3 appears as per Branch 2",
    condition: (s: any) => s.helocBusinessChecklist?.length > 0,
  },

  /* =======================================================
     5D PAID OFF
  ======================================================= */

  {
    id: "5d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Final CD/Settlement statement",
      "Bank statement reflecting withdrawal",
      "Cancelled check/cashier’s check",
    ],
    storeKey: "helocPaidOffDocs",
    condition: (s: any) =>
      s.helocReason?.includes(
        "HELOC Account is already paid off by the borrower",
      ),
  },

  {
    id: "5d-checklist",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
      "Final CD/settlement statement reflect signature space however same is not executed by all the parties.",
      "Final CD/settlement statement reflects property address which is not matching with the property being attached to the HELOC being excluded.",
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
    ],
    storeKey: "helocPaidOffChecklist",
    condition: (s: any) => s.helocPaidOffDocs?.length > 0,
  },

  {
    id: "5d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 4 appears as per Branch 3",
    condition: (s: any) => s.helocPaidOffChecklist?.length > 0,
  },

  /* =======================================================
     5E TRANSFERRED
  ======================================================= */

  {
    id: "5e-documents",
    type: "checkbox",
    label: "What documents are received",
    options: ["Credit supplement reflecting account is transferred."],
    storeKey: "helocTransferDocs",
    condition: (s: any) =>
      s.helocReason?.includes("HELOC account is transferred/refinanced"),
  },

  {
    id: "5e-checklist",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance with the latest DLA and has not been transferred.",
      "Mortgage transferred to another account and new account is not included in DTI",
    ],
    storeKey: "helocTransferChecklist",
    condition: (s: any) => s.helocTransferDocs?.length > 0,
  },

  {
    id: "5e-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 2 appears as per Branch 5",
    condition: (s: any) => s.helocTransferChecklist?.length > 0,
  },

  /* =======================================================
     5F PENDING SALE
  ======================================================= */

  {
    id: "5f-documents",
    type: "checkbox",
    label: "What documents are received",
    options: [
      "Estimated CD",
      "Purchase Contract for property of which HELOC is excluded",
    ],
    storeKey: "helocPendingDocs",
    condition: (s: any) =>
      s.helocReason?.includes("HELOC account is on pending sale property"),
  },

  {
    id: "5f-checklist",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "The estimated CD provided does not reflect the seller's name as our borrower's name.",
      "Property address on estimated CD does not match the address associated with the HELOC being excluded from DTI.",
      "Closing/disbursement date on estimated CD is after the closing date of subject loan transaction and DTI exceeds after including the payment in LOS.",
      "The purchase contract provided does not reflect the seller's name as our borrower's name.",
      "Property address on purchase contract does not match the address associated with the mortgage being excluded from DTI.",
      "The purchase contract provided is not executed by all parties.",
    ],
    storeKey: "helocPendingChecklist",
    condition: (s: any) => s.helocPendingDocs?.length > 0,
  },

  {
    id: "5f-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 2 appears as per Branch 6",
    condition: (s: any) => s.helocPendingChecklist?.length > 0,
  },

  /* =======================================================
     5G NO WITHDRAWAL
  ======================================================= */

  {
    id: "5g-documents",
    type: "checkbox",
    label: "What documents are received",
    options: [
      "HELOC statement reflecting funds not withdrawn and there is no outstanding balance.",
    ],
    storeKey: "helocNoDrawDocs",
    condition: (s: any) =>
      s.helocReason?.includes(
        "HELOC statement received reflecting no amount withdrawn",
      ),
  },

  {
    id: "5g-checklist",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "The HELOC statement reflects an outstanding balance with monthly payment and after including the payment DTI will exceeds the 50%",
      "The HELOC statement reflects different creditor names/account numbers which does not match with credit report.",
      "HELOC statement is not the latest statement.",
      "HELOC statement has other discrepancies.",
    ],
    storeKey: "helocNoDrawChecklist",
    condition: (s: any) => s.helocNoDrawDocs?.length > 0,
  },

  {
    id: "5g-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 1 appears as per Branch 7",
    condition: (s: any) => s.helocNoDrawChecklist?.length > 0,
  },
];

export const LeaseFlow = [
  /* ---------------- PROMPT 6A ---------------- */

  {
    id: "6a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the Lease account?",
    options: ["Yes", "No"],
    storeKey: "leaseSupportingDocs",
  },

  {
    id: "6a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 5 appears as per Branch 1",
    condition: (s: any) => s.leaseSupportingDocs === "No",
  },

  /* ---------------- PROMPT 6B ---------------- */

  {
    id: "6b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: ["Lease account is terminated."],
    storeKey: "leaseReason",
    condition: (s: any) => s.leaseSupportingDocs === "Yes",
  },

  /* ---------------- PROMPT 6C ---------------- */

  {
    id: "6c-documents",
    type: "checkbox",
    label: "What document has been received? (Select all that apply)",
    options: ["Credit Supplement", "Lease account statement"],
    storeKey: "leaseDocs",
    condition: (s: any) =>
      s.leaseReason?.includes("Lease account is terminated."),
  },

  /* ---------------- CREDIT SUPPLEMENT CHECKLIST ---------------- */

  {
    id: "6c-checklist-1",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects active and not terminated.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
    ],
    storeKey: "leaseChecklist",
    condition: (s: any) => s.leaseDocs?.includes("Credit Supplement"),
  },

  /* ---------------- LEASE STATEMENT CHECKLIST ---------------- */

  {
    id: "6c-checklist-2",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has been terminated and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "leaseChecklist",
    condition: (s: any) => s.leaseDocs?.includes("Lease account statement"),
  },

  /* ---------------- CONDITION ---------------- */

  {
    id: "6c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 1 appears as per Branch 8",
    condition: (s: any) => s.leaseChecklist?.length > 0,
  },
];

export const ChargeAccountFlow = [
  {
    id: "7a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the 30-day charge account?",
    options: ["Yes", "No"],
    storeKey: "chargeSupportingDocs",
  },

  {
    id: "7a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 6 appears as per Branch 1",
    condition: (s: any) => s.chargeSupportingDocs === "No",
  },

  {
    id: "7b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "30-day charge account is paid off by the borrower",
      "Borrower has reserves to cover the account balance",
      "Borrower pays minimum due amount and not the entire balance",
    ],
    storeKey: "chargeReason",
    condition: (s: any) => s.chargeSupportingDocs === "Yes",
  },

  /* ---------------- 7C PAID OFF ---------------- */

  {
    id: "7c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Credit supplement reflecting account is paid in full.",
      "Credit card statement from creditor reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "chargePaidOffDocs",
    condition: (s: any) =>
      s.chargeReason?.includes(
        "30-day charge account is paid off by the borrower",
      ),
  },

  /* CREDIT SUPPLEMENT CHECKLIST */

  {
    id: "7c-checklist-credit-supplement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects outstanding balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
      "Other supporting documents reflecting source of funds is not available",
    ],
    storeKey: "chargePaidOffChecklist",
    condition: (s: any) =>
      s.chargePaidOffDocs?.includes(
        "Credit supplement reflecting account is paid in full.",
      ),
  },

  /* CREDIT CARD STATEMENT CHECKLIST */

  {
    id: "7c-checklist-card-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "chargePaidOffChecklist",
    condition: (s: any) =>
      s.chargePaidOffDocs?.includes(
        "Credit card statement from creditor reflecting 0 balance.",
      ),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "7c-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "chargePaidOffChecklist",
    condition: (s: any) =>
      s.chargePaidOffDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CANCELLED CHECK CHECKLIST */

  {
    id: "7c-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "chargePaidOffChecklist",
    condition: (s: any) =>
      s.chargePaidOffDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "7c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 5 appears as per Branch 3",
    condition: (s: any) => s.chargePaidOffChecklist?.length > 0,
  },

  /* ---------------- 7D RESERVES ---------------- */

  {
    id: "7d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Bank statement/transaction history to verify funds available to meet reserve requirement",
      "Gift documentation to meet 6 months reserve requirement",
    ],
    storeKey: "chargeReserveDocs",
    condition: (s: any) =>
      s.chargeReason?.includes(
        "Borrower has reserves to cover the account balance",
      ),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "7d-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not have sufficient funds to meet additional reserves equivalent to the outstanding balance.",
      "Bank statement/Transaction History has missing pages.",
      "Bank statement/Transaction History provided is not provided for 30 days/60 days period",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "chargeReserveChecklist",
    condition: (s: any) =>
      s.chargeReserveDocs?.includes(
        "Bank statement/transaction history to verify funds available to meet reserve requirement",
      ),
  },

  /* GIFT DOCUMENTATION CHECKLIST */

  {
    id: "7d-checklist-gift",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Gift letter is missing",
      "Gift letter provided has missing basic information like Donor name, donor phone number, donor address, borrower details, gift amount, repayment clause.",
      "Cancelled check is missing reflecting amount is deposited in borrower’s account",
      "The bank statement provided does not reflect the gift deposit amount.",
      "Gift mismatch noted between gift letter and bank statement deposited amount.",
    ],
    storeKey: "chargeReserveChecklist",
    condition: (s: any) =>
      s.chargeReserveDocs?.includes(
        "Gift documentation to meet 6 months reserve requirement",
      ),
  },

  {
    id: "7d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 1 appears as per Branch 9",
    condition: (s: any) => s.chargeReserveChecklist?.length > 0,
  },
  /* ---------------- 7E MINIMUM PAYMENT ---------------- */

  {
    id: "7e-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: ["Credit card statement", "Credit supplement"],
    storeKey: "chargeMinimumDocs",
    condition: (s: any) =>
      s.chargeReason?.includes(
        "Borrower pays minimum due amount and not the entire balance",
      ),
  },

  /* CREDIT CARD STATEMENT CHECKLIST */

  {
    id: "7e-checklist-card",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit card statement does not reflect minimum due amount but reflects account balance and payment amount as same.",
      "Credit card statement provided is for different tradeline as account name/number does not match with the one reported on credit report",
      "Other discrepancies are identified on the credit card statement.",
    ],
    storeKey: "chargeMinimumChecklist",
    condition: (s: any) =>
      s.chargeMinimumDocs?.includes("Credit card statement"),
  },

  /* CREDIT SUPPLEMENT CHECKLIST */

  {
    id: "7e-checklist-credit-supplement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Credit supplement does not reflect the correct borrower details like SSN,DOB,Borrower name.",
      "Tradeline excluded from LOS still reflects the same monthly payment as account balance.",
      "Credit supplement reflects a new tradeline which was not reported on credit report and after including the same in LOS, DTI exceeds 50%.",
    ],
    storeKey: "chargeMinimumChecklist",
    condition: (s: any) => s.chargeMinimumDocs?.includes("Credit supplement"),
  },
  {
    id: "7e-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 1 appears as per Branch 10",
    condition: (s: any) => s.chargeMinimumChecklist?.length > 0,
  },
];

export const TaxesFlow = [
  {
    id: "8a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the taxes account?",
    options: ["Yes", "No"],
    storeKey: "taxDocsAvailable",
  },

  {
    id: "8a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 7 appears as per Branch 1",
    condition: (s: any) => s.taxDocsAvailable === "No",
  },

  {
    id: "8b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "Account is already paid off by the borrower",
      "Account paid by other parties through gift",
    ],
    storeKey: "taxReason",
    condition: (s: any) => s.taxDocsAvailable === "Yes",
  },

  /*
  ------------------------------------------------
  PROMPT 8C
  ACCOUNT PAID OFF BY BORROWER
  ------------------------------------------------
  */

  {
    id: "8c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Tax statement reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "taxPaidOffDocs",
    condition: (s: any) =>
      s.taxReason?.includes("Account is already paid off by the borrower"),
  },

  /* TAX STATEMENT CHECKLIST */

  {
    id: "8c-checklist-tax-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Tax statements still reflect an outstanding balance and after including the payment ratios exceed the limit of 50%.",
      "Case number/creditor name on letter does not match with the other documents.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "taxPaidOffChecklist",
    condition: (s: any) =>
      s.taxPaidOffDocs?.includes("Tax statement reflecting 0 balance."),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "8c-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance or account is released.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "taxPaidOffChecklist",
    condition: (s: any) =>
      s.taxPaidOffDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CHECK CHECKLIST */

  {
    id: "8c-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Tax letter not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "taxPaidOffChecklist",
    condition: (s: any) =>
      s.taxPaidOffDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "8c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 6 appears as per Branch 3",
    condition: (s: any) => s.taxPaidOffChecklist?.length > 0,
  },

  /*
  ------------------------------------------------
  PROMPT 8D
  PAID BY GIFT
  ------------------------------------------------
  */

  {
    id: "8d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Account statement from creditor reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "taxGiftDocs",
    condition: (s: any) =>
      s.taxReason?.includes("Account paid by other parties through gift"),
  },

  /* ACCOUNT STATEMENT CHECKLIST */

  {
    id: "8d-checklist-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "taxGiftChecklist",
    condition: (s: any) =>
      s.taxGiftDocs?.includes(
        "Account statement from creditor reflecting 0 balance.",
      ),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "8d-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Bank statement reflects another person’s name and gift letter is not available/LOS is not updated.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "taxGiftChecklist",
    condition: (s: any) =>
      s.taxGiftDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CHECK CHECKLIST */

  {
    id: "8d-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "Payor name does not reflect borrower’s name but different individual’s name.",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "taxGiftChecklist",
    condition: (s: any) =>
      s.taxGiftDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "8d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 3 appears as per Branch 4",
    condition: (s: any) => s.taxGiftChecklist?.length > 0,
  },
];

export const TaxLienFlow = [
  {
    id: "9a",
    type: "radio",
    label:
      "Check if any supporting documents are available for excluding the tax lien account?",
    options: ["Yes", "No"],
    storeKey: "taxLienDocsAvailable",
  },

  {
    id: "9a-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 8 appears as per Branch 1",
    condition: (s: any) => s.taxLienDocsAvailable === "No",
  },

  {
    id: "9b",
    type: "checkbox",
    label:
      "Please select the applicable option for the exclusion of the account?",
    options: [
      "Account is already paid off by the borrower",
      "Account paid by other parties through gift",
    ],
    storeKey: "taxLienReason",
    condition: (s: any) => s.taxLienDocsAvailable === "Yes",
  },

  /*
  ------------------------------------------------
  PROMPT 9C
  ACCOUNT PAID OFF BY BORROWER
  ------------------------------------------------
  */

  {
    id: "9c-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Tax statement reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "taxLienPaidDocs",
    condition: (s: any) =>
      s.taxLienReason?.includes("Account is already paid off by the borrower"),
  },

  /* TAX STATEMENT CHECKLIST */

  {
    id: "9c-checklist-tax",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Tax statements still reflect an outstanding balance and after including the payment ratios exceed the limit of 50%.",
      "Case number/creditor name on letter does not match with the other documents.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "taxLienPaidChecklist",
    condition: (s: any) =>
      s.taxLienPaidDocs?.includes("Tax statement reflecting 0 balance."),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "9c-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance or account is released.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "taxLienPaidChecklist",
    condition: (s: any) =>
      s.taxLienPaidDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CHECK CHECKLIST */

  {
    id: "9c-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Tax letter not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "taxLienPaidChecklist",
    condition: (s: any) =>
      s.taxLienPaidDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "9c-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 7 appears as per Branch 3",
    condition: (s: any) => s.taxLienPaidChecklist?.length > 0,
  },

  /*
  ------------------------------------------------
  PROMPT 9D
  PAID BY OTHER PARTY (GIFT)
  ------------------------------------------------
  */

  {
    id: "9d-documents",
    type: "checkbox",
    label: "What documents are received (Select all that apply)",
    options: [
      "Account statement from creditor reflecting 0 balance.",
      "Bank statement/Transaction History reflecting withdrawal amount",
      "Cancelled check/Cashier’s check",
    ],
    storeKey: "taxLienGiftDocs",
    condition: (s: any) =>
      s.taxLienReason?.includes("Account paid by other parties through gift"),
  },

  /* ACCOUNT STATEMENT CHECKLIST */

  {
    id: "9d-checklist-statement",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Letter from creditor does not reflect account has $0 balance and after including the payment ratios exceed the limit of 50%.",
      "Account number/creditor name on letter does not match with the credit report.",
      "Other discrepancies are noted in the letter.",
    ],
    storeKey: "taxLienGiftChecklist",
    condition: (s: any) =>
      s.taxLienGiftDocs?.includes(
        "Account statement from creditor reflecting 0 balance.",
      ),
  },

  /* BANK STATEMENT CHECKLIST */

  {
    id: "9d-checklist-bank",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Bank statement/Transaction History does not reflect withdrawal amount equal to or more than the outstanding balance.",
      "Bank statement/Transaction History reflects withdrawal amount similar to outstanding balance, but description does not reflect creditor details.",
      "Bank statement/Transaction History provided reflects other discrepancy.",
      "Bank statement reflects another person’s name and gift letter is not available/LOS is not updated.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
      "Bank statement/transaction history reflects undisclosed withdrawal for which additional clarification is required.",
      "Bank statement/transaction history reflects large deposits which were used to pay off the 30-day charge account.",
    ],
    storeKey: "taxLienGiftChecklist",
    condition: (s: any) =>
      s.taxLienGiftDocs?.includes(
        "Bank statement/Transaction History reflecting withdrawal amount",
      ),
  },

  /* CHECK CHECKLIST */

  {
    id: "9d-checklist-check",
    type: "checkbox",
    label: "Review checklist and select all that apply",
    options: [
      "Cancelled/cashier’s check does not reflect creditor name as payee",
      "Payor name does not reflect borrower’s name but different individual’s name.",
      "The amount reflected on the check is less than the outstanding balance reported on the credit report.",
      "Cashier check provided however; bank statement reflecting withdrawal is not available.",
      "Credit supplement /other supporting document not available reflecting account is paid off with $0 balance.",
    ],
    storeKey: "taxLienGiftChecklist",
    condition: (s: any) =>
      s.taxLienGiftDocs?.includes("Cancelled check/Cashier’s check"),
  },

  {
    id: "9d-condition",
    type: "alert",
    variant: "warning",
    label: "Condition 4 appears as per Branch 4",
    condition: (s: any) => s.taxLienGiftChecklist?.length > 0,
  },
];
