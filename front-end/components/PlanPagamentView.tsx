import React, { useState, useMemo, useEffect } from 'react';
import { usePagament } from '../context/pagamentContext';

type PlanPagament = {
  id: number;
  name: string;
  value: number;
  date?: string;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

type PlanPagamentViewProps = {
  account: { id: number; name: string; moneyType?: string };
  planPagamentList: PlanPagament[];
  pagamentList: any[];
};

type SortOption = 'most' | 'least' | 'expensive' | 'cheap';

export default function PlanPagamentView({ account, planPagamentList, pagamentList }: PlanPagamentViewProps) {
  const {
    createNewPlanPagament,
    createPagamentFromPlan,
    editPlanPagament,
    deletePlanPagament,
  } = usePagament();

  const [showAddPlan, setShowAddPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanPagament | null>(null);

  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [recurrent, setRecurrent] = useState(false);
  const [automatic, setAutomatic] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('most');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const resetForm = () => {
    setName('');
    setValue(0);
    setDate('');
    setDesc('');
    setRecurrent(false);
    setAutomatic(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewPlanPagament(account.id, {
      name, value, date: date ? new Date(date) : undefined, desc, recurrent, automatic
    });
    resetForm();
  };

  const openEditForm = (plan: PlanPagament) => {
    setSelectedPlan(plan);
    setName(plan.name);
    setValue(plan.value);
    setDate(plan.date ? formatDate(new Date(plan.date)) : '');
    setDesc(plan.desc || '');
    setRecurrent(plan.recurrent);
    setAutomatic(plan.automatic);
  };

  const handleConfirmEdit = async () => {
    if (!selectedPlan) return;
    const confirmed = confirm("Are you sure you want to update this plan?");
    if (!confirmed) return;

    await editPlanPagament(selectedPlan.id, {
      name,
      value,
      date: date ? new Date(date) : undefined,
      desc,
      recurrent,
      automatic,
    });
    setSelectedPlan(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;
    const confirmed = confirm("Are you sure you want to delete this plan?");
    if (!confirmed) return;

    await deletePlanPagament(selectedPlan.id);
    setSelectedPlan(null);
    resetForm();
  };

  const getPagamentCount = (planId: number) => {
    return pagamentList.filter(p => p.planPagamentId === planId).length;
  };

  const getDaysLeft = (date?: string) => {
    if (!date) return '-';
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredPlans = useMemo(() => {
    let result = planPagamentList.filter(p =>
      p.name.toLowerCase().includes(nameFilter.toLowerCase())
    );

    switch (sortOption) {
      case 'most':
        return result.sort((a, b) => getPagamentCount(b.id) - getPagamentCount(a.id));
      case 'least':
        return result.sort((a, b) => getPagamentCount(a.id) - getPagamentCount(b.id));
      case 'expensive':
        return result.sort((a, b) => b.value - a.value);
      case 'cheap':
        return result.sort((a, b) => a.value - b.value);
      default:
        return result;
    }
  }, [planPagamentList, nameFilter, sortOption, pagamentList]);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [nameFilter, sortOption]);

  return (
    <section className="plan-pagament-view">
      <button className="toggle-form-button" onClick={() => setShowAddPlan(prev => !prev)}>
        {showAddPlan ? 'Cancel' : 'Create PlanPagament'}
      </button>

      {showAddPlan && (
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value))} placeholder="Value" required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
          <label>
            <input type="checkbox" checked={recurrent} onChange={e => setRecurrent(e.target.checked)} /> Recurrent
          </label>
          
          <button type="submit">Save</button>
        </form>
      )}

      <div className="filters">
        <input type="text" placeholder="Filter by name..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)}>
          <option value="most">Most Pagaments</option>
          <option value="least">Least Pagaments</option>
          <option value="expensive">Most Expensive</option>
          <option value="cheap">Cheapest</option>
        </select>
      </div>

      <div className="plan-list">
        {paginatedPlans.map(plan => (
          <div key={plan.id} className="plan-item">
            <p>
              <strong>{plan.name}</strong> - {plan.value} {account.moneyType} - Due: {plan.date ? new Date(plan.date).toLocaleDateString() : 'N/A'} - Days left: {getDaysLeft(plan.date)}<br />
              Recurrent: {plan.recurrent ? "Yes" : "No"} | Automatic: {plan.automatic ? "Yes" : "No"} | Pagaments: {getPagamentCount(plan.id)}
            </p>
            <button onClick={() => createPagamentFromPlan(plan.id)}>Register Pagament</button>
            <button onClick={() => openEditForm(plan)}>Edit</button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      )}

      {selectedPlan && (
        <div className="lightbox-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="lightbox-form" onClick={e => e.stopPropagation()}>
            <h2>Edit PlanPagament</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value))} placeholder="Value" required />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
            <label>
              <input type="checkbox" checked={recurrent} onChange={e => setRecurrent(e.target.checked)} /> Recurrent
            </label>
           
            <button onClick={handleConfirmEdit} className="toggle-form-button">Confirm Edit</button>
            <button onClick={handleDelete} className="toggle-form-button">Delete</button>
            <button onClick={() => setSelectedPlan(null)} className="toggle-form-button">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
