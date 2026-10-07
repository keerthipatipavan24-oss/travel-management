import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Destinations from "./pages/Destinations";
import Trips from "./pages/Trips";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      {/* sidebar */}
      <Sidebar />

      {/* common Header */}
      <Header />

      {/* pages */}
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/destinations" element={<Destinations />} />

        <Route path="/trips" element={<Trips />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/bookings" element={<Bookings />} />

        <Route path="/payments" element={<Payments />} />

        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}
