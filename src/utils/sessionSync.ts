import { sessionApi } from "./sessionApi";
import { metadataApi } from "./metadataApi";
import { useAppStore } from "../store/useAppStore";
import { useS0Store } from "../store/useS0Store";
import { useS1Store } from "../store/useS1Store";
import { useS2Store } from "../store/useS2Store";
import { useS3Store } from "../store/useS3Store";
import { useS4Store } from "../store/useS4Store";
import { useS5Store } from "../store/useS5Store";

let screenStartTime = Date.now();
let previousScreen = "";

// ---------- COLLECT ALL STORE DATA ----------

const collectStoreData = () => {
  const s0 = useS0Store.getState().s0;
  const s1 = useS1Store.getState();
  const s2 = useS2Store.getState();
  const s3 = useS3Store.getState();
  const s4 = useS4Store.getState();
  const s5 = useS5Store.getState();

  return { s0, s1, s2, s3, s4, s5 };
};

// ---------- RESTORE ALL STORE DATA ----------

export const restoreStoreData = (storeData: any) => {
  if (!storeData) return;

  // S0
  if (storeData.s0 && Object.keys(storeData.s0).length > 0) {
    useS0Store.getState().setS0(storeData.s0);
  }

  // S1
  if (storeData.s1) {
    const s1 = storeData.s1;
    const s1Store = useS1Store.getState();
    if (s1.s1?.length) s1Store.setS1(s1.s1);
    if (s1.activeCreditReport)
      s1Store.setActiveCreditReport(s1.activeCreditReport);
    if (s1.selectedReports?.length)
      s1Store.setSelectedReports(s1.selectedReports);
    if (s1.reportQueue?.length) s1Store.setReportQueue(s1.reportQueue);
    if (s1.pullType) s1Store.setPullType(s1.pullType);
    if (s1.biMergeAccepted) s1Store.setBiMergeAccepted(s1.biMergeAccepted);
    if (s1.sourceRequestIntegrity)
      s1Store.setSourceRequestIntegrity(s1.sourceRequestIntegrity);
    if (s1.systemAlignmentReview)
      s1Store.setSystemAlignmentReview(s1.systemAlignmentReview);
    if (s1.CreditCondition) s1Store.setCreditCondition(s1.CreditCondition);
    if (s1.repositoryConditions)
      s1Store.setRepositoryConditions(s1.repositoryConditions);
    if (s1.sourceIntegrityConditions)
      s1Store.setSourceIntegrityConditions(s1.sourceIntegrityConditions);
    if (s1.systemAlignmentConditions)
      s1Store.setSystemAlignmentConditions(s1.systemAlignmentConditions);
  }

  // S2
  if (storeData.s2) {
    const s2 = storeData.s2;
    const s2Store = useS2Store.getState();
    if (s2.coreIdentity) s2Store.setCoreIdentity(s2.coreIdentity);
    if (s2.coreIdentityConditions)
      s2Store.setCoreIdentityConditions(s2.coreIdentityConditions);
    if (s2.coreIdentitySummary)
      s2Store.setCoreIdentitySummary(s2.coreIdentitySummary);
    if (s2.currentAddress) s2Store.setCurrentAddress(s2.currentAddress);
    if (s2.currentAddressConditions)
      s2Store.setCurrentAddressConditions(s2.currentAddressConditions);
    if (s2.currentAddressSummary)
      s2Store.setCurrentAddressSummary(s2.currentAddressSummary);
    if (s2.previousAddress) s2Store.setPreviousAddress(s2.previousAddress);
    if (s2.previousAddressConditions)
      s2Store.setPreviousAddressConditions(s2.previousAddressConditions);
    if (s2.section2Summary) s2Store.setSection2Summary(s2.section2Summary);
  }

  // S3
  if (storeData.s3) {
    const s3 = storeData.s3;
    const s3Store = useS3Store.getState();
    if (s3.scoreAvailability)
      s3Store.setScoreAvailability(s3.scoreAvailability);
    if (s3.qualifyingScore) s3Store.setQualifyingScore(s3.qualifyingScore);
  }

  // S4
  if (storeData.s4) {
    const s4 = storeData.s4;
    const s4Store = useS4Store.getState();
    if (s4.tradelineAlignment)
      s4Store.setTradelineAlignment(s4.tradelineAlignment);
    if (s4.missingTradelinePayment)
      s4Store.setMissingTradelinePayment(s4.missingTradelinePayment);
    if (s4.collectionHandling)
      s4Store.setCollectionHandling(s4.collectionHandling);
    if (s4.disputedHandling) s4Store.setDisputedHandling(s4.disputedHandling);
    if (s4.utilityTelecomAccount)
      s4Store.setUtilityTelecomAccount(s4.utilityTelecomAccount);
    if (s4.paymentHistoryRecencyValidation)
      s4Store.setPaymentHistoryRecencyValidation(
        s4.paymentHistoryRecencyValidation,
      );
    if (s4.delinquencyLateHandling)
      s4Store.setDelinquencyLateHandling(s4.delinquencyLateHandling);
    if (s4.authorizedUserAccountHandling)
      s4Store.setAuthorizedUserAccountHandling(
        s4.authorizedUserAccountHandling,
      );
    if (s4.duplicateTradelineHandling)
      s4Store.setDuplicateTradelineHandling(s4.duplicateTradelineHandling);
    if (s4.pastDueAccountHandling)
      s4Store.setPastDueAccountHandling(s4.pastDueAccountHandling);
    if (s4.liabilityPaidOffHandling)
      s4Store.setLiabilityPaidOffHandling(s4.liabilityPaidOffHandling);
    if (s4.childSupportHandling)
      s4Store.setChildSupportHandling(s4.childSupportHandling);
    if (s4.excludedTradelineValidation)
      s4Store.setExcludedTradelineValidation(s4.excludedTradelineValidation);
  }

  // S5
  if (storeData.s5) {
    const s5 = storeData.s5;
    const s5Store = useS5Store.getState();
    if (s5.activeBankruptcyHandling)
      s5Store.setActiveBankruptcyHandling(s5.activeBankruptcyHandling);
    if (s5.bankruptcyWaitingValidation)
      s5Store.setBankruptcyWaitingValidation(s5.bankruptcyWaitingValidation);
    if (s5.mortgageDerogatoryEventHandling)
      s5Store.setMortgageDerogatoryEventHandling(
        s5.mortgageDerogatoryEventHandling,
      );
    if (s5.taxLienHandling) s5Store.setTaxLienHandling(s5.taxLienHandling);
    if (s5.judgmentHandling) s5Store.setJudgmentHandling(s5.judgmentHandling);
  }
};

