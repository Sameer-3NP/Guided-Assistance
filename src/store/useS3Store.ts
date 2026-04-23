// store/useS3Store.ts
import { create } from "zustand";

type ScoreAvailability = {
  freeze: string | null;
  twoBureaus: string | null;
  oneScore: string | null;
  branchA: string;
  ausRequiresNonTrad: string | null;
  validatedByDu: string | null;
  nonTradAvailable: string | null;
  documents: string[];
  discrepancies: string[];
  branchACondition: string;
  freezeCondition: string;
  oneScoreCondition: string;
  nonTradMissingCondition: string;
  discrepanciesCondition: string;
};

type QualifyingScore = {
  borrowerCount: string | null;
  b1ScoresCount: string | null;
  b2ScoresCount: string | null;
  b1Scores: { sc1: string; sc2: string; sc3: string };
  b2Scores: { sc1: string; sc2: string; sc3: string };
  b1QualifyingScore: number | null;
  b2QualifyingScore: number | null;
};

type S3Store = {
  scoreAvailability: ScoreAvailability;
  setScoreAvailability: (data: Partial<ScoreAvailability>) => void;

  qualifyingScore: QualifyingScore;
  setQualifyingScore: (
    data:
      | Partial<QualifyingScore>
      | ((prev: QualifyingScore) => QualifyingScore),
  ) => void;
  updateB1Scores: (data: Partial<QualifyingScore["b1Scores"]>) => void;
  updateB2Scores: (data: Partial<QualifyingScore["b2Scores"]>) => void;
};

export const useS3Store = create<S3Store>((set) => ({
  scoreAvailability: {
    freeze: null,
    twoBureaus: null,
    oneScore: null,
    branchA: "",
    ausRequiresNonTrad: null,
    validatedByDu: null,
    nonTradAvailable: null,
    documents: [],
    discrepancies: [],
    branchACondition: "",
    freezeCondition: "",
    oneScoreCondition: "",
    nonTradMissingCondition: "",
    discrepanciesCondition: "",
  },

  setScoreAvailability: (data) =>
    set((state) => ({
      scoreAvailability: { ...state.scoreAvailability, ...data },
    })),

  qualifyingScore: {
    borrowerCount: null,
    b1ScoresCount: null,
    b2ScoresCount: null,
    b1Scores: { sc1: "", sc2: "", sc3: "" },
    b2Scores: { sc1: "", sc2: "", sc3: "" },
    b1QualifyingScore: null,
    b2QualifyingScore: null,
  },

  setQualifyingScore: (data) =>
    set((state) => ({
      qualifyingScore:
        typeof data === "function"
          ? data(state.qualifyingScore)
          : { ...state.qualifyingScore, ...data },
    })),

  updateB1Scores: (data) =>
    set((state) => ({
      qualifyingScore: {
        ...state.qualifyingScore,
        b1Scores: { ...state.qualifyingScore.b1Scores, ...data },
      },
    })),

  updateB2Scores: (data) =>
    set((state) => ({
      qualifyingScore: {
        ...state.qualifyingScore,
        b2Scores: { ...state.qualifyingScore.b2Scores, ...data },
      },
    })),
}));
