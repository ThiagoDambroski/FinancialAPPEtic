import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import { useAccount } from "../context/accountContext";


type Account = {
  id: number;
  name: string;
  value: number;
  moneyType?: string;
  openDate?: Date;
};

export default function Welcome() {
  const { isLoggedIn, logout, userLogged, moneyAmount } = useUser();
  const { accountList, createNewAccount} = useAccount();

  const [lightbox, setLightbox] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [value, setValue] = useState(0);
  const [moneyType, setMoneyType] = useState("");

  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.toggle("light-box-block", lightbox);
    }
  }, [lightbox]);

  const goToAccountHub = (account: Account) => {
    router.push(`/account/${account.id}`);
  };

  const handleAccountCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const accountNew = {
      name: accountName,
      value: value,
      openDate: new Date(),
      moneyType: moneyType,
    };
    createNewAccount(accountNew);

    setLightbox(false);
    setAccountName("");
    setValue(0);
    setMoneyType("");
  };

  const filteredAccounts = accountList?.filter((account) =>
    account.name.toLowerCase().includes(searchName.toLowerCase()) &&
    account.moneyType?.toLowerCase().includes(filterType.toLowerCase())
  );

  const paginatedAccounts = filteredAccounts?.slice(
    (currentPage - 1) * accountsPerPage,
    currentPage * accountsPerPage
  );

  const totalPages = Math.ceil((filteredAccounts?.length || 0) / accountsPerPage);

  if (!isLoggedIn) return null;

  return (
    <div className="welcome-page">
      {/* LEFT COLUMN: Accounts */}
      <div className="left-column">
        <h3>Accounts</h3>

        <div className="filter-section">
          <input
            type="text"
            placeholder="Filter by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Currency"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>

        <div className="account-list">
          {paginatedAccounts?.map((account) => (
            <p key={account.id} onClick={() => goToAccountHub(account)}>
              {account.name} - {account.value} {account.moneyType}
            </p>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Info */}
      <div className="right-column">
        <h1>Welcome {userLogged.username}!</h1>
        <h2>Total Money:</h2>
        <ul>
          {moneyAmount?.map((item, index) => (
            <li key={index}>
              {item.money} {item.moneyType}
            </li>
          ))}
        </ul>

        <div className="action-buttons">
          <button onClick={() => setLightbox(true)}>Create New Account</button>
          
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(false)}
        >
          <form
            className="lightbox-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAccountCreate}
          >
            <h2>Create New Account</h2>
            <input
              type="text"
              placeholder="Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Initial Value"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
            />
            <input
              type="text"
              placeholder="Currency (e.g. USD)"
              value={moneyType}
              onChange={(e) => setMoneyType(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
}
