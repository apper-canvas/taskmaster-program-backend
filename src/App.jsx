import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Tasks from "@/components/pages/Tasks";
import Projects from "@/components/pages/Projects";
import Calendar from "@/components/pages/Calendar";
import Analytics from "@/components/pages/Analytics";
import Settings from "@/components/pages/Settings";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </Router>
  );
}