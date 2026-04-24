import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Initialization from "./sections/S0/Initialization";

import CreditInventory from "./sections/S1/screens/CreditInventory";
import MultipleReports from "./sections/S1/screens/MultipleReports";
import RepositoryCheck from "./sections/S1/screens/RepositoryCheck";
import CreditReportValidity from "./sections/S1/screens/CreditReportValidity";
import SourceRequestIntegrity from "./sections/S1/screens/SourceRequestIntegrity";
import SystemAlignmentReview from "./sections/S1/screens/SystemAlignmentReview";
import Section1Summary from "./sections/S1/screens/Section1Summary";

import CoreIdentity from "./sections/S2/screens/CoreIdentity";
import CoreIdentitySummary from "./sections/S2/screens/CoreIdentitySummary";
import CurrentAddress from "./sections/S2/screens/CurrentAddress";
import CurrentAddressSummary from "./sections/S2/screens/CurrentAddressSummary";
import PreviousAddress from "./sections/S2/screens/PreviousAddress";
import Section2Summary from "./sections/S2/screens/Section2Summary";

import ScoreAvailability from "./sections/S3/screens/ScoreAvailability";
import QualifyingScore from "./sections/S3/screens/QualifyingScore";
import MedianScore from "./sections/S3/screens/MedianScore";

import TradelineStructuralAlignment from "./sections/S4/screens/TradelineStructuralAlignment";
import MissingTradelinePaymentHandling from "./sections/S4/screens/MissingTradelinePaymentHandling";
import CollectionAccountHandling from "./sections/S4/screens/CollectionAccountHandling";
import DisputedAccountHandling from "./sections/S4/screens/DisputedAccountHandling";
import ExcludedOmittedTradelineValidation from "./sections/S4/screens/excluded_tradeline_validation/ExcludedOmittedTradelineValidation";
import UtilityTelecomAccountHandling from "./sections/S4/screens/UtilityTelecomAccountHandling";
import PaymentHistoryRecencyValidation from "./sections/S4/screens/PaymentHistoryRecencyValidation";
import DelinquencyLateHandling from "./sections/S4/screens/DelinquencyLateHandling";
import AuthorizedUserAccountHandling from "./sections/S4/screens/AuthorizedUserAccountHandling";
import LiabilityPaidOffHandling from "./sections/S4/screens/LiabilityPaidOffHandling/LiabilityPaidOffHandling";
import DuplicateTradelineHandling from "./sections/S4/screens/DuplicateTradelineHandling";
import PastAccountHandling from "./sections/S4/screens/PastAccountHandling";
import ChildSupportHandling from "./sections/S4/screens/ChildSupportHandling";

import ActiveBankruptcyHandling from "./sections/S5/screens/ActiveBankruptcyHandling";
import BankruptcyWaitingPeriodValidation from "./sections/S5/screens/BankruptcyWaitingPeriodValidation";
import MortgageDerogatoryEventHandling from "./sections/S5/screens/MortgageDerogatoryEventHandling";
import TaxLienHandling from "./sections/S5/screens/TaxLienHandling";
import JudgmentHandling from "./sections/S5/screens/JudgmentHandling";
import LastScreen from "./sections/S5/screens/lastScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/s0" replace /> },
      { path: "s0", element: <Initialization /> },

      // Section 1
      {
        path: "s1",
        children: [
          { index: true, element: <Navigate to="inventory" replace /> },
          { path: "inventory", element: <CreditInventory /> },
          { path: "multiple-reports", element: <MultipleReports /> },
          { path: "repository-check", element: <RepositoryCheck /> },
          { path: "credit-report-validity", element: <CreditReportValidity /> },
          {
            path: "source-request-integrity",
            element: <SourceRequestIntegrity />,
          },
          {
            path: "system-alignment-review",
            element: <SystemAlignmentReview />,
          },
          { path: "section1-summary", element: <Section1Summary /> },
        ],
      },

      // Section 2
      {
        path: "s2",
        children: [
          { index: true, element: <Navigate to="core-identity" replace /> },
          { path: "core-identity", element: <CoreIdentity /> },
          { path: "core-identity-summary", element: <CoreIdentitySummary /> },
          { path: "current-address", element: <CurrentAddress /> },
          {
            path: "current-address-summary",
            element: <CurrentAddressSummary />,
          },
          { path: "previous-address", element: <PreviousAddress /> },
          { path: "section2-summary", element: <Section2Summary /> },
        ],
      },

      // Section 3
      {
        path: "s3",
        children: [
          {
            index: true,
            element: <Navigate to="score-availability" replace />,
          },
          { path: "score-availability", element: <ScoreAvailability /> },
          { path: "qualifying-score", element: <QualifyingScore /> },
          { path: "median-score", element: <MedianScore /> },
        ],
      },

      // Section 4
      {
        path: "s4",
        children: [
          {
            index: true,
            element: <Navigate to="tradeline-structural-alignment" replace />,
          },
          {
            path: "tradeline-structural-alignment",
            element: <TradelineStructuralAlignment />,
          },
          {
            path: "missing-tradeline-payment",
            element: <MissingTradelinePaymentHandling />,
          },
          {
            path: "collection-account",
            element: <CollectionAccountHandling />,
          },
          { path: "disputed-account", element: <DisputedAccountHandling /> },
          {
            path: "excluded-tradeline",
            element: <ExcludedOmittedTradelineValidation />,
          },
          {
            path: "utility-telecom-account",
            element: <UtilityTelecomAccountHandling />,
          },
          {
            path: "payment-history-recency",
            element: <PaymentHistoryRecencyValidation />,
          },
          { path: "delinquency-late", element: <DelinquencyLateHandling /> },
          {
            path: "authorized-user-account",
            element: <AuthorizedUserAccountHandling />,
          },
          { path: "duplicate-trade", element: <DuplicateTradelineHandling /> },
          { path: "past-due", element: <PastAccountHandling /> },
          { path: "liability-paid-off", element: <LiabilityPaidOffHandling /> },
          { path: "child-support", element: <ChildSupportHandling /> },
        ],
      },

      // Section 5
      {
        path: "s5",
        children: [
          { index: true, element: <Navigate to="active-bankruptcy" replace /> },
          { path: "active-bankruptcy", element: <ActiveBankruptcyHandling /> },
          {
            path: "bankruptcy-waiting-period",
            element: <BankruptcyWaitingPeriodValidation />,
          },
          {
            path: "mortgage-derogatory-event",
            element: <MortgageDerogatoryEventHandling />,
          },
          { path: "tax-lien", element: <TaxLienHandling /> },
          { path: "judgment", element: <JudgmentHandling /> },
          { path: "last-screen", element: <LastScreen /> },
        ],
      },
    ],
  },
]);
