export const calculateExpirationDate = (updateDate: string) => {
  if (!updateDate) return "";

  const date = new Date(updateDate);

  date.setDate(date.getDate() + 120);

  return date.toISOString().split("T")[0];
};
