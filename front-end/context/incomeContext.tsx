import { createContext, useContext, useState, ReactNode } from "react";
import apiRequest from "../components/ApiRequest";
import { useAccount } from "./accountContext";

// === Type Definitions ===
type IncomeContextType = {
  createNewIncome: (accountId: number, income: IncomeToPost) => void;
  createNewPlanIncome: (accountId: number, planIncome: PlanIncomeToPost) => void;
  createIncomeFromPlan: (planId: number) => void;
  getIncomesByAccountId: (accountId: number) => Promise<Income[]>;
  getIncomePlanByAccountId: (accountId: number) => Promise<PlanIncome[]>;
  editIncome: (incomeId: number, data: IncomeToPost) => Promise<void>;
  deleteIncome: (incomeId: number) => Promise<void>;
  editPlanIncome: (planId: number, data: PlanIncomeToPost) => Promise<void>;
  deletePlanIncome: (planId: number) => Promise<void>;
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

type IncomeToPost = {
  name: string;
  value: number;
  date: Date;
  desc?: string;
  planIncomeId?: number;
};

type PlanIncome = {
  id: number;
  name: string;
  value: number;
  date?: Date;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

type PlanIncomeToPost = {
  name: string;
  value: number;
  date?: Date;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

// === URLs ===
const incomeUrl = "http://localhost:8080/incomes";
const planIncomeUrl = "http://localhost:8080/planIncome";

// === Context ===
const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

// === Provider ===
export function IncomeProvider({ children }: { children: ReactNode }) {
  const { reloadAccount } = useAccount();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createNewIncome = async (accountId: number, income: IncomeToPost) => {
    const url = `${incomeUrl}/post/${accountId}`;
    try {
      await apiRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(income),
      });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const createNewPlanIncome = async (accountId: number, planIncome: PlanIncomeToPost) => {
    const url = `${planIncomeUrl}/post/${accountId}`;
    try {
      await apiRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planIncome),
      });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const createIncomeFromPlan = async (planId: number) => {
    const url = `${planIncomeUrl}/postIncome/${planId}`;
    try {
      await apiRequest(url, { method: "POST" });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const editIncome = async (incomeId: number, data: IncomeToPost) => {
    const url = `${incomeUrl}/put/${incomeId}`;
    try {
      await apiRequest(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const deleteIncome = async (incomeId: number) => {
    const url = `${incomeUrl}/delete/${incomeId}`;
    try {
      await apiRequest(url, { method: "DELETE" });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const editPlanIncome = async (planId: number, data: PlanIncomeToPost) => {
    const url = `${planIncomeUrl}/put/${planId}`;
    try {
      await apiRequest(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const deletePlanIncome = async (planId: number) => {
    const url = `${planIncomeUrl}/delete/${planId}`;
    try {
      await apiRequest(url, { method: "DELETE" });
      setErrorMessage(null);
      reloadAccount();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const getIncomesByAccountId = async (accountId: number): Promise<Income[]> => {
    try {
      return await apiRequest(`${incomeUrl}/getByAccount/${accountId}`, { method: "GET" });
    } catch (error: any) {
      console.error("Error fetching incomes:", error.message);
      return [];
    }
  };

  const getIncomePlanByAccountId = async (accountId: number): Promise<PlanIncome[]> => {
    try {
      return await apiRequest(`${planIncomeUrl}/getByAccount/${accountId}`, { method: "GET" });
    } catch (error: any) {
      console.error("Error fetching plan incomes:", error.message);
      return [];
    }
  };

  return (
    <IncomeContext.Provider
      value={{
        createNewIncome,
        createNewPlanIncome,
        createIncomeFromPlan,
        getIncomesByAccountId,
        getIncomePlanByAccountId,
        editIncome,
        deleteIncome,
        editPlanIncome,
        deletePlanIncome,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

// === Hook ===
export function useIncome() {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncome must be used within an IncomeProvider");
  }
  return context;
}
