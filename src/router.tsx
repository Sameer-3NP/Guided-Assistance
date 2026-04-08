import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Section1Layout from "./sections/S1/Section1Layout";

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

import ScoreAvailability from "./sections/S3/screens/ScoreAvailability";
import QualifyingScore from "./sections/S3/screens/QualifyingScore";
import MedianScore from "./sections/S3/screens/MedianScore";
import CoreIdentitySummary from "./sections/S2/screens/CoreIdentitySummary";
import CurrentAddressSummary from "./sections/S2/screens/CurrentAddressSummary";
import Section2Summary from "./sections/S2/screens/Section2Summary";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/s0" />,
//       },
//       {
//         path: "s0",
//         element: <Initialization />,
//       },
//       {
//         path: "s1/inventory",
//         element: <CreditInventory />,
//       },
//       {
//         path: "s1/multiple-reports",
//         element: <MultipleReports />,
//       },
//       {
//         path: "s1/repository-check",
//         element: <RepositoryCheck />,
//       },
//       {
//         path: "s1/credit-report-validity",
//         element: <CreditReportValidity />,
//       },
//       {
//         path: "s1/source-request-integrity",
//         element: <SourceRequestIntegrity />,
//       },
//       {
//         path: "s1/system-alignment-review",
//         element: <SystemAlignmentReview />,
//       },
//       {
//         path: "s1/section1-summary",
//         element: <Screen1Summary />,
//       },
//       {
//         path: "s1",
//         element: <Navigate to="/s1/inventory" replace />,
//       },
//       // Placeholders for S2
//       {
//         path: "s2",
//         element: <Navigate to="/s2/core-identity" replace />,
//       },
//       {
//         path: "s2/core-identity",
//         element: <CoreIdentity />,
//       },
//       {
//         path: "s2/current-address",
//         element: <CurrentAddress />,
//       },
//       {
//         path: "s2/previous-address",
//         element: <PreviousAddress />,
//       },
//       {
//         path: "s3",
//         element: <Navigate to="/s3/score-availability" replace />,
//       },
//       {
//         path: "s3/score-availability",
//         element: <ScoreAvailability />,
//       },
//       {
//         path: "s3/qualifying-score",
//         element: <QualifyingScore />,
//       },
//       {
//         path: "s3/median-score",
//         element: <MedianScore />,
//       },
//       {
//         path: "s4",
//         element: <div>Section 4 not implemented yet</div>,
//       },
//       {
//         path: "s5",
//         element: <div>Section 5 not implemented yet</div>,
//       },
//     ],
//   },
// ]);

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
        // element: <Section1Layout />,
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

      // Section 4 & 5 placeholders
      { path: "s4", element: <div>Section 4 not implemented yet</div> },
      { path: "s5", element: <div>Section 5 not implemented yet</div> },
    ],
  },
]);
