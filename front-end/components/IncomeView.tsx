import React, { useState, useMemo, useEffect } from 'react';
import { useIncome } from '../context/incomeContext';
import PlanIncomeView from './PlanIncomeView';
import { useAccount } from '../context/accountContext';

type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest';

export default function IncomeView({ account }) {
  const {
    createNewIncome,
    getIncomesByAccountId,
    getIncomePlanByAccountId,
    editIncome,
    deleteIncome
  } = useIncome();

  const {reload} = useAccount()

  const [incomeList, setIncomeList] = useState([]);
  const [planIncomeList, setPlanIncomeList] = useState([]);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [monthFilter, setMonthFilter] = useState<'all' | string>('all');
  const [planFilter, setPlanFilter] = useState<'all' | number>('all');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState(0);
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const itemsPerPage = 5;
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [desc, setDesc] = useState('');

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  useEffect(() => {
    async function loadIncomes() {
      const data = await getIncomesByAccountId(account.id);
      const planData = await getIncomePlanByAccountId(account.id);
      setIncomeList(data);
      setPlanIncomeList(planData);
    }
    loadIncomes();
  }, [account,reload]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewIncome(account.id, { name, value, date, desc });
    const updated = await getIncomesByAccountId(account.id);
    setIncomeList(updated);
    setName('');
    setValue(0);
    setDate(new Date());
    setDesc('');
    setShowAddIncome(false)
  };

  const openEditForm = (inc) => {
    setSelectedIncome(inc);
    setEditName(inc.name);
    setEditValue(inc.value);
    setEditDate(formatDate(new Date(inc.date)));
    setEditDesc(inc.desc || '');
  };

  const handleConfirmEdit = async () => {
    if (!selectedIncome) return;
    const confirmed = confirm("Are you sure you want to save changes?");
    if (!confirmed) return;

    await editIncome(selectedIncome.id, {
      name: editName,
      value: editValue,
      date: new Date(editDate),
      desc: editDesc,
      planIncomeId: selectedIncome.planIncomeId
    });

    const updated = await getIncomesByAccountId(account.id);
    setIncomeList(updated);
    setSelectedIncome(null);
  };

  const handleDelete = async () => {
    if (!selectedIncome) return;
    const confirmed = confirm("Are you sure you want to delete this income?");
    if (!confirmed) return;

    await deleteIncome(selectedIncome.id);
    const updated = await getIncomesByAccountId(account.id);
    setIncomeList(updated);
    setSelectedIncome(null);
  };

  const months = useMemo(() => {
    const set = new Set<string>();
    incomeList.forEach(inc => {
      const d = new Date(inc.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      set.add(m);
    });
    return Array.from(set).sort().reverse();
  }, [incomeList]);

  const filtered = useMemo(() => {
    return incomeList.filter(inc => {
      const d = new Date(inc.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const matchMonth = monthFilter === 'all' || m === monthFilter;
      const matchPlan = planFilter === 'all' || inc.planIncomeId === planFilter;
      const matchName = nameFilter.trim() === '' || inc.name.toLowerCase().includes(nameFilter.toLowerCase());
      return matchMonth && matchPlan && matchName;
    });
  }, [incomeList, monthFilter, planFilter, nameFilter]);

  const sortedIncomes = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest': return b.value - a.value;
        case 'lowest': return a.value - b.value;
        case 'recent':
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [filtered, sortOption]);

  const totalPages = Math.ceil(sortedIncomes.length / itemsPerPage);
  const paginated = sortedIncomes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, planFilter, sortOption, nameFilter]);

  return (
    <section className="income-view">
      <PlanIncomeView account={account} incomeList={incomeList} planIncomeList={planIncomeList} />

      <button className="toggle-form-button" onClick={() => setShowAddIncome(prev => !prev)}>
        {showAddIncome ? 'Cancel' : 'Add Income'}
      </button>

      {showAddIncome && (
        <form className="income-form" onSubmit={handleFormSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} placeholder="Value" required />
          <input type="date" value={formatDate(date)} onChange={(e) => setDate(new Date(e.target.value))} required />
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
          <button type="submit">Save</button>
        </form>
      )}

      <div className="filters">
        {months.length > 1 && (
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="all">All Months</option>
            {months.map(month => {
              const [year, m] = month.split("-");
              return <option key={month} value={month}>{m}/{year}</option>;
            })}
          </select>
        )}

        {planIncomeList.length > 0 && (
          <select value={planFilter} onChange={(e) => {
            const val = e.target.value;
            setPlanFilter(val === 'all' ? 'all' : parseInt(val));
          }}>
            <option value="all">All Plans</option>
            {planIncomeList.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Filter by name"
          className="filter-input"
        />
      </div>

      <div className="sort-buttons">
        <button onClick={() => setSortOption('recent')} disabled={sortOption === 'recent'}>Newest</button>
        <button onClick={() => setSortOption('oldest')} disabled={sortOption === 'oldest'}>Oldest</button>
        <button onClick={() => setSortOption('highest')} disabled={sortOption === 'highest'}>Highest</button>
        <button onClick={() => setSortOption('lowest')} disabled={sortOption === 'lowest'}>Lowest</button>
      </div>

      {paginated.length > 0 ? (
        <ul className="income-list">
          {paginated.map((inc) => (
            <li key={inc.id} className="operation-item income" onClick={() => openEditForm(inc)}>
              <strong>{inc.name}</strong>: +{inc.value} {account.moneyType} on {new Date(inc.date).toLocaleDateString()}
              {inc.planIncomeId && (() => {
                const plan = planIncomeList.find(p => p.id === inc.planIncomeId);
                return plan ? ` | Plan: ${plan.name}` : '';
              })()}
                {inc.desc && `| DESC: ${inc.desc}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No incomes found.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}

      {selectedIncome && (
        <div className="lightbox-overlay" onClick={() => setSelectedIncome(null)}>
          <div className="lightbox-form" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Income</h2>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" required />
            <input type="number" value={editValue} onChange={e => setEditValue(parseFloat(e.target.value))} placeholder="Value" required />
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />

            <button onClick={handleConfirmEdit} className="toggle-form-button" >Confirm Edit</button>
            <button onClick={handleDelete} className="toggle-form-button">Delete</button>
            <button onClick={() => setSelectedIncome(null) }className="toggle-form-button">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
