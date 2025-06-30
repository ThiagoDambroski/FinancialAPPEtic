import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../context/userContext";
import apiRequest from "../../components/ApiRequest";
import MonthView from "../../components/MonthView";
import PagamentView from "../../components/PagamentView";
import IncomeView from "../../components/IncomeView";
import { useAccount } from "../../context/accountContext";

type Account = {
  id: number;
  name: string;
  value: number;
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
  incomes: Income[];
  pagaments: Pagament[];
};

export default function AccountPage() {
  const { isLoggedIn } = useUser();
  const { reload } = useAccount();
  const router = useRouter();
  const { id } = router.query;

  const [account, setAccount] = useState<Account | null>(null);
  const [operationsList, setOperationsList] = useState<OperationsList | null>(null);
  const [selectOption, setSelectOption] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!id) return;
      const accountUrl = `http://localhost:8080/accounts/getById/${id}`;
      const operationsUrl = `http://localhost:8080/accounts/getAllOperations/${id}`;
      try {
        const getOptions = { method: "GET" };
        const operationsData: OperationsList = await apiRequest(operationsUrl, getOptions);
        const accountData: Account = await apiRequest(accountUrl, getOptions);

        setAccount(accountData);
        setOperationsList(operationsData);
      } catch (error) {
        console.error("Error loading account:", error);
      }
    };

    fetchAccount();
  }, [id, reload]);

  if (!isLoggedIn || !account || !operationsList) return <p>Loading...</p>;

  return (
    <main className="account-page">
      {/* 🔙 Back arrow */}
      <div className="back-button" onClick={() => router.back()}>
        ← Back
      </div>

      <div className="account-header">
        <h1>{account.name}</h1>
        <h2>
          Balance: {account.value} {account.moneyType}
        </h2>
      </div>

      {/* 👇 View selector */}
      <div className="account-nav">
        <button
          className={selectOption === 0 ? "active" : ""}
          onClick={() => setSelectOption(0)}
        >
          Month
        </button>
        <button
          className={selectOption === 1 ? "active" : ""}
          onClick={() => setSelectOption(1)}
        >
          Payments
        </button>
        <button
          className={selectOption === 2 ? "active" : ""}
          onClick={() => setSelectOption(2)}
        >
          Income
        </button>
      </div>

      {/* 👇 Content based on selection */}
      <div className="account-content">
        {selectOption === 0 && <MonthView account={account} />}
        {selectOption === 1 && <PagamentView account={account} />}
        {selectOption === 2 && <IncomeView account={account} />}
      </div>
    </main>
  );
}
