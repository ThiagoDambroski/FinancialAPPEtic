import React, { useState, useMemo, useEffect } from 'react';
import { usePagament } from '../context/pagamentContext';
import PlanPagamentView from './PlanPagamentView';

type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest';

type Account = {
  id: number;
  name: string;
  moneyType?: string;
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

type PagamentViewProps = {
  account: Account;
};

export default function PagamentView({ account }: PagamentViewProps) {
  const {
    getPagamentsByAccountId,
    getPagamentPlanByAccountId,
    createNewPagament,
    editPagament,
    deletePagament,
  } = usePagament();

  const [pagamentList, setPagamentList] = useState<Pagament[]>([]);
  const [planPagamentList, setPlanPagamentList] = useState([]);
  const [showAddPagament, setShowAddPagament] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [monthFilter, setMonthFilter] = useState<'all' | string>('all');
  const [planFilter, setPlanFilter] = useState<'all' | number>('all');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPagament, setSelectedPagament] = useState<Pagament | null>(null);

  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState(0);
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const itemsPerPage = 5;

  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [desc, setDesc] = useState('');

  useEffect(() => {
    async function loadPagaments() {
      const data = await getPagamentsByAccountId(account.id);
      const dataPlanPagament = await getPagamentPlanByAccountId(account.id);
      setPagamentList(data);
      setPlanPagamentList(dataPlanPagament);
    }
    loadPagaments();
  }, [account.id, getPagamentsByAccountId]);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewPagament(account.id, { name, value, date, desc });
    setName('');
    setValue(0);
    setDate(new Date());
    setDesc('');
  };

  const truncateDesc = (desc: string | undefined, length = 50) => {
    if (!desc) return '';
    return desc.length > length ? desc.slice(0, length) + '...' : desc;
  };

  const months = useMemo(() => {
    const set = new Set<string>();
    pagamentList.forEach(pag => {
      const d = new Date(pag.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      set.add(m);
    });
    return Array.from(set).sort().reverse();
  }, [pagamentList]);

  const filtered = useMemo(() => {
    return pagamentList.filter(pag => {
      const d = new Date(pag.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const matchesMonth = monthFilter === 'all' || m === monthFilter;
      const matchesPlan = planFilter === 'all' || pag.planPagamentId === planFilter;
      const matchesName = nameFilter.trim() === '' || pag.name.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesMonth && matchesPlan && matchesName;
    });
  }, [pagamentList, monthFilter, planFilter, nameFilter]);

  const sortedPagaments = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.value - a.value;
        case 'lowest':
          return a.value - b.value;
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [filtered, sortOption]);

  const totalPages = Math.ceil(sortedPagaments.length / itemsPerPage);
  const paginated = sortedPagaments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [monthFilter, planFilter, sortOption, nameFilter]);

  const openEditForm = (pag: Pagament) => {
    setEditName(pag.name);
    setEditValue(pag.value);
    setEditDate(formatDate(new Date(pag.date)));
    setEditDesc(pag.desc || '');
    setSelectedPagament(pag);
  };

  const handleConfirmEdit = async () => {
    if (!selectedPagament) return;
    const confirmed = confirm("Are you sure you want to save changes?");
    if (!confirmed) return;

    await editPagament(selectedPagament.id, {
      name: editName,
      value: editValue,
      date: new Date(editDate),
      desc: editDesc,
      planPagamentId: selectedPagament.planPagamentId,
    });
    const data = await getPagamentsByAccountId(account.id);
    setPagamentList(data);
    setSelectedPagament(null);
  };

  const handleDelete = async () => {
    if (!selectedPagament) return;
    const confirmed = confirm("Are you sure you want to delete this pagament?");
    if (!confirmed) return;

    await deletePagament(selectedPagament.id);
    const data = await getPagamentsByAccountId(account.id);
    setPagamentList(data);
    setSelectedPagament(null);
  };

  return (
    <section className="pagament-view">
      <PlanPagamentView account={account} planPagamentList={planPagamentList} pagamentList={pagamentList} />

      <button className="toggle-form-button" onClick={() => setShowAddPagament(prev => !prev)}>
        {showAddPagament ? 'Cancel' : 'Add Pagament'}
      </button>

      {showAddPagament && (
        <form className="pagament-form" onSubmit={handleFormSubmit}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value))} placeholder="Value" required />
          <input type="date" value={formatDate(date)} onChange={e => setDate(new Date(e.target.value))} required />
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
          <button type="submit">Save</button>
        </form>
      )}

      {months.length > 1 && (
        <select className="filter-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="all">All Months</option>
          {months.map(month => {
            const [year, m] = month.split("-");
            return <option key={month} value={month}>{m}/{year}</option>;
          })}
        </select>
      )}

      {planPagamentList?.length > 0 && (
        <select className="filter-select" value={planFilter} onChange={(e) => {
          const val = e.target.value;
          setPlanFilter(val === 'all' ? 'all' : parseInt(val));
        }}>
          <option value="all">All Plans</option>
          {planPagamentList.map(plan => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
      )}

      <input
        className="filter-input"
        type="text"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        placeholder="Filter by name"
      />

      <div className="sort-buttons">
        <button onClick={() => setSortOption('recent')}>Newest</button>
        <button onClick={() => setSortOption('oldest')}>Oldest</button>
        <button onClick={() => setSortOption('highest')}>Highest</button>
        <button onClick={() => setSortOption('lowest')}>Lowest</button>
      </div>

      <ul className="pagament-list">
        {paginated.length > 0 ? (
          paginated.map((pag) => (
            <li key={pag.id} className="operation-item pagament" onClick={() => openEditForm(pag)}>
              <strong>{pag.name}</strong>: -{pag.value} {account.moneyType}
                {pag.planPagamentId && (
                  <> | Plan: {planPagamentList.find(p => p.id === pag.planPagamentId)?.name || 'N/A'}</>
                )} on {new Date(pag.date).toLocaleDateString()}

              <p>{truncateDesc(pag.desc)}</p>
            </li>
          ))
        ) : (
          <p>No payments found</p>
        )}
      </ul>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      )}

      {selectedPagament && (
        <div className="lightbox-overlay" onClick={() => setSelectedPagament(null)}>
          <div className="lightbox-form" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Pagament</h2>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" required />
            <input type="number" value={editValue} onChange={e => setEditValue(parseFloat(e.target.value))} placeholder="Value" required />
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
            <textarea  value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />

            <button onClick={handleConfirmEdit} className="toggle-form-button">Confirm Edit</button>
            <button onClick={handleDelete} className="toggle-form-button">Delete</button>
            <button onClick={() => setSelectedPagament(null)} className="toggle-form-button">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
