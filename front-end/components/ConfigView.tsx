import React, { useState } from 'react';
import { useAccount } from '../context/accountContext';
import { useRouter } from 'next/router';

type ConfigViewProps = {
  account: {
    id: number;
    name: string;
    moneyType?: string;
  };
};

const ConfigView: React.FC<ConfigViewProps> = ({ account }) => {
  const { updateAccount, deleteAccount } = useAccount();

  const [name, setName] = useState(account.name);
  const [moneyType, setMoneyType] = useState(account.moneyType || '');
  const [confirmAction, setConfirmAction] = useState<'update' | 'delete' | null>(null);
  const router = useRouter();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmAction('update');
  };

  const handleDelete = () => {
    setConfirmAction('delete');
  };

  const executeConfirmedAction = async () => {
    if (confirmAction === 'update') {
      await updateAccount(account.id, { name, moneyType });
    } else if (confirmAction === 'delete') {
      router.back()
      await deleteAccount(account.id);
      
    }
    setConfirmAction(null);
  };

  return (
    <section className="config-view">
      <h2>Edit Account</h2>
      <form className="config-form" onSubmit={handleUpdate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={moneyType}
          onChange={(e) => setMoneyType(e.target.value)}
          placeholder="Currency Type"
        />
        <button type="submit" className="toggle-form-button">Save Changes</button>
      </form>
      <button onClick={handleDelete} className="toggle-form-button delete">Delete Account</button>

      {confirmAction && (
        <div className="lightbox-overlay" onClick={() => setConfirmAction(null)}>
          <div className="lightbox-form" onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure?</h2>
            <p>
              {confirmAction === 'update'
                ? 'Do you want to save changes to this account?'
                : 'This account and its data will be permanently deleted.'}
            </p>
            <div className="lightbox-buttons">
              <button
                type="button"
                className="toggle-form-button"
                onClick={executeConfirmedAction}
              >
                Confirm
              </button>
              <button
                type="button"
                className="toggle-form-button delete"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConfigView;
