import React, { Suspense, lazy } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Space,
  Divider,
  Layout,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  BarChartOutlined,
  RiseOutlined,
  BulbOutlined,
  BookOutlined,
  BuildOutlined,
  DownloadOutlined,
  EditOutlined,
  UploadOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AnimatedCard,
  ParallaxSection,
  StaggerContainer,
  StaggerItem,
  FadeInUp,
  FloatingElement,
  ScaleIn,
} from "../components/AnimatedComponents";

// Lazy load Spline for better performance
const Spline = lazy(() => import("@splinetool/react-spline"));

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <BarChartOutlined style={{ fontSize: 48, color: "#06b6d4" }} />,
      title: "ATS Compatibility",
      description:
        "Check your resume against Applicant Tracking Systems to ensure it gets past the initial screening.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <RiseOutlined style={{ fontSize: 48, color: "#10b981" }} />,
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills for your target job role and understand what you need to learn.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <BulbOutlined style={{ fontSize: 48, color: "#f59e0b" }} />,
      title: "Bullet Point Improvements",
      description:
        "Get AI-powered suggestions to make your bullet points more impactful and ATS-friendly.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <BookOutlined style={{ fontSize: 48, color: "#8b5cf6" }} />,
      title: "Learning Recommendations",
      description:
        "Receive personalized project and course recommendations to fill your skill gaps.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <BuildOutlined style={{ fontSize: 48, color: "#ec4899" }} />,
      title: "Resume Builder",
      description:
        "Create ATS-friendly resumes with professional templates and save multiple versions for different roles.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <DownloadOutlined style={{ fontSize: 48, color: "#06b6d4" }} />,
      title: "1-Click PDF Export",
      description:
        "Generate professional PDF resumes instantly with our optimized templates for maximum ATS compatibility.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    {
      icon: <EditOutlined style={{ fontSize: 48, color: "#14b8a6" }} />,
      title: "Real-Time Editor",
      description:
        "WYSIWYG editor with instant feedback, live preview, and real-time ATS compatibility scoring as you type.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Content style={{ padding: "0", minHeight: "100vh", overflow: "hidden" }}>
      {/* Hero Section with 3D Spline Scene */}
      <ParallaxSection
        gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating Background Elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <FloatingElement duration={5} yOffset={30}>
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "10%",
                width: "100px",
                height: "100px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            />
          </FloatingElement>

          <FloatingElement duration={7} yOffset={40}>
            <div
              style={{
                position: "absolute",
                top: "60%",
                right: "15%",
                width: "150px",
                height: "150px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                filter: "blur(50px)",
              }}
            />
          </FloatingElement>

          <FloatingElement duration={6} yOffset={25}>
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "20%",
                width: "120px",
                height: "120px",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "50%",
                filter: "blur(45px)",
              }}
            />
          </FloatingElement>
        </div>

        {/* Main Hero Content */}
        <motion.div
          style={{
            opacity,
            scale,
            maxWidth: "1200px",
            width: "100%",
            padding: "80px 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <StaggerContainer>
            <StaggerItem>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <Title
                  level={1}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                    marginBottom: "16px",
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ResuScan
                </Title>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Title
                  level={2}
                  style={{
                    color: "white",
                    opacity: 0.95,
                    fontWeight: 500,
                    marginBottom: "24px",
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  Resume Analyzer + ATS Matcher
                </Title>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <Paragraph
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.3rem)",
                  opacity: 0.9,
                  marginBottom: "48px",
                  color: "white",
                  maxWidth: "700px",
                  margin: "0 auto 48px",
                  lineHeight: 1.8,
                  textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                Upload your resume and instantly scan it for ATS compatibility,
                skill gaps, and get personalized improvement suggestions powered
                by AI.
              </Paragraph>
            </StaggerItem>

            <StaggerItem>
              <Space
                size="large"
                style={{ flexWrap: "wrap", justifyContent: "center" }}
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate("/analyze")}
                    style={{
                      height: "56px",
                      padding: "0 40px",
                      fontSize: "1.1rem",
                      backgroundColor: "white",
                      borderColor: "white",
                      color: "#667eea",
                      fontWeight: "bold",
                      borderRadius: "28px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Start Analyzing
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="large"
                    icon={<BuildOutlined />}
                    onClick={() => navigate("/builder")}
                    style={{
                      height: "56px",
                      padding: "0 40px",
                      fontSize: "1.1rem",
                      backgroundColor: "transparent",
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "28px",
                      borderWidth: "2px",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                  >
                    Build Resume
                  </Button>
                </motion.div>
              </Space>
            </StaggerItem>

            {/* Stats Section */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ marginTop: "80px" }}
              >
                <Row gutter={[48, 24]} justify="center">
                  <Col xs={12} md={6}>
                    <ScaleIn delay={1}>
                      <div style={{ textAlign: "center" }}>
                        <Title
                          level={2}
                          style={{
                            color: "white",
                            margin: 0,
                            fontSize: "3rem",
                            fontWeight: "bold",
                          }}
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                          >
                            98%
                          </motion.span>
                        </Title>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1rem",
                          }}
                        >
                          ATS Pass Rate
                        </Text>
                      </div>
                    </ScaleIn>
                  </Col>
                  <Col xs={12} md={6}>
                    <ScaleIn delay={1.1}>
                      <div style={{ textAlign: "center" }}>
                        <Title
                          level={2}
                          style={{
                            color: "white",
                            margin: 0,
                            fontSize: "3rem",
                            fontWeight: "bold",
                          }}
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.3 }}
                          >
                            10K+
                          </motion.span>
                        </Title>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1rem",
                          }}
                        >
                          Resumes Analyzed
                        </Text>
                      </div>
                    </ScaleIn>
                  </Col>
                  <Col xs={12} md={6}>
                    <ScaleIn delay={1.2}>
                      <div style={{ textAlign: "center" }}>
                        <Title
                          level={2}
                          style={{
                            color: "white",
                            margin: 0,
                            fontSize: "3rem",
                            fontWeight: "bold",
                          }}
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.4 }}
                          >
                            &lt;2s
                          </motion.span>
                        </Title>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1rem",
                          }}
                        >
                          Analysis Time
                        </Text>
                      </div>
                    </ScaleIn>
                  </Col>
                  <Col xs={12} md={6}>
                    <ScaleIn delay={1.3}>
                      <div style={{ textAlign: "center" }}>
                        <Title
                          level={2}
                          style={{
                            color: "white",
                            margin: 0,
                            fontSize: "3rem",
                            fontWeight: "bold",
                          }}
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5 }}
                          >
                            95%
                          </motion.span>
                        </Title>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1rem",
                          }}
                        >
                          User Satisfaction
                        </Text>
                      </div>
                    </ScaleIn>
                  </Col>
                </Row>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </motion.div>
      </ParallaxSection>

      <div
        style={{
          padding: "100px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)",
        }}
      >
        {/* Features Section */}
        <FadeInUp>
          <div style={{ textAlign: "center", marginBottom: "80px" }} ref={ref}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Title
                level={2}
                style={{
                  marginBottom: "16px",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Powerful Features
              </Title>
              <Paragraph
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Everything you need to create the perfect ATS-optimized resume
              </Paragraph>
            </motion.div>
          </div>
        </FadeInUp>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <AnimatedCard delay={index * 0.1} tiltEnabled={true}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 24px",
                    minHeight: "320px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "6px",
                      background: feature.gradient,
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: "24px" }}
                  >
                    {feature.icon}
                  </motion.div>

                  <Title
                    level={4}
                    style={{ marginBottom: "16px", fontSize: "1.3rem" }}
                  >
                    {feature.title}
                  </Title>

                  <Paragraph
                    style={{
                      color: "#666",
                      margin: 0,
                      flex: 1,
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Paragraph>

                  {/* Hover Effect Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      background: feature.gradient,
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <StarOutlined />
                  </motion.div>
                </div>
              </AnimatedCard>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: "100px 0", borderColor: "#e0e0e0" }} />

        {/* How It Works */}
        <FadeInUp>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <Title
              level={2}
              style={{
                fontSize: "clamp(2rem, 5vw, 2.5rem)",
                marginBottom: "16px",
              }}
            >
              How It Works
            </Title>
            <Paragraph style={{ fontSize: "1.1rem", color: "#666" }}>
              Three simple steps to your perfect resume
            </Paragraph>
          </div>
        </FadeInUp>

        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={8}>
            <ScaleIn delay={0.2}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  style={{
                    textAlign: "center",
                    padding: "40px 32px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.5)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  styles={{ body: { position: "relative", zIndex: 1 } }}
                >
                  <FloatingElement duration={3}>
                    <UploadOutlined
                      style={{
                        fontSize: 60,
                        color: "#fff",
                        marginBottom: "24px",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                  </FloatingElement>
                  <Title
                    level={3}
                    style={{ color: "#fff", marginBottom: "16px" }}
                  >
                    1. Upload Resume
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "1rem",
                      margin: 0,
                    }}
                  >
                    Upload your resume in PDF, DOCX, or other common formats
                  </Paragraph>
                </Card>
              </motion.div>
            </ScaleIn>
          </Col>

          <Col xs={24} md={8}>
            <ScaleIn delay={0.4}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  style={{
                    textAlign: "center",
                    padding: "40px 32px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 10px 30px rgba(30, 41, 59, 0.5)",
                  }}
                >
                  <FloatingElement duration={4}>
                    <LineChartOutlined
                      style={{
                        fontSize: 60,
                        color: "#fff",
                        marginBottom: "24px",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                  </FloatingElement>
                  <Title
                    level={3}
                    style={{ color: "#fff", marginBottom: "16px" }}
                  >
                    2. AI Analysis
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "1rem",
                      margin: 0,
                    }}
                  >
                    Our AI analyzes your resume for ATS compatibility and skill
                    gaps
                  </Paragraph>
                </Card>
              </motion.div>
            </ScaleIn>
          </Col>

          <Col xs={24} md={8}>
            <ScaleIn delay={0.6}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  style={{
                    textAlign: "center",
                    padding: "40px 32px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(79, 172, 254, 0.3)",
                  }}
                >
                  <FloatingElement duration={3.5}>
                    <ThunderboltOutlined
                      style={{
                        fontSize: 60,
                        color: "#fff",
                        marginBottom: "24px",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                  </FloatingElement>
                  <Title
                    level={3}
                    style={{ color: "#fff", marginBottom: "16px" }}
                  >
                    3. Get Insights
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "1rem",
                      margin: 0,
                    }}
                  >
                    Receive personalized suggestions for improvements and
                    learning
                  </Paragraph>
                </Card>
              </motion.div>
            </ScaleIn>
          </Col>
        </Row>

        <Divider style={{ margin: "100px 0", borderColor: "#e0e0e0" }} />

        {/* Resume Builder Section */}
        <FadeInUp>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <Title
              level={2}
              style={{
                fontSize: "clamp(2rem, 5vw, 2.5rem)",
                marginBottom: "16px",
              }}
            >
              Build Professional Resumes
            </Title>
            <Paragraph style={{ fontSize: "1.1rem", color: "#666" }}>
              Create ATS-optimized resumes with powerful tools
            </Paragraph>
          </div>
        </FadeInUp>

        <AnimatedCard delay={0.2} tiltEnabled={false}>
          <div
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)",
              borderRadius: "20px",
              padding: "60px 40px",
              border: "none",
            }}
          >
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} md={12}>
                <FadeInUp delay={0.3}>
                  <Title
                    level={3}
                    style={{
                      fontWeight: "bold",
                      marginBottom: "24px",
                      fontSize: "2rem",
                    }}
                  >
                    Create ATS-Friendly Resumes
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "32px",
                      color: "#555",
                      lineHeight: 1.8,
                    }}
                  >
                    Build professional resumes with our optimized templates
                    designed to pass through Applicant Tracking Systems. Save
                    multiple versions for different job roles and export to PDF
                    with one click.
                  </Paragraph>
                  <Space size="middle" wrap>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<BuildOutlined />}
                        onClick={() => navigate("/builder")}
                        style={{
                          height: "50px",
                          padding: "0 32px",
                          fontSize: "1.05rem",
                          borderRadius: "25px",
                          background:
                            "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                          border: "1px solid rgba(6, 182, 212, 0.5)",
                          boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
                        }}
                      >
                        Start Building
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="large"
                        icon={<BarChartOutlined />}
                        onClick={() => navigate("/analyze")}
                        style={{
                          height: "50px",
                          padding: "0 32px",
                          fontSize: "1.05rem",
                          borderRadius: "25px",
                        }}
                      >
                        Analyze Existing
                      </Button>
                    </motion.div>
                  </Space>
                </FadeInUp>
              </Col>
              <Col xs={24} md={12}>
                <StaggerContainer>
                  {[
                    {
                      icon: <SafetyOutlined />,
                      title: "Professional Templates",
                      desc: "Choose from multiple ATS-optimized templates",
                    },
                    {
                      icon: <CheckCircleOutlined />,
                      title: "Resume Versioning",
                      desc: "Save different versions for different job roles",
                    },
                    {
                      icon: <DownloadOutlined />,
                      title: "1-Click PDF Export",
                      desc: "Generate professional PDFs instantly",
                    },
                  ].map((item, idx) => (
                    <StaggerItem key={idx}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            marginBottom: "16px",
                            border: "1px solid #e8e8e8",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Space align="start">
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background:
                                  "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                border: "1px solid rgba(6, 182, 212, 0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#06b6d4",
                                fontSize: "24px",
                              }}
                            >
                              {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <Text
                                strong
                                style={{
                                  fontSize: "1.1rem",
                                  display: "block",
                                  marginBottom: "4px",
                                }}
                              >
                                {item.title}
                              </Text>
                              <Text type="secondary">{item.desc}</Text>
                            </div>
                          </Space>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Col>
            </Row>
          </div>
        </AnimatedCard>

        <Divider style={{ margin: "100px 0", borderColor: "#e0e0e0" }} />

        {/* Real-Time Editor Section */}
        <ParallaxSection
          gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          style={{
            borderRadius: "24px",
            padding: "60px 40px",
            marginBottom: "100px",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          <FadeInUp>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <Title
                level={2}
                style={{
                  color: "white",
                  fontSize: "clamp(2rem, 5vw, 2.5rem)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Real-Time Resume Editor
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Edit with instant visual feedback and ATS scoring
              </Paragraph>
            </div>
          </FadeInUp>

          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={12}>
              <FadeInUp delay={0.2}>
                <Title
                  level={3}
                  style={{
                    fontWeight: "bold",
                    marginBottom: "24px",
                    color: "white",
                    fontSize: "2rem",
                  }}
                >
                  WYSIWYG Editor with Instant Feedback
                </Title>
                <Paragraph
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "32px",
                    color: "white",
                    opacity: 0.95,
                    lineHeight: 1.8,
                  }}
                >
                  Edit your resume in real-time with live preview and instant
                  ATS compatibility scoring. Get immediate feedback as you type
                  and see your changes reflected instantly.
                </Paragraph>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<EditOutlined />}
                    onClick={() => navigate("/editor")}
                    style={{
                      height: "50px",
                      padding: "0 32px",
                      fontSize: "1.05rem",
                      backgroundColor: "white",
                      borderColor: "white",
                      color: "#667eea",
                      borderRadius: "25px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    Start Editing
                  </Button>
                </motion.div>
              </FadeInUp>
            </Col>
            <Col xs={24} md={12}>
              <StaggerContainer>
                {[
                  {
                    icon: <RocketOutlined />,
                    title: "Live Preview",
                    desc: "See your resume as it will appear to employers",
                  },
                  {
                    icon: <BarChartOutlined />,
                    title: "Real-Time Scoring",
                    desc: "Get instant ATS compatibility feedback",
                  },
                  {
                    icon: <BulbOutlined />,
                    title: "Smart Suggestions",
                    desc: "Receive improvement tips as you edit",
                  },
                ].map((item, idx) => (
                  <StaggerItem key={idx}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        style={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          borderRadius: "12px",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          marginBottom: "16px",
                        }}
                      >
                        <Space align="start">
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "12px",
                              background: "rgba(255,255,255,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "24px",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            {item.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <Text
                              strong
                              style={{
                                color: "white",
                                fontSize: "1.1rem",
                                display: "block",
                                marginBottom: "4px",
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text style={{ color: "white", opacity: 0.85 }}>
                              {item.desc}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Col>
          </Row>
        </ParallaxSection>

        {/* CTA Section */}
        <ParallaxSection
          gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          style={{
            textAlign: "center",
            padding: "80px 40px",
            borderRadius: "24px",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          <FadeInUp>
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Title
                level={2}
                style={{
                  color: "white",
                  marginBottom: "24px",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Ready to Optimize Your Resume?
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "1.2rem",
                  marginBottom: "40px",
                  maxWidth: "600px",
                  margin: "0 auto 40px",
                }}
              >
                Join thousands of job seekers who have improved their ATS
                compatibility and landed their dream jobs
              </Paragraph>

              <Space size="large" wrap style={{ justifyContent: "center" }}>
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<BarChartOutlined />}
                    onClick={() => navigate("/analyze")}
                    style={{
                      height: "56px",
                      padding: "0 40px",
                      fontSize: "1.1rem",
                      backgroundColor: "white",
                      borderColor: "white",
                      color: "#f5576c",
                      fontWeight: "bold",
                      borderRadius: "28px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    Analyze Resume Now
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate("/builder")}
                    style={{
                      height: "56px",
                      padding: "0 40px",
                      fontSize: "1.1rem",
                      backgroundColor: "transparent",
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "28px",
                      borderWidth: "2px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Build New Resume
                  </Button>
                </motion.div>
              </Space>
            </motion.div>
          </FadeInUp>
        </ParallaxSection>
      </div>
    </Content>
  );
};

export default Home;
