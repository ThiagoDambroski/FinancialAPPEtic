import React, { useEffect, useState, useMemo } from 'react';
import { useAccount } from '../context/accountContext';

type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest';
type OperationType = 'income' | 'pagament';

type MonthViewProps = {
  account: {
    id: number;
    name: string;
    moneyType?: string;
  };
};

export default function MonthView({ account }: MonthViewProps) {
  const { getOperationsByAccountId, reload } = useAccount();

  const [operationsList, setOperationsList] = useState<any | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [monthFilter, setMonthFilter] = useState<'all' | string>('all');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

   const truncateDesc = (desc: string | undefined, length = 50) => {
    if (!desc) return '';
    return desc.length > length ? desc.slice(0, length) + '...' : desc;
  };

  useEffect(() => {
    async function loadOperations() {
      const ops = await getOperationsByAccountId(account.id);
      setOperationsList(ops);
    }
    loadOperations();
  }, [getOperationsByAccountId, reload, account]);

  const combinedOperations = useMemo(() => {
    if (!operationsList) return [];
    return [
      ...operationsList.pagaments.map((p) => ({ ...p, type: 'pagament' as OperationType })),
      ...operationsList.incomes.map((i) => ({ ...i, type: 'income' as OperationType })),
    ];
  }, [operationsList]);

  const months = useMemo(() => {
    const monthSet = new Set<string>();
    combinedOperations.forEach((op) => {
      const date = new Date(op.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthSet.add(key);
    });
    return Array.from(monthSet).sort().reverse();
  }, [combinedOperations]);

  const filteredOperations = useMemo(() => {
    return combinedOperations.filter((op) => {
      const date = new Date(op.date);
      const opMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const matchesMonth = monthFilter === 'all' || opMonth === monthFilter;
      const matchesName = nameFilter.trim() === '' || op.name.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesMonth && matchesName;
    });
  }, [combinedOperations, monthFilter, nameFilter]);

  const sortedOperations = useMemo(() => {
    return [...filteredOperations].sort((a, b) => {
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
  }, [filteredOperations, sortOption]);

  const totalPages = Math.ceil(sortedOperations.length / itemsPerPage);

  const paginatedOperations = sortedOperations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, sortOption, nameFilter]);

  if (!operationsList) return <p>Loading...</p>;

  return (
    <section className="month-view">
      {/* Month Selector */}
      {months.length > 1 && (
        <select
          value={monthFilter}
          onChange={(e) => {
            setMonthFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="month-filter"
        >
          <option value="all">All Months</option>
          {months.map((monthKey) => {
            const [year, month] = monthKey.split('-');
            return (
              <option key={monthKey} value={monthKey}>
                {month}/{year}
              </option>
            );
          })}
        </select>
      )}

      {/* Name Filter */}
      <input
        className="filter-input"
        type="text"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        placeholder="Filter by name"
      />

      {/* Sort Buttons */}
      <div className="sort-buttons">
        <button onClick={() => setSortOption('recent')} disabled={sortOption === 'recent'}>
          Newest
        </button>
        <button onClick={() => setSortOption('oldest')} disabled={sortOption === 'oldest'}>
          Oldest
        </button>
        <button onClick={() => setSortOption('highest')} disabled={sortOption === 'highest'}>
          Highest
        </button>
        <button onClick={() => setSortOption('lowest')} disabled={sortOption === 'lowest'}>
          Lowest
        </button>
      </div>

      {/* Operation List */}
      {paginatedOperations.length > 0 ? (
        paginatedOperations.map((op) => (
          <div key={`${op.type}-${op.id}`} className={`operation-item ${op.type}`}>
            <strong>{op.name}</strong>: {op.type === 'income' ? '+' : '-'}
            {op.value} {account.moneyType} on {new Date(op.date).toLocaleDateString()}
            {op.desc && ` | ${truncateDesc(op.desc)}`}
          </div>
        ))
      ) : (
        <p>No operations found for this filter.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
