import React from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Card, 
  Space,
  Divider,
  Layout
} from 'antd';
import { useNavigate } from 'react-router-dom';
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
  RocketOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChartOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'ATS Compatibility',
      description: 'Check your resume against Applicant Tracking Systems to ensure it gets past the initial screening.'
    },
    {
      icon: <RiseOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills for your target job role and understand what you need to learn.'
    },
    {
      icon: <BulbOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Bullet Point Improvements',
      description: 'Get AI-powered suggestions to make your bullet points more impactful and ATS-friendly.'
    },
    {
      icon: <BookOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Learning Recommendations',
      description: 'Receive personalized project and course recommendations to fill your skill gaps.'
    },
    {
      icon: <BuildOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Resume Builder',
      description: 'Create ATS-friendly resumes with professional templates and save multiple versions for different roles.'
    },
    {
      icon: <DownloadOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: '1-Click PDF Export',
      description: 'Generate professional PDF resumes instantly with our optimized templates for maximum ATS compatibility.'
    },
    {
      icon: <EditOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Real-Time Editor',
      description: 'WYSIWYG editor with instant feedback, live preview, and real-time ATS compatibility scoring as you type.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Content style={{ padding: '0', minHeight: '100vh' }}>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '80px 24px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ maxWidth: '800px' }}>
            <motion.div variants={itemVariants}>
              <Title level={1} style={{ color: 'white', fontWeight: 'bold', fontSize: '3.5rem', marginBottom: '16px' }}>
                ResuScan
              </Title>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Title level={2} style={{ color: 'white', opacity: 0.9, fontWeight: 'normal', marginBottom: '24px' }}>
                Resume Analyzer + ATS Matcher
              </Title>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paragraph style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '32px', color: 'white' }}>
                Upload your resume and instantly scan it for ATS compatibility, skill gaps, 
                and get personalized improvement suggestions.
              </Paragraph>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                type="primary"
                size="large"
                icon={<UploadOutlined />}
                onClick={() => navigate('/analyze')}
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  borderColor: 'white',
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                Start Analyzing
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ marginBottom: '16px' }}>
              What ResuScan Does
            </Title>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      padding: '24px 16px',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'stretch',
                      minHeight: 240
                    }}
                    bodyStyle={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ marginBottom: '12px' }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ color: '#666', margin: 0, flex: 1 }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        <Divider style={{ margin: '80px 0' }} />

        {/* How It Works */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2}>How It Works</Title>
          </div>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <Card style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '12px' }}>
                  <UploadOutlined style={{ fontSize: 50, color: '#1976d2', marginBottom: '16px' }} />
                  <Title level={4}>1. Upload Resume</Title>
                  <Paragraph style={{ color: '#666' }}>
                    Upload your resume in PDF, DOCX, or other common formats
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <Card style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '12px' }}>
                  <LineChartOutlined style={{ fontSize: 50, color: '#1976d2', marginBottom: '16px' }} />
                  <Title level={4}>2. AI Analysis</Title>
                  <Paragraph style={{ color: '#666' }}>
                    Our AI analyzes your resume for ATS compatibility and skill gaps
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <Card style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '12px' }}>
                  <BookOutlined style={{ fontSize: 50, color: '#1976d2', marginBottom: '16px' }} />
                  <Title level={4}>3. Get Recommendations</Title>
                  <Paragraph style={{ color: '#666' }}>
                    Receive personalized suggestions for improvements and learning
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        <Divider style={{ margin: '80px 0' }} />

        {/* Resume Builder Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2}>Build Professional Resumes</Title>
          </div>
          
          <Card
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '16px',
              padding: '40px 32px',
              border: 'none'
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants}>
                  <Title level={3} style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                    Create ATS-Friendly Resumes
                  </Title>
                  <Paragraph style={{ fontSize: '1.1rem', marginBottom: '24px' }}>
                    Build professional resumes with our optimized templates designed to pass through Applicant Tracking Systems. 
                    Save multiple versions for different job roles and export to PDF with one click.
                  </Paragraph>
                  <Space size="middle" wrap>
                    <Button
                      type="primary"
                      size="large"
                      icon={<BuildOutlined />}
                      onClick={() => navigate('/builder')}
                      style={{ height: '44px', padding: '0 24px' }}
                    >
                      Start Building
                    </Button>
                    <Button
                      size="large"
                      icon={<BarChartOutlined />}
                      onClick={() => navigate('/analyze')}
                      style={{ height: '44px', padding: '0 24px' }}
                    >
                      Analyze Existing
                    </Button>
                  </Space>
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Card style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <div>
                          <Text strong>Professional Templates</Text>
                          <br />
                          <Text type="secondary">Choose from multiple ATS-optimized templates</Text>
                        </div>
                      </Space>
                    </Card>
                    <Card style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <div>
                          <Text strong>Resume Versioning</Text>
                          <br />
                          <Text type="secondary">Save different versions for different job roles</Text>
                        </div>
                      </Space>
                    </Card>
                    <Card style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <div>
                          <Text strong>1-Click PDF Export</Text>
                          <br />
                          <Text type="secondary">Generate professional PDFs instantly</Text>
                        </div>
                      </Space>
                    </Card>
                  </Space>
                </motion.div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <Divider style={{ margin: '80px 0' }} />

        {/* Real-Time Editor Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2}>Real-Time Resume Editor</Title>
          </div>
          
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '40px 32px',
              border: 'none',
              color: 'white'
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants}>
                  <Title level={3} style={{ fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>
                    WYSIWYG Editor with Instant Feedback
                  </Title>
                  <Paragraph style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'white', opacity: 0.9 }}>
                    Edit your resume in real-time with live preview and instant ATS compatibility scoring. 
                    Get immediate feedback as you type and see your changes reflected instantly.
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<EditOutlined />}
                    onClick={() => navigate('/editor')}
                    style={{
                      height: '44px',
                      padding: '0 24px',
                      backgroundColor: 'white',
                      borderColor: 'white',
                      color: '#1976d2'
                    }}
                  >
                    Start Editing
                  </Button>
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Card style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                      <Space>
                        <RocketOutlined style={{ color: 'white' }} />
                        <div>
                          <Text strong style={{ color: 'white' }}>Live Preview</Text>
                          <br />
                          <Text style={{ color: 'white', opacity: 0.8 }}>See your resume as it will appear to employers</Text>
                        </div>
                      </Space>
                    </Card>
                    <Card style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                      <Space>
                        <BarChartOutlined style={{ color: 'white' }} />
                        <div>
                          <Text strong style={{ color: 'white' }}>Real-Time Scoring</Text>
                          <br />
                          <Text style={{ color: 'white', opacity: 0.8 }}>Get instant ATS compatibility feedback</Text>
                        </div>
                      </Space>
                    </Card>
                    <Card style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                      <Space>
                        <BulbOutlined style={{ color: 'white' }} />
                        <div>
                          <Text strong style={{ color: 'white' }}>Smart Suggestions</Text>
                          <br />
                          <Text style={{ color: 'white', opacity: 0.8 }}>Receive improvement tips as you edit</Text>
                        </div>
                      </Space>
                    </Card>
                  </Space>
                </motion.div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          style={{ textAlign: 'center', marginTop: '80px' }}
        >
          <motion.div variants={itemVariants}>
            <Title level={3} style={{ marginBottom: '24px' }}>
              Ready to optimize your resume?
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<BarChartOutlined />}
              onClick={() => navigate('/analyze')}
              style={{
                height: '48px',
                padding: '0 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Analyze Your Resume Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Content>
  );
};

export default Home; 