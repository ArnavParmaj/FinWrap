import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions";
import BudgetsPage from "./pages/Budgets";
import GoalsPage from "./pages/Goals";
import RecurringPage from "./pages/Recurring";
import SplitsPage from "./pages/Splits";
import InsightsPage from "./pages/Insights";
import WrappedPage from "./pages/Wrapped";
import { useAuth } from "./hooks/useAuth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse bg-surface p-4 rounded-xl flex items-center space-x-4 border border-border">
          <div className="h-10 w-10 bg-border rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded w-[150px]"></div>
            <div className="h-3 bg-border rounded w-[100px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/splits" element={<SplitsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/wrapped" element={<WrappedPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
