import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </Router>
  );
}
