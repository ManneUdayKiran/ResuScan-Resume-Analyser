import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeBuilder from "./pages/ResumeBuilder";
import RealTimeEditor from "./pages/RealTimeEditor";

import "./App.css";

const theme = {
  token: {
    colorPrimary: "#1976d2",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: "#f5f5f5",
      headerBg: "#1976d2",
    },
    Button: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
          <Header />
          <motion.div
            style={{ paddingTop: "64px" }} // Account for fixed header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyze" element={<ResumeAnalyzer />} />
              <Route path="/builder" element={<ResumeBuilder />} />
              <Route path="/editor" element={<RealTimeEditor />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
