import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createBirthday, updateBirthday } from './birthdayFormActions';
import { reset } from './birthdayFormSlice';
import { selectBirthdayFormLoading, selectBirthdayFormError, selectBirthdayFormSuccess } from './birthdayFormSelectors';
import type { Birthday } from '../../types';

interface Props {
  birthday: Birthday | null;
  onClose: () => void;
  onSaved: () => void;
}

const BirthdayForm = ({ birthday, onClose, onSaved }: Props) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectBirthdayFormLoading);
  const error = useAppSelector(selectBirthdayFormError);
  const success = useAppSelector(selectBirthdayFormSuccess);

  const [name, setName] = useState(birthday?.name ?? '');
  const [birthDate, setBirthDate] = useState(
    birthday ? birthday.birthDate.split('T')[0] : ''
  );
  const [note, setNote] = useState(birthday?.note ?? '');
  const [dateError, setDateError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (success) {
      dispatch(reset());
      onSaved();
    }
  }, [success, dispatch, onSaved]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (birthDate && new Date(birthDate) > new Date()) {
      const formatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      setDateError(`Birth date cannot be after ${formatted}`);
      return;
    }
    setDateError(null);
    const data = { name, birthDate, note: note || undefined };
    if (birthday) {
      dispatch(updateBirthday({ id: birthday._id, data }));
    } else {
      dispatch(createBirthday(data));
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{birthday ? 'Edit Birthday' : 'Add Birthday'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="birthday-form">
          {error && <div className="error-banner">{error.message}</div>}

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Birthday *</label>
            <input
              id="birthDate"
              type="date"
              className={`input${dateError ? ' input-error' : ''}`}
              value={birthDate}
              max={today}
              onChange={(e) => { setBirthDate(e.target.value); setDateError(null); }}
              required
            />
            {dateError && <span className="field-error">{dateError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="note">Note (optional)</label>
            <textarea
              id="note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : birthday ? 'Save Changes' : 'Add Birthday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthdayForm;
