export type MenuList = {
  name: string;
  url: string;
};

export type Account = {
  id: number;
  accountId: number;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  address: string;
  city: string;
  emailAddress: string;
  balance: string;
  password: string;
  totalTransactions: number;
  totalCards: number;
};

export type Transaction = {
  id: number;
  transactionId: number;
  fromAccountId: number;
  toAccountId: number;
  transferAmount: number;
  dateCreated: Date;
};

export type Card = {
  id: number;
  accountId: number;
  cardNumber: number;
  expireMonth: string;
  expireYear: string;
  cardHolderName: string;
  cvv: number;
  blocked: boolean;
};
