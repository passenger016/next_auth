import { db } from "@/lib/db";

// function to fetch the account if it is linked to a OAUTH provider
export const getAccountByUserId = async (userId: string) => {
  try {
    // we will query the Account table which has the accounts linked to OAUTH providers
    // and check if the userId being passed is linked to any OAUTH provider account
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });
    // if the account exists we will return it else return null
    return account;
  } catch {
    // catch will be triggered if there is any error while querying the database
    // which means the account does not exist
    return null;
  }
};
