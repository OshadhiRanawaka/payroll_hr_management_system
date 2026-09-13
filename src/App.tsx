import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { RequireAccess } from './components/RequireAccess'
import { RoleProvider } from './lib/RoleContext'

import DashboardPage from './pages/DashboardPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import EmployeesPage from './pages/EmployeesPage'
import AttendancePage from './pages/AttendancePage'
import ShiftsPage from './pages/ShiftsPage'
import LeavePage from './pages/LeavePage'
import PayrollPage from './pages/PayrollPage'
import RecruitmentPage from './pages/RecruitmentPage'
import PerformancePage from './pages/PerformancePage'
import LoansPage from './pages/LoansPage'
import ExpensesPage from './pages/ExpensesPage'
import ReportsPage from './pages/ReportsPage'
import DevicesPage from './pages/DevicesPage'
import SettingsPage from './pages/SettingsPage'
import DataCheckPage from './pages/DataCheckPage'
import StyleGuidePage from './pages/StyleGuidePage'

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Main Application Shell Layout */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <RequireAccess section="dashboard">
                  <DashboardPage />
                </RequireAccess>
              }
            />
            <Route
              path="/employees"
              element={
                <RequireAccess section="employees">
                  <EmployeesPage />
                </RequireAccess>
              }
            />
            <Route
              path="/attendance"
              element={
                <RequireAccess section="attendance">
                  <AttendancePage />
                </RequireAccess>
              }
            />
            <Route
              path="/shifts"
              element={
                <RequireAccess section="shifts">
                  <ShiftsPage />
                </RequireAccess>
              }
            />
            <Route
              path="/leave"
              element={
                <RequireAccess section="leave">
                  <LeavePage />
                </RequireAccess>
              }
            />
            <Route
              path="/payroll"
              element={
                <RequireAccess section="payroll">
                  <PayrollPage />
                </RequireAccess>
              }
            />
            <Route
              path="/recruitment"
              element={
                <RequireAccess section="recruitment">
                  <RecruitmentPage />
                </RequireAccess>
              }
            />
            <Route
              path="/performance"
              element={
                <RequireAccess section="performance">
                  <PerformancePage />
                </RequireAccess>
              }
            />
            <Route
              path="/loans"
              element={
                <RequireAccess section="loans">
                  <LoansPage />
                </RequireAccess>
              }
            />
            <Route
              path="/expenses"
              element={
                <RequireAccess section="expenses">
                  <ExpensesPage />
                </RequireAccess>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAccess section="reports">
                  <ReportsPage />
                </RequireAccess>
              }
            />
            <Route
              path="/devices"
              element={
                <RequireAccess section="devices">
                  <DevicesPage />
                </RequireAccess>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAccess section="settings">
                  <SettingsPage />
                </RequireAccess>
              }
            />

            {/* Utility & Verification Routes */}
            <Route path="/data-check" element={<DataCheckPage />} />
            <Route path="/style-guide" element={<StyleGuidePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  )
}

export default App
