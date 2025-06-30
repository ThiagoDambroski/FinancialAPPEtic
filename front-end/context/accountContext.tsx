// context/accountContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import apiRequest from "../components/ApiRequest";
import { useUser } from "./userContext";

type AccountContextType = {
  accountList: Account[];
  createNewAccount: (account: AccountToPost) => Promise<void>;
  updateAccount: (accountId: number, updatedData: AccountToPost) => Promise<void>;
  deleteAccount: (accountId: number) => Promise<void>;
  reloadAccount: () => void;
  getOperationsByAccountId: (accountId: number) => Promise<OperationsList | null>;
  reload: boolean;
};

type Account = {
  id: number;
  name: string;
  value: number;
  moneyType?: string;
  openDate?: Date;
};

type AccountToPost = {
  name: string;
  moneyType?: string;
  openDate?: Date;
};

type Income = {
  id: number;
  name: string;
  value: number;
  date: Date;
  desc?: string;
  accountId: number;
  planIncomeId?: number;
};

type Pagament = {
  id: number;
  name: string;
  value: number;
  date: Date;
  desc?: string;
  accountId: number;
  planPagamentId?: number;
};

type OperationsList = {
  pagaments: Pagament[];
  incomes: Income[];
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);
const accountUrl = "http://localhost:8080/accounts";

export function AccountProvider({ children }: { children: ReactNode }) {
  const { userLogged, isLoggedIn, reloadUser } = useUser();

  const [accountList, setAccountList] = useState<Account[]>([]);
  const [reload, setReload] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadAccount = () => {
    setReload((prev) => !prev);
  };

  useEffect(() => {
    const getByUserId = async () => {
      if (isLoggedIn) {
        const url = `${accountUrl}/getByUser/${userLogged.id}`;
        const getOptions = { method: "GET" };

        try {
          const result: Account[] = await apiRequest(url, getOptions);
          setAccountList(result);
          reloadUser();
        } catch (error: any) {
          setErrorMessage(error.message);
        }
      }
    };

    getByUserId();
  }, [userLogged, isLoggedIn, reload]);

  const createNewAccount = async (account: AccountToPost) => {
    const url = `${accountUrl}/post/${userLogged.id}`;
    const postOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    };

    try {
      await apiRequest(url, postOptions);
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const updateAccount = async (accountId: number, updatedData: AccountToPost) => {
    const url = `${accountUrl}/put/${accountId}`;
    const putOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    };

    try {
      await apiRequest(url, putOptions);
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const deleteAccount = async (accountId: number) => {
    const url = `${accountUrl}/delete/${accountId}`;
    const deleteOptions = { method: "DELETE" };

    try {
      await apiRequest(url, deleteOptions);
      setErrorMessage(null)
      reloadUser()
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const getOperationsByAccountId = async (accountId: number): Promise<OperationsList | null> => {
    const url = `${accountUrl}/getAllOperations/${accountId}`;
    const getOptions = { method: "GET" };

    try {
      const result = await apiRequest(url, getOptions);
      return result as OperationsList;
    } catch (error) {
      console.error("Failed to fetch operations:", error);
      return null;
    }
  };

  return (
    <AccountContext.Provider
      value={{
        accountList,
        createNewAccount,
        updateAccount,
        deleteAccount,
        reloadAccount,
        getOperationsByAccountId,
        reload,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
