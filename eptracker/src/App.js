import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import DashboardPage from "./pages/DashboardPage";
import Services from "./pages/Services";
import Features from "./pages/Features";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import RecordExpense from "./pages/RecordExpense";
import SetBudgetGoal from "./pages/SetBudgetGoal";
import SplitTransaction from "./pages/SplitTransaction";
import FinancialReport from "./pages/FinancialReport";
import Notifications from "./pages/Notifications";
import CategorizeIncome from "./pages/CategorizeIncome";
import { GoogleOAuthProvider } from "@react-oauth/google";
import './App.css';

import { TransactionProvider } from "./context/TransactionContext";
import { CurrencyProvider } from "./context/CurrencyContext";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "GOOGLE_ID_PLACEHOLDER";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TransactionProvider>
      <CurrencyProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/record-expense" element={<RecordExpense />} />
              <Route path="/set-budget" element={<SetBudgetGoal />} />
              <Route path="/split-transaction" element={<SplitTransaction />} />
              <Route path="/financial-report" element={<FinancialReport />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/categorize-income" element={<CategorizeIncome />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CurrencyProvider>
    </TransactionProvider>
    </GoogleOAuthProvider>
  );
}

export default App;