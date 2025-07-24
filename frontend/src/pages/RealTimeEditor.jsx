import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Typography,
  Card,
  Input,
  Button,
  Form,
  Space,
  Divider,
  Select,
  Modal,
  List,
  Tag,
  Progress,
  Alert,
  Tooltip,
  FloatButton,
  Switch,
  message,
  Layout
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { resumeBuilderService } from '../services/resumeBuilderService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

const RealTimeEditor = () => {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [versions, setVersions] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    atsScore: 0,
    suggestions: [],
    warnings: [],
    tips: []
  });

  const [autoSave, setAutoSave] = useState(true);
  const previewRef = useRef(null);

  useEffect(() => {
    loadTemplates();
    loadVersions();
    
    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      if (autoSave && resumeData.name) {
        handleAutoSave();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [resumeData, autoSave]);

  useEffect(() => {
    // Generate feedback when resume data changes
    generateFeedback();
  }, [resumeData]);

  const loadTemplates = async () => {
    try {
      const response = await resumeBuilderService.getTemplates();
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await resumeBuilderService.getVersions();
      setVersions(response.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const generateFeedback = () => {
    // Simulate real-time feedback generation
    let score = 0;
    const suggestions = [];
    const warnings = [];
    const tips = [];

    // Check for basic information
    if (resumeData.name) score += 10;
    if (resumeData.email) score += 10;
    if (resumeData.phone) score += 5;
    if (resumeData.summary && resumeData.summary.length > 50) score += 15;
    else if (!resumeData.summary) suggestions.push("Add a professional summary to improve your ATS score");

    // Check experience
    if (resumeData.experience.length > 0) {
      score += 20;
      resumeData.experience.forEach((exp, index) => {
        if (!exp.description || exp.description.length < 50) {
          warnings.push(`Experience ${index + 1}: Add more detailed description with achievements`);
        }
      });
    } else {
      warnings.push("Add work experience to strengthen your resume");
    }

    // Check education
    if (resumeData.education.length > 0) score += 10;

    // Check skills
    if (resumeData.skills.length >= 5) score += 15;
    else suggestions.push("Add more relevant skills to reach the recommended minimum of 5");

    // Add tips based on score
    if (score < 50) {
      tips.push("Your resume needs significant improvement. Focus on adding complete sections.");
    } else if (score < 75) {
      tips.push("Good progress! Add more details to boost your ATS compatibility.");
    } else {
      tips.push("Excellent! Your resume is well-structured and ATS-friendly.");
    }

    setFeedback({
      atsScore: Math.min(score, 100),
      suggestions,
      warnings,
      tips
    });
  };

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoSave = async () => {
    try {
      await resumeBuilderService.autoSave(resumeData);
      message.success('Auto-saved', 1);
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  const handleSave = async () => {
    if (!versionName || !jobTitle) {
      message.error('Please provide version name and job title');
      return;
    }

    setLoading(true);
    try {
      await resumeBuilderService.saveVersion({
        ...resumeData,
        versionName,
        jobTitle,
        template: selectedTemplate
      });
      message.success('Resume version saved successfully!');
      setSaveModalVisible(false);
      setVersionName('');
      setJobTitle('');
      loadVersions();
    } catch (error) {
      message.error('Error saving resume version');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      await resumeBuilderService.exportToPDF(resumeData, selectedTemplate);
      message.success('PDF exported successfully!');
    } catch (error) {
      message.error('Error exporting PDF');
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#52c41a';
    if (score >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const renderFeedbackPanel = () => (
    <Card title="Real-Time Feedback" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Progress
            type="circle"
            percent={feedback.atsScore}
            format={percent => `${percent}%`}
            strokeColor={getScoreColor(feedback.atsScore)}
            size={80}
          />
          <Text style={{ display: 'block', marginTop: 8 }}>ATS Compatibility</Text>
        </div>

        <Divider />

        {feedback.warnings.length > 0 && (
          <div>
            <Title level={5}>
              <WarningOutlined style={{ color: '#faad14' }} /> Warnings
            </Title>
            {feedback.warnings.map((warning, index) => (
              <Alert
                key={index}
                message={warning}
                type="warning"
                size="small"
                style={{ marginBottom: 8 }}
                showIcon
              />
            ))}
          </div>
        )}

        {feedback.suggestions.length > 0 && (
          <div>
            <Title level={5}>
              <InfoCircleOutlined style={{ color: '#1890ff' }} /> Suggestions
            </Title>
            {feedback.suggestions.map((suggestion, index) => (
              <Alert
                key={index}
                message={suggestion}
                type="info"
                size="small"
                style={{ marginBottom: 8 }}
                showIcon
              />
            ))}
          </div>
        )}

        {feedback.tips.length > 0 && (
          <div>
            <Title level={5}>
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> Tips
            </Title>
            {feedback.tips.map((tip, index) => (
              <Alert
                key={index}
                message={tip}
                type="success"
                size="small"
                style={{ marginBottom: 8 }}
                showIcon
              />
            ))}
          </div>
        )}
      </Space>
    </Card>
  );

  const renderEditor = () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Personal Information */}
      <Card title="Personal Information" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Full Name"
              value={resumeData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Input
              placeholder="Email"
              type="email"
              value={resumeData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Input
              placeholder="Phone"
              value={resumeData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Input
              placeholder="Location"
              value={resumeData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{ marginBottom: 8 }}
            />
          </Col>
        </Row>
      </Card>

      {/* Professional Summary */}
      <Card title="Professional Summary" size="small">
        <TextArea
          rows={4}
          placeholder="Write a compelling professional summary..."
          value={resumeData.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
        />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Characters: {resumeData.summary.length} (Recommended: 150-300)
        </Text>
      </Card>

      {/* Skills */}
      <Card title="Skills" size="small">
        <Input.Search
          placeholder="Add a skill"
          enterButton={<PlusOutlined />}
          onSearch={(value) => {
            if (value && !resumeData.skills.includes(value)) {
              handleInputChange('skills', [...resumeData.skills, value]);
            }
          }}
          style={{ marginBottom: 16 }}
        />
        <Space wrap>
          {resumeData.skills.map((skill, index) => (
            <Tag
              key={index}
              closable
              onClose={() => {
                const newSkills = resumeData.skills.filter((_, i) => i !== index);
                handleInputChange('skills', newSkills);
              }}
              color="blue"
            >
              {skill}
            </Tag>
          ))}
        </Space>
      </Card>
    </Space>
  );

  const renderPreview = () => (
    <Card title="Live Preview" style={{ minHeight: 600 }}>
      <div style={{ padding: 24, backgroundColor: '#fff', minHeight: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>{resumeData.name || 'Your Name'}</Title>
          <Text>{resumeData.email} | {resumeData.phone} | {resumeData.location}</Text>
        </div>
        
        {resumeData.summary && (
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>Professional Summary</Title>
            <Paragraph>{resumeData.summary}</Paragraph>
          </div>
        )}
        
        {resumeData.skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>Skills</Title>
            <Space wrap>
              {resumeData.skills.map((skill, index) => (
                <Tag key={index} color="blue">{skill}</Tag>
              ))}
            </Space>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Real-Time Resume Editor</Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#666' }}>
            Edit your resume with live preview and instant ATS feedback
          </Paragraph>
        </div>

        {/* Controls */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Space>
                <Switch
                  checked={previewMode}
                  onChange={setPreviewMode}
                  checkedChildren="Preview"
                  unCheckedChildren="Edit"
                />
                <Switch
                  checked={autoSave}
                  onChange={setAutoSave}
                  checkedChildren="Auto-save"
                  unCheckedChildren="Manual"
                />
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="Select Template"
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                style={{ width: '100%' }}
              >
                <Option value="professional">Professional</Option>
                <Option value="modern">Modern</Option>
                <Option value="creative">Creative</Option>
                <Option value="minimal">Minimal</Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setSaveModalVisible(true)}
                >
                  Save
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  loading={loading}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Editor/Preview Section */}
          <Col xs={24} lg={16}>
            {previewMode ? renderPreview() : renderEditor()}
          </Col>

          {/* Feedback Panel */}
          <Col xs={24} lg={8}>
            {renderFeedbackPanel()}
          </Col>
        </Row>

        {/* Save Modal */}
        <Modal
          title="Save Resume Version"
          open={saveModalVisible}
          onOk={handleSave}
          onCancel={() => setSaveModalVisible(false)}
          confirmLoading={loading}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <label>Version Name:</label>
              <Input
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g., Software Engineer v1"
              />
            </div>
            <div>
              <label>Target Job Title:</label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
          </Space>
        </Modal>

        {/* Floating Actions */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<EditOutlined />}
        >
          <FloatButton 
            icon={<EyeOutlined />} 
            tooltip="Toggle Preview" 
            onClick={() => setPreviewMode(!previewMode)} 
          />
          <FloatButton 
            icon={<SaveOutlined />} 
            tooltip="Save Version" 
            onClick={() => setSaveModalVisible(true)} 
          />
          <FloatButton 
            icon={<DownloadOutlined />} 
            tooltip="Export PDF" 
            onClick={handleExport} 
          />
        </FloatButton.Group>
      </motion.div>
    </Content>
  );
};

export default RealTimeEditor; 