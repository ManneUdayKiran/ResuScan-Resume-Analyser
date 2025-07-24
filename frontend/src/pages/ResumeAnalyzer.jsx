import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Card,
  Button,
  Select,
  Upload,
  Progress,
  Alert,
  Tag,
  Divider,
  Collapse,
  List,
  Space,
  Tabs,
  Spin,
  message,
  Layout
} from 'antd';
import {
  CloudUploadOutlined,
  BarChartOutlined,
  RiseOutlined,
  BulbOutlined,
  BookOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  StarOutlined,
  LinkedinOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Option } = Select;
const { Content } = Layout;

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [linkedinImage, setLinkedinImage] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  const jobTitles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Marketing Manager',
    'UX Designer',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.docx,.doc',
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onRemove: () => setFile(null),
    showUploadList: false,
  };

  const linkedinUploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      setLinkedinImage(file);
      return false;
    },
    onRemove: () => setLinkedinImage(null),
    showUploadList: false,
  };

  const handleAnalyze = async () => {
    if (!file) {
      message.error('Please upload a resume file');
      return;
    }
    if (!jobTitle) {
      message.error('Please select a job title');
      return;
    }

    setLoading(true);
    try {
      const result = await resumeAPI.comprehensiveAnalysis(file, jobTitle);
      setAnalysis(result);
      message.success('Analysis completed successfully!');
    } catch (err) {
      message.error(err.response?.data?.detail || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedinAnalyze = async () => {
    if (!linkedinImage) {
      message.error('Please upload a LinkedIn profile screenshot');
      return;
    }
    if (!jobTitle) {
      message.error('Please select a job title');
      return;
    }

    setLoading(true);
    try {
      const result = await resumeAPI.analyzeLinkedin(linkedinImage, jobTitle);
      setLinkedinAnalysis(result);
      message.success('LinkedIn analysis completed successfully!');
    } catch (err) {
      message.error(err.response?.data?.detail || 'An error occurred during LinkedIn analysis');
    } finally {
      setLoading(false);
    }
  };

  const renderATSResults = () => {
    if (!analysis?.ats_analysis) return null;

    const { 
      ats_score, 
      keyword_score, 
      format_score, 
      readability_score, 
      structure_score,
      matched_keywords, 
      missing_keywords, 
      improvement_tips
    } = analysis.ats_analysis;

    const getScoreColor = (score) => {
      if (score >= 70) return '#52c41a';
      if (score >= 50) return '#faad14';
      return '#ff4d4f';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card title={
          <Space>
            <BarChartOutlined />
            <span>ATS Compatibility Analysis</span>
          </Space>
        } style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={ats_score}
                  format={percent => `${percent}/100`}
                  strokeColor={getScoreColor(ats_score)}
                  size={120}
                />
                <Title level={5} style={{ marginTop: 16 }}>Overall ATS Score</Title>
              </div>
            </Col>
            <Col xs={24} md={18}>
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: getScoreColor(keyword_score), margin: 0 }}>
                      {keyword_score}
                    </Title>
                    <Text type="secondary">Keywords</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: getScoreColor(format_score), margin: 0 }}>
                      {format_score}
                    </Title>
                    <Text type="secondary">Format</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: getScoreColor(readability_score), margin: 0 }}>
                      {readability_score}
                    </Title>
                    <Text type="secondary">Readability</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: getScoreColor(structure_score), margin: 0 }}>
                      {structure_score}
                    </Title>
                    <Text type="secondary">Structure</Text>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> Matched Keywords
              </Title>
              <Space wrap>
                {matched_keywords?.map((keyword, index) => (
                  <Tag key={index} color="green">{keyword}</Tag>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> Missing Keywords
              </Title>
              <Space wrap>
                {missing_keywords?.map((keyword, index) => (
                  <Tag key={index} color="red">{keyword}</Tag>
                ))}
              </Space>
            </Col>
          </Row>

          {improvement_tips?.length > 0 && (
            <>
              <Divider />
              <Title level={5}>
                <BulbOutlined style={{ color: '#faad14' }} /> Improvement Tips
              </Title>
              <List
                size="small"
                dataSource={improvement_tips}
                renderItem={tip => (
                  <List.Item>
                    <Text>{tip}</Text>
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>
      </motion.div>
    );
  };

  const renderSkillGapResults = () => {
    if (!analysis?.skill_gap) return null;

    const { missing_skills, skill_recommendations, learning_resources } = analysis.skill_gap;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card title={
          <Space>
            <RiseOutlined />
            <span>Skill Gap Analysis</span>
          </Space>
        } style={{ marginBottom: 24 }}>
          <Collapse>
            <Panel header="Missing Skills" key="1">
              <Space wrap>
                {missing_skills?.map((skill, index) => (
                  <Tag key={index} color="orange">{skill}</Tag>
                ))}
              </Space>
            </Panel>
            <Panel header="Skill Recommendations" key="2">
              <List
                dataSource={skill_recommendations}
                renderItem={rec => (
                  <List.Item>
                    <List.Item.Meta
                      title={rec.skill}
                      description={rec.reason}
                    />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Learning Resources" key="3">
              <List
                dataSource={learning_resources}
                renderItem={resource => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>}
                      description={resource.description}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Card>
      </motion.div>
    );
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <Space>
          <BarChartOutlined />
          Resume Analysis
        </Space>
      ),
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card title="Upload Resume" style={{ height: 'fit-content' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag resume to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support PDF, DOCX, and DOC formats
                  </p>
                </Dragger>
                
                {file && (
                  <Alert
                    message={`Selected: ${file.name}`}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                <Select
                  placeholder="Select target job title"
                  value={jobTitle}
                  onChange={setJobTitle}
                  style={{ width: '100%', marginBottom: 16 }}
                >
                  {jobTitles.map(title => (
                    <Option key={title} value={title}>{title}</Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={!file || !jobTitle || loading}
                  loading={loading}
                  icon={<BarChartOutlined />}
                  block
                >
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Spin spinning={loading}>
              {analysis ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {renderATSResults()}
                  {renderSkillGapResults()}
                </Space>
              ) : (
                <Card style={{ textAlign: 'center', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div>
                    <CloudUploadOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                    <Title level={4} type="secondary">Upload your resume to get started</Title>
                    <Paragraph type="secondary">
                      Get instant ATS compatibility analysis, skill gap insights, and personalized recommendations
                    </Paragraph>
                  </div>
                </Card>
              )}
            </Spin>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <LinkedinOutlined />
          LinkedIn Analysis
        </Space>
      ),
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card title="Upload LinkedIn Screenshot" style={{ height: 'fit-content' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Dragger {...linkedinUploadProps} style={{ marginBottom: 16 }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag LinkedIn screenshot here</p>
                  <p className="ant-upload-hint">
                    Support PNG, JPG, JPEG formats
                  </p>
                </Dragger>
                
                {linkedinImage && (
                  <Alert
                    message={`Selected: ${linkedinImage.name}`}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                <Select
                  placeholder="Select target job title"
                  value={jobTitle}
                  onChange={setJobTitle}
                  style={{ width: '100%', marginBottom: 16 }}
                >
                  {jobTitles.map(title => (
                    <Option key={title} value={title}>{title}</Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleLinkedinAnalyze}
                  disabled={!linkedinImage || !jobTitle || loading}
                  loading={loading}
                  icon={<EyeOutlined />}
                  block
                >
                  {loading ? 'Analyzing...' : 'Analyze LinkedIn Profile'}
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Spin spinning={loading}>
              {linkedinAnalysis ? (
                <Card title="LinkedIn Analysis Results">
                  <Paragraph>LinkedIn analysis results will be displayed here...</Paragraph>
                </Card>
              ) : (
                <Card style={{ textAlign: 'center', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div>
                    <LinkedinOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                    <Title level={4} type="secondary">Upload LinkedIn screenshot to analyze</Title>
                    <Paragraph type="secondary">
                      Get insights on your LinkedIn profile optimization for better visibility
                    </Paragraph>
                  </div>
                </Card>
              )}
            </Spin>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Resume Analyzer</Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#666' }}>
            Upload your resume for comprehensive ATS analysis and get personalized improvement suggestions
          </Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </motion.div>
    </Content>
  );
};

export default ResumeAnalyzer; 