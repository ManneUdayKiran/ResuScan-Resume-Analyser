import React, { useState } from "react";
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
import { motion } from "framer-motion";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

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
      <AntHeader
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 24px",
          backgroundColor: "#1976d2",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >

        <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <BarChartOutlined
              style={{ fontSize: "24px", marginRight: "12px", color: "#fff" }}
            />
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              ResuScan
            </Title>
          </motion.div>
          {/* Desktop Menu - now immediately after the title */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
                lineHeight: "64px",
                flex: 1,
                minWidth: 0,
                justifyContent: "flex-start"
              }}
            />
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
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
      </AntHeader>

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
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: "none" }}
        />
      </Drawer>

      <style jsx>{`
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
