export const MortgageConstants = {
  trusteesDeedOptions: [
    "Party name i.e lender name does not match tradeline hence clarification is required",
    "Property addresses is not available",
    "High Balance on tradeline does not match the amount mentioned on trustee's deed",
    "Document is not executed/notarized (if applicable)",
    "Disposition / recording / transfer date is not clearly identifiable",
  ],

  propertyProfileOptions: [
    "Party name i.e lender name does not match tradeline",
    "Property addresses is not available",
    "High Balance on tradeline does not match the amount mentioned on property profile as mortgage amount",
    "Disposition / recording / transfer date not clearly identifiable",
  ],

  shortSaleOptions: [
    "Party name i.e lender name on short sale letter do not match tradeline",
    "Property addresses is not available",
    "Document is not executed/notarized (if applicable)",
    "Short sale / recording / transfer date not clearly identifiable",
  ],

  settlementOptions: [
    "Party name i.e lender name on closing disclosure on seller side does not match tradeline",
    "Property addresses is not available",
    "Document is not executed (if applicable)",
    "Disposition/ closing date not clearly identifiable",
  ],

  cancellationOptions: [
    "Party name i.e creditor name and account number on 1099-C does not matches tradeline",
    "Property addresses are not available",
    "Date of identifiable event not clearly identifiable",
    "Debt Description does not reflect Mortgage",
  ],

  lenderLetterOptions: [
    "Party name i.e lender name on document available does not matches tradeline",
    "Property addresses is not available",
    "Document is not executed/notarized (if applicable)",
    "Recording / transfer date not clearly identifiable",
    "No information provided for Debt cancelled account",
  ],
};
