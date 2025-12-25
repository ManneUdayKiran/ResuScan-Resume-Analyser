import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Space, Typography } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  BuildOutlined,
  EditOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(15, 23, 42, 0.95)", "rgba(15, 23, 42, 0.98)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 2px 8px rgba(0,0,0,0.1)", "0 4px 20px rgba(0,0,0,0.2)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        navigate("/");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "/analyze",
      icon: <BarChartOutlined />,
      label: "Analyze Resume",
      onClick: () => {
        navigate("/analyze");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "/builder",
      icon: <BuildOutlined />,
      label: "Resume Builder",
      onClick: () => {
        navigate("/builder");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "/editor",
      icon: <EditOutlined />,
      label: "Real-Time Editor",
      onClick: () => {
        navigate("/editor");
        setMobileMenuVisible(false);
      },
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          background: headerBackground,
          boxShadow: headerShadow,
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <AntHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "0 24px",
            backgroundColor: "transparent",
            height: scrolled ? "60px" : "64px",
            transition: "height 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              whileHover={{ scale: 1.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <BarChartOutlined
                  style={{
                    fontSize: scrolled ? "22px" : "24px",
                    marginRight: "12px",
                    color: "#fff",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    transition: "font-size 0.3s ease",
                  }}
                />
              </motion.div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: scrolled ? "22px" : "24px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "font-size 0.3s ease",
                }}
              >
                ResuScan
              </Title>
            </motion.div>
            {/* Desktop Menu - now immediately after the title */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="desktop-menu"
              style={{ display: "none", marginLeft: 24, flex: 1, minWidth: 0 }}
            >
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  lineHeight: scrolled ? "60px" : "64px",
                  flex: 1,
                  minWidth: 0,
                  justifyContent: "flex-start",
                  transition: "line-height 0.3s ease",
                }}
              />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="text"
              icon={mobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
              style={{
                color: "#fff",
                fontSize: "18px",
                display: "none",
              }}
            />
          </motion.div>
        </AntHeader>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1976d2" }} />
            <span>ResuScan</span>
          </Space>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: "none" }}
        />
      </Drawer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: block !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
