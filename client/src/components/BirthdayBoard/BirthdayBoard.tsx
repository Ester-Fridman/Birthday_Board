import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBirthdays, deleteBirthday } from './birthdayBoardActions';
import { setSearch, setPage } from './birthdayBoardSlice';
import { selectBirthdays, selectBirthdaysPagination, selectBirthdaysSearch, selectBirthdaysLoading, selectBirthdaysError, selectBirthdaysDeletingId } from './birthdaySelectors';
import TodayBirthdays from '../TodayBirthdays/TodayBirthdays';
import BirthdayForm from '../BirthdayForm/BirthdayForm';
import Pagination from '../common/Pagination';
import { logout } from '../Login/loginActions';
import { fetchTodayBirthdays } from '../TodayBirthdays/todayBirthdaysActions';
import type { Birthday } from '../../types';

const BirthdayBoard = () => {
  const dispatch = useAppDispatch();
  const birthdays = useAppSelector(selectBirthdays);
  const pagination = useAppSelector(selectBirthdaysPagination);
  const search = useAppSelector(selectBirthdaysSearch);
  const loading = useAppSelector(selectBirthdaysLoading);
  const error = useAppSelector(selectBirthdaysError);
  const deletingId = useAppSelector(selectBirthdaysDeletingId);
  const user = useAppSelector((state) => state.auth.user);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => dispatch(fetchBirthdays()), search ? 500 : 0);
    return () => clearTimeout(timer);
  }, [dispatch, pagination.page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setConfirmDelete(null);
    try {
      await dispatch(deleteBirthday(confirmDelete.id)).unwrap();
      if (birthdays.length === 1 && pagination.page > 1) {
        dispatch(setPage(pagination.page - 1));
      } else {
        dispatch(fetchBirthdays());
      }
    } catch {
      // error already stored in state by the slice
    }
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBirthday(null);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setEditingBirthday(null);
    dispatch(fetchBirthdays());
    dispatch(fetchTodayBirthdays());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };


  return (
    <div className="board-container">
      <header className="board-header">
        <button className="logout-btn" onClick={() => dispatch(logout())}>Logout</button>
        <div className="header-center">
          <span className="header-icon">🎂</span>
          <h1>Birthday Board</h1>
          <p className="header-greeting">Welcome back, <strong>{user?.name}</strong>! 👋</p>
        </div>
      </header>

      <main className="board-main">
        <TodayBirthdays />

        <section className="birthday-list-section">
          <div className="section-header">
            <h2>All Birthdays</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Birthday
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
              className="input"
            />
          </div>

          {error && <div className="error-banner">{error.message}</div>}

          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
              <span>Loading birthdays...</span>
            </div>
          ) : birthdays.length === 0 ? (
            <div className="empty-state">
              <p>No birthdays found. Add your first one! 🎉</p>
            </div>
          ) : (
            <div className="birthday-table-wrapper">
              <table className="birthday-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Birthday</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {birthdays.map((birthday) => (
                    <tr
                      key={birthday._id}
                      className={birthday.isToday ? 'row-today' : ''}
                    >
                      <td>
                        <span className="birthday-name">
                          {birthday.isToday && '🎉 '}
                          {birthday.name}
                        </span>
                      </td>
                      <td>{formatDate(birthday.birthDate)}</td>
                      <td className="note-cell">{birthday.note || '—'}</td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(birthday)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(birthday._id, birthday.name)}
                          disabled={deletingId === birthday._id}
                        >
                          {deletingId === birthday._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>

      {showForm && (
        <BirthdayForm birthday={editingBirthday} onClose={handleFormClose} onSaved={handleFormSaved} />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Birthday</h2>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="confirm-body">
              <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>'s birthday?</p>
              <p className="confirm-sub">This action cannot be undone.</p>
            </div>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayBoard;
