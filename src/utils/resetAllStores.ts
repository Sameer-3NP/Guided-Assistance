// src/utils/resetAllStores.ts
import { useAppStore } from "../store/useAppStore";
import { useS0Store } from "../store/useS0Store";
import { useS1Store } from "../store/useS1Store";
import { useS2Store } from "../store/useS2Store";
import { useS3Store } from "../store/useS3Store";
import { useS4Store } from "../store/useS4Store";
import { useS5Store } from "../store/useS5Store";

export const resetAllStores = () => {
  useAppStore.getState().resetStore();
  useS0Store.getState().resetStore();
  useS1Store.getState().resetStore();
  useS2Store.getState().resetStore();
  useS3Store.getState().resetStore();
  useS4Store.getState().resetStore();
  useS5Store.getState().resetStore();
};
