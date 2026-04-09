import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

// Optional: map segment keys to pretty names
const segmentNames: Record<string, string> = {
  s0: "Initialization",
  s1: "Credit Report Details",
  inventory: "Credit Inventory",
  "multiple-reports": "Multiple Reports",
  "repository-check": "Repository Check",
  "credit-report-validity": "Credit Report Validity",
  "source-request-integrity": "Source Request Integrity",
  "system-alignment-review": "System Alignment Review",
  "section1-summary": "Section1 Summary",
  s2: "Borrower Identity & File Association",
  "core-identity": "2.1 - Core Identity Consistency",
  "current-address": "2.2 - Current Address Consistency",
  "previous-address": "2.3 - Previous Address Consistency",
  "section2-summary": "Section2 Summary",
  s3: "Borrower Credit Score",
  "score-availability": "3.1 - Credit Score Availability & Freeze Handling ",
  "qualifying-score": "3.2 - Qualifying Credit Score Determination ",
  "median-score": " 3.3 - Median Credit Score & Minimum Requirement ",
  s4: "Credit Report Tradeline Validation Rules",
  "tradeline-structural-alignment": "4.1 - Tradeline Structural Alignment",
  "missing-tradeline-payment": "4.2 - Missing Tradeline Payment Handling",
  "collection-account": "4.3 - Collection Account Handling",
  "disputed-account": "4.4 - Disputed Account Handling",
  "excluded-tradeline": "4.5 - Excluded / Omitted Tradeline Validation",
  "utility-telecom-account":
    "4.6 - Utility / Self-Reported / Telecom Account Handling",
  "payment-history-recency": "4.7 - Payment History Recency Validation",
  "delinquency-late": "4.8 - Delinquency & 30/60/90 Late Handling",
  "authorized-user-account": "4.9 - Authorized User Account Handling",
  "duplicate-trade": "4.10 - Duplicate Tradeline Handling ",
  "past-due": "4.11 - Past Due Account Handling",
  "liability-paid-off": "4.12 - Liability Being Paid Off Handling",
  s5: "Derogatory Events Rule",
  "active-bankruptcy": "5.1 - Active Bankruptcy Handling",
  "bankruptcy-waiting-period":
    "5.2 - Bankruptcy Waiting Period Validation (Chapter 7 & 13)",
  "mortgage-derogatory-event": "5.3 - Mortgage Derogatory Event Handling",
  "tax-lien": "5.4 - Tax Lien Handling (Released & Not Released)",
  judgment: "5.5 - Judgment Handling (Released & Not Released)",
  "section5-summary": "Section5 Summary",
};

// Helper: build paths for each breadcrumb segment
const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  let accumulated = "";
  return segments.map((seg) => {
    accumulated += "/" + seg;
    return { path: accumulated, name: segmentNames[seg] || seg };
  });
};

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const crumbs = generateBreadcrumbs(location.pathname);

  return (
    <div className="h-12 bg-gray-50 border-b flex items-center px-6 text-sm text-gray-600 gap-2 overflow-x-auto">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <div
            key={crumb.path}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {/* {index === 0 && <FolderIcon className="w-4 h-4 text-gray-400" />} */}

            {!isLast ? (
              <button
                onClick={() => navigate(crumb.path)}
                className=" text-blue-600 flex items-center gap-1 font-semibold"
              >
                {crumb.name}
              </button>
            ) : (
              <span className="font-medium text-gray-800">{crumb.name}</span>
            )}

            {!isLast && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
