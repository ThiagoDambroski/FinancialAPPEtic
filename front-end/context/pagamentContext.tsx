import { createContext, useContext, ReactNode } from "react";
import apiRequest from "../components/ApiRequest";
import { useAccount } from "./accountContext";

// TYPES
type PagamentContextType = {
  createNewPagament: (accountId: number, pagament: PagamentToPost) => void;
  createNewPlanPagament: (accountId: number, plan: PlanPagamentToPost) => void;
  createPagamentFromPlan: (planId: number) => void;
  getPagamentsByAccountId: (accountId: number) => Promise<Pagament[]>;
  getPagamentPlanByAccountId: (accountId: number) => Promise<PlanPagament[]>;
  editPagament: (pagamentId: number, updatedData: PagamentToPost) => Promise<void>;
  deletePagament: (pagamentId: number) => Promise<void>;
  editPlanPagament: (planId: number, updatedData: PlanPagamentToPost) => Promise<void>;
  deletePlanPagament: (planId: number) => Promise<{ success: boolean; message: string }>;
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

type PagamentToPost = {
  name: string;
  value: number;
  date: Date;
  desc?: string;
  planPagamentId?: number;
};

type PlanPagament = {
  id: number;
  name: string;
  value: number;
  date?: Date;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

type PlanPagamentToPost = {
  name: string;
  value: number;
  date?: Date;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

const PagamentContext = createContext<PagamentContextType | undefined>(undefined);

const pagamentUrl = "http://localhost:8080/pagaments";
const pagamentPlanUrl = "http://localhost:8080/planPagament";

export function PagamentProvider({ children }: { children: ReactNode }) {
  const { reloadAccount } = useAccount();

  const createNewPagament = async (accountId: number, pagament: PagamentToPost) => {
    try {
      const postOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagament),
      };
      await apiRequest(`${pagamentUrl}/post/${accountId}`, postOptions);
      reloadAccount();
    } catch (error: any) {
      console.error("Error creating pagament:", error.message);
    }
  };

  const createNewPlanPagament = async (accountId: number, plan: PlanPagamentToPost) => {
    try {
      const postOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      };
      await apiRequest(`${pagamentPlanUrl}/post/${accountId}`, postOptions);
      reloadAccount();
    } catch (error: any) {
      console.error("Error creating plan pagament:", error.message);
    }
  };

  const createPagamentFromPlan = async (planId: number) => {
    try {
      await apiRequest(`${pagamentPlanUrl}/postPagament/${planId}`, { method: "POST" });
      reloadAccount();
    } catch (error: any) {
      console.error("Error creating pagament from plan:", error.message);
    }
  };

  const getPagamentsByAccountId = async (accountId: number): Promise<Pagament[]> => {
    try {
      return await apiRequest(`${pagamentUrl}/getByAccount/${accountId}`, { method: "GET" });
    } catch (error: any) {
      console.error("Error fetching pagaments by account:", error.message);
      return [];
    }
  };

  const getPagamentPlanByAccountId = async (accountId: number): Promise<PlanPagament[]> => {
    try {
      return await apiRequest(`${pagamentPlanUrl}/getByAccount/${accountId}`, { method: "GET" });
    } catch (error: any) {
      console.error("Error fetching plan pagaments by account:", error.message);
      return [];
    }
  };

  const editPagament = async (pagamentId: number, updatedData: PagamentToPost) => {
    try {
      await apiRequest(`${pagamentUrl}/put/${pagamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      reloadAccount();
    } catch (error: any) {
      console.error("Error editing pagament:", error.message);
    }
  };

  const deletePagament = async (pagamentId: number) => {
    try {
      await apiRequest(`${pagamentUrl}/delete/${pagamentId}`, { method: "DELETE" });
      reloadAccount();
    } catch (error: any) {
      console.error("Error deleting pagament:", error.message);
    }
  };

  const editPlanPagament = async (planId: number, updatedData: PlanPagamentToPost) => {
    try {
      await apiRequest(`${pagamentPlanUrl}/put/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      reloadAccount();
    } catch (error: any) {
      console.error("Error editing plan pagament:", error.message);
    }
  };

  const deletePlanPagament = async (planId: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiRequest(`${pagamentPlanUrl}/delete/${planId}`, {
        method: "DELETE",
      });
      reloadAccount();
      return { success: true, message: "Deleted successfully." };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  return (
    <PagamentContext.Provider
      value={{
        createNewPagament,
        createNewPlanPagament,
        createPagamentFromPlan,
        getPagamentsByAccountId,
        getPagamentPlanByAccountId,
        editPagament,
        deletePagament,
        editPlanPagament,
        deletePlanPagament,
      }}
    >
      {children}
    </PagamentContext.Provider>
  );
}

export function usePagament() {
  const context = useContext(PagamentContext);
  if (!context) {
    throw new Error("usePagament must be used within a PagamentProvider");
  }
  return context;
}
