import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeBuilder from "./pages/ResumeBuilder";
import RealTimeEditor from "./pages/RealTimeEditor";

import "./App.css";

const theme = {
  token: {
    colorPrimary: "#06b6d4",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#06b6d4",
    borderRadius: 12,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      headerBg: "#0f172a",
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 16,
      boxShadowTertiary: "0 4px 16px rgba(15, 23, 42, 0.08)",
    },
    Input: {
      borderRadius: 8,
    },
  },
};

// Animated Routes Component
function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/analyze"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ResumeAnalyzer />
            </motion.div>
          }
        />
        <Route
          path="/builder"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ResumeBuilder />
            </motion.div>
          }
        />
        <Route
          path="/editor"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RealTimeEditor />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
          <div
            style={{
              minHeight: "100vh",
              background: "linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Header />
            <motion.div
              style={{
                paddingTop: "64px",
                minHeight: "100vh",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedRoutes />
            </motion.div>
          </div>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
