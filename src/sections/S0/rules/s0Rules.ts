import type { S0State } from "../store/s0Store";

export function evaluateInitialization(data: S0State) {
  if (!data.applicationDate) {
    return { error: "Application Date required" };
  }

  if (!data.closingDate) {
    return { error: "Closing Date required" };
  }

  if (!data.creditAsOfDate) {
    return { error: "Credit Report Date required" };
  }

  return {
    nextRoute: "/s1/inventory",
  };
}
