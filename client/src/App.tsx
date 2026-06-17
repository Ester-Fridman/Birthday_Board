import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store';
import { fetchCurrentUser } from './components/Login/loginActions';
import Login from './components/Login/Login';
import BirthdayBoard from './components/BirthdayBoard/BirthdayBoard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  const dispatch = useAppDispatch();
  const { token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  if (loading && !!token) {
    return (
      <div className="spinner-wrapper fullscreen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/birthday" replace /> : <Login />}
        />
        <Route
          path="/birthday"
          element={
            <ProtectedRoute>
              <BirthdayBoard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/birthday" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
