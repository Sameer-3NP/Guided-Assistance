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
import CurrentAddress from "./sections/S2/screens/CurrentAddress";
import PreviousAddress from "./sections/S2/screens/PreviousAddress";
import CoreIdentitySummary from "./sections/S2/screens/CoreIdentitySummary";
import CurrentAddressSummary from "./sections/S2/screens/CurrentAddressSummary";
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

import ActiveBankruptcyHandling from "./sections/S5/screens/ActiveBankruptcyHandling";
import BankruptcyWaitingPeriodValidation from "./sections/S5/screens/BankruptcyWaitingPeriodValidation";
import MortgageDerogatoryEventHandling from "./sections/S5/screens/MortgageDerogatoryEventHandling";
import TaxLienHandling from "./sections/S5/screens/TaxLienHandling";
import JudgmentHandling from "./sections/S5/screens/JudgmentHandling";
import Section5Summary from "./sections/S5/screens/Section5Summary";
import DuplicateTradelineHandling from "./sections/S4/screens/DuplicateTradelineHandling";
import PastAccountHandling from "./sections/S4/screens/PastAccountHandling";
import ChildSupportHandling from "./sections/S4/screens/ChildSupportHandling";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/s0" /> },
      { path: "s0", element: <Initialization /> },

      // Section 1 wrapper
      {
        path: "s1",
        children: [
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
          { index: true, element: <Navigate to="inventory" replace /> },
        ],
      },

      // Section 2
      { path: "s2", element: <Navigate to="/s2/core-identity" replace /> },
      { path: "s2/core-identity", element: <CoreIdentity /> },
      { path: "s2/core-identity-summary", element: <CoreIdentitySummary /> },
      { path: "s2/current-address", element: <CurrentAddress /> },
      {
        path: "s2/current-address-summary",
        element: <CurrentAddressSummary />,
      },
      { path: "s2/previous-address", element: <PreviousAddress /> },
      { path: "s2/section2-summary", element: <Section2Summary /> },

      // Section 3
      { path: "s3", element: <Navigate to="/s3/score-availability" replace /> },
      { path: "s3/score-availability", element: <ScoreAvailability /> },
      { path: "s3/qualifying-score", element: <QualifyingScore /> },
      { path: "s3/median-score", element: <MedianScore /> },

      // Section 4
      {
        path: "s4",
        element: <Navigate to="/s4/tradeline-structural-alignment" replace />,
      },

      {
        path: "s4/tradeline-structural-alignment",
        element: <TradelineStructuralAlignment />,
      },
      {
        path: "s4/missing-tradeline-payment",
        element: <MissingTradelinePaymentHandling />,
      },
      { path: "s4/collection-account", element: <CollectionAccountHandling /> },
      { path: "s4/disputed-account", element: <DisputedAccountHandling /> },
      {
        path: "s4/excluded-tradeline",
        element: <ExcludedOmittedTradelineValidation />,
      },
      {
        path: "s4/utility-telecom-account",
        element: <UtilityTelecomAccountHandling />,
      },
      {
        path: "s4/payment-history-recency",
        element: <PaymentHistoryRecencyValidation />,
      },
      { path: "s4/delinquency-late", element: <DelinquencyLateHandling /> },
      {
        path: "s4/authorized-user-account",
        element: <AuthorizedUserAccountHandling />,
      },
      { path: "s4/duplicate-trade", element: <DuplicateTradelineHandling /> },
      { path: "s4/past-due", element: <PastAccountHandling /> },
      { path: "s4/liability-paid-off", element: <LiabilityPaidOffHandling /> },
      { path: "s4/child-support", element: <ChildSupportHandling /> },

      // Section 5
      { path: "s5", element: <Navigate to="/s5/active-bankruptcy" replace /> },

      { path: "s5/active-bankruptcy", element: <ActiveBankruptcyHandling /> },
      {
        path: "s5/bankruptcy-waiting-period",
        element: <BankruptcyWaitingPeriodValidation />,
      },
      {
        path: "s5/mortgage-derogatory-event",
        element: <MortgageDerogatoryEventHandling />,
      },
      { path: "s5/tax-lien", element: <TaxLienHandling /> },
      { path: "s5/judgment", element: <JudgmentHandling /> },
      { path: "s5/section5-summary", element: <Section5Summary /> },
    ],
  },
]);
