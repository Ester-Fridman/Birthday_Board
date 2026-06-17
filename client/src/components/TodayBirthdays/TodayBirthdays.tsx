import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTodayBirthdays } from './todayBirthdaysActions';
import { selectTodayBirthdays, selectTodayBirthdaysLoading } from './todayBirthdaysSelectors';

const getAge = (birthDateStr: string): number => {
  const today = new Date();
  const birth = new Date(birthDateStr);
  return today.getFullYear() - birth.getFullYear();
};

const TodayBirthdays = () => {
  const dispatch = useAppDispatch();
  const birthdays = useAppSelector(selectTodayBirthdays);
  const loading = useAppSelector(selectTodayBirthdaysLoading);

  useEffect(() => {
    dispatch(fetchTodayBirthdays());
  }, [dispatch]);

  if (loading) return null;

  return (
    <section className="today-section">
      <h2>
        🎂 Today's Birthdays
        <span className="today-date">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </h2>

      {birthdays.length === 0 ? (
        <p className="no-birthdays">No birthdays today</p>
      ) : (
        <div className="today-cards">
          {birthdays.map((birthday) => (
            <div key={birthday._id} className="today-card">
              <div className="today-card-emoji">🎉</div>
              <div className="today-card-name">{birthday.name}</div>
              <div className="today-card-age">חוגג/ת {getAge(birthday.birthDate)} שנים! מזל טוב!!</div>
              {birthday.note && <div className="today-card-note">{birthday.note}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TodayBirthdays;
