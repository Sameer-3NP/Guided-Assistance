export type CreditReport = {
  label: string;

  borrowerSlot: string;

  updateDate: string;
  expirationDate: string;

  overrideExpiration: boolean;

  repositories: {
    eq: boolean;
    ex: boolean;
    tu: boolean;
  };

  repositoryCount: number;
};