// ---------- SAVE SESSION TO BACKEND ----------

export const syncSession = async (currentScreen: string) => {
  const { sessionId, sectionStatus } = useAppStore.getState();
  if (!sessionId) return;

  const match = currentScreen.match(/^\/(s[0-5])/i);
  const currentSection = match ? match[1].toUpperCase() : "S0";

  try {
    await sessionApi.save(sessionId, {
      currentSection,
      currentScreen,
      sectionStatus,
      storeData: collectStoreData(),
    });
  } catch (err) {
    console.error("Session sync failed:", err);
  }
};

// ---------- TRACK SCREEN VISIT ----------

export const trackScreenVisit = async (
  newScreen: string,
  prevScreen?: string,
) => {
  const { sessionId } = useAppStore.getState();
  if (!sessionId) return;

  const now = Date.now();
  const duration = Math.floor((now - screenStartTime) / 1000);

  if (prevScreen || previousScreen) {
    try {
      await metadataApi.track(sessionId, {
        type: "screen_visit",
        screen: prevScreen || previousScreen,
        duration,
      });
    } catch (err) {
      console.error("Metadata track failed:", err);
    }
  }

  screenStartTime = now;
  previousScreen = newScreen;
};

// ---------- TRACK CONTINUE / BACK ----------

export const trackAction = async (
  type: "continue" | "back",
  screen: string,
) => {
  const { sessionId } = useAppStore.getState();
  if (!sessionId) return;

  try {
    await metadataApi.track(sessionId, {
      type,
      screen,
      duration: 0,
    });
  } catch (err) {
    console.error("Action track failed:", err);
  }
};

// ---------- RESUME SESSION ----------

export const resumeSession = async (sessionId: string) => {
  try {
    const session = await sessionApi.resume(sessionId);
    if (!session) return null;

    // restore section status
    useAppStore.getState().setSectionStatus(session.sectionStatus);

    // restore all store data
    restoreStoreData(session.storeData);

    return session;
  } catch (err) {
    console.error("Resume session failed:", err);
    return null;
  }
};
