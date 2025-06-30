import React, { useState, useMemo, useEffect } from 'react';
import { useIncome } from '../context/incomeContext';

type PlanIncome = {
  id: number;
  name: string;
  value: number;
  date?: string;
  desc?: string;
  recurrent: boolean;
  automatic: boolean;
};

type PlanIncomeViewProps = {
  account: { id: number; name: string; moneyType?: string };
  planIncomeList: PlanIncome[];
  incomeList: any[];
};

type SortOption = 'most' | 'least' | 'expensive' | 'cheap';

export default function PlanIncomeView({ account, planIncomeList, incomeList }: PlanIncomeViewProps) {
  const {
    createNewPlanIncome,
    createIncomeFromPlan,
    editPlanIncome,
    deletePlanIncome,
  } = useIncome();

  const [showAddPlan, setShowAddPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanIncome | null>(null);

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
    createNewPlanIncome(account.id, {
      name, value, date: date ? new Date(date) : undefined, desc, recurrent, automatic
    });
    resetForm();
  };

  const openEditForm = (plan: PlanIncome) => {
    setSelectedPlan(plan);
    setName(plan.name);
    setValue(plan.value);
    setDate(plan.date ? plan.date.split('T')[0] : '');
    setDesc(plan.desc || '');
    setRecurrent(plan.recurrent);
    setAutomatic(plan.automatic);
  };

  const handleConfirmEdit = async () => {
    if (!selectedPlan) return;
    const confirmed = confirm("Are you sure you want to update this plan?");
    if (!confirmed) return;

    await editPlanIncome(selectedPlan.id, {
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

    await deletePlanIncome(selectedPlan.id);
    setSelectedPlan(null);
    resetForm();
  };

  const getIncomeCount = (planId: number) =>
    incomeList.filter((i) => i.planIncomeId === planId).length;

  const getDaysLeft = (date?: string) => {
    if (!date) return '-';
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredPlans = useMemo(() => {
    let result = planIncomeList.filter(p =>
      p.name.toLowerCase().includes(nameFilter.toLowerCase())
    );

    switch (sortOption) {
      case 'most':
        return result.sort((a, b) => getIncomeCount(b.id) - getIncomeCount(a.id));
      case 'least':
        return result.sort((a, b) => getIncomeCount(a.id) - getIncomeCount(b.id));
      case 'expensive':
        return result.sort((a, b) => b.value - a.value);
      case 'cheap':
        return result.sort((a, b) => a.value - b.value);
      default:
        return result;
    }
  }, [planIncomeList, nameFilter, sortOption, incomeList]);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [nameFilter, sortOption]);

  return (
    <section className="plan-income-view">
      <button className="toggle-form-button" onClick={() => setShowAddPlan(prev => !prev)}>
        {showAddPlan ? 'Cancel' : 'Create PlanIncome'}
      </button>

      {showAddPlan && (
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value))} placeholder="Value" required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
          <label><input type="checkbox" checked={recurrent} onChange={(e) => setRecurrent(e.target.checked)} /> Recurrent</label>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="filters">
        <input type="text" placeholder="Filter by name..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)}>
          <option value="most">Most Incomes</option>
          <option value="least">Least Incomes</option>
          <option value="expensive">Most Expensive</option>
          <option value="cheap">Cheapest</option>
        </select>
      </div>

      <div className="plan-list">
        {paginatedPlans.map(plan => (
          <div key={plan.id} className="plan-item">
            <p>
              <strong>{plan.name}</strong> - {plan.value} {account.moneyType} - Due: {plan.date ? new Date(plan.date).toLocaleDateString() : 'N/A'} - Days left: {getDaysLeft(plan.date)}<br />
              Recurrent: {plan.recurrent ? "Yes" : "No"} | Automatic: {plan.automatic ? "Yes" : "No"} | Incomes: {getIncomeCount(plan.id)}
            </p>
            <button onClick={() => createIncomeFromPlan(plan.id)}>Register Income</button>
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
            <h2>Edit PlanIncome</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value))} placeholder="Value" required />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
            <label><input type="checkbox" checked={recurrent} onChange={e => setRecurrent(e.target.checked)} /> Recurrent</label>
        
            <button onClick={handleConfirmEdit} className="toggle-form-button">Confirm Edit</button>
            <button onClick={handleDelete} className="toggle-form-button">Delete</button>
            <button onClick={() => setSelectedPlan(null)} className="toggle-form-button">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
