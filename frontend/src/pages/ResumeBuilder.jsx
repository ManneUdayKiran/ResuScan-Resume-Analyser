import React, { useState, useEffect } from 'react';
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
  message,
  Layout,
  FloatButton
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { resumeBuilderService } from '../services/resumeBuilderService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

const ResumeBuilder = () => {
  const [form] = Form.useForm();
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

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [versions, setVersions] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadVersions();
  }, []);

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

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
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
    <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Resume Builder</Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#666' }}>
            Create professional, ATS-friendly resumes with our easy-to-use builder
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Form Section */}
          <Col xs={24} lg={14}>
            <motion.div variants={itemVariants}>
              <Card title="Personal Information" style={{ marginBottom: 24 }}>
                <Form layout="vertical">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Full Name">
                        <Input
                          value={resumeData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Email">
                        <Input
                          type="email"
                          value={resumeData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Phone">
                        <Input
                          value={resumeData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Location">
                        <Input
                          value={resumeData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="City, State"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="LinkedIn">
                        <Input
                          value={resumeData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Professional Summary">
                        <TextArea
                          rows={4}
                          value={resumeData.summary}
                          onChange={(e) => handleInputChange('summary', e.target.value)}
                          placeholder="Write a brief summary of your professional background..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </motion.div>

            {/* Experience Section */}
            <motion.div variants={itemVariants}>
              <Card 
                title="Work Experience" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={addExperience}>
                    Add Experience
                  </Button>
                }
                style={{ marginBottom: 24 }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {resumeData.experience.map((exp, index) => (
                    <Card 
                      key={index} 
                      size="small"
                      extra={
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => removeExperience(index)}
                        />
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Input
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          />
                        </Col>
                        <Col xs={24} md={8}>
                          <Input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          />
                        </Col>
                        <Col xs={12} md={8}>
                          <Input
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          />
                        </Col>
                        <Col xs={12} md={8}>
                          <Input
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          />
                        </Col>
                        <Col xs={24}>
                          <TextArea
                            rows={3}
                            placeholder="Job description and achievements..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>
            </motion.div>

            {/* Education Section */}
            <motion.div variants={itemVariants}>
              <Card 
                title="Education" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={addEducation}>
                    Add Education
                  </Button>
                }
                style={{ marginBottom: 24 }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {resumeData.education.map((edu, index) => (
                    <Card 
                      key={index} 
                      size="small"
                      extra={
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => removeEducation(index)}
                        />
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <Input
                            placeholder="School/University"
                            value={edu.school}
                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                          />
                        </Col>
                        <Col xs={24} md={8}>
                          <Input
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => updateEducation(index, 'location', e.target.value)}
                          />
                        </Col>
                        <Col xs={12} md={8}>
                          <Input
                            placeholder="Graduation Date"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                          />
                        </Col>
                        <Col xs={12} md={8}>
                          <Input
                            placeholder="GPA (optional)"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div variants={itemVariants}>
              <Card title="Skills" style={{ marginBottom: 24 }}>
                <Input.Search
                  placeholder="Add a skill"
                  enterButton={<PlusOutlined />}
                  onSearch={addSkill}
                  style={{ marginBottom: 16 }}
                />
                <Space wrap>
                  {resumeData.skills.map((skill, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => removeSkill(skill)}
                      color="blue"
                    >
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </Card>
            </motion.div>
          </Col>

          {/* Preview and Actions Section */}
          <Col xs={24} lg={10}>
            <motion.div variants={itemVariants}>
              <Card title="Template & Actions" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Title level={5}>Template</Title>
                    <Select
                      value={selectedTemplate}
                      onChange={setSelectedTemplate}
                      style={{ width: '100%' }}
                    >
                      <Option value="professional">Professional</Option>
                      <Option value="modern">Modern</Option>
                      <Option value="creative">Creative</Option>
                      <Option value="minimal">Minimal</Option>
                    </Select>
                  </div>

                  <Divider />

                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={() => setSaveModalVisible(true)}
                      block
                      size="large"
                    >
                      Save Version
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExport}
                      loading={loading}
                      block
                      size="large"
                    >
                      Export PDF
                    </Button>
                  </Space>
                </Space>
              </Card>
            </motion.div>

            {/* Saved Versions */}
            <motion.div variants={itemVariants}>
              <Card title="Saved Versions" style={{ marginBottom: 24 }}>
                <List
                  dataSource={versions}
                  renderItem={version => (
                    <List.Item
                      actions={[
                        <Button type="text" icon={<EditOutlined />} />,
                        <Button type="text" icon={<CopyOutlined />} />,
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        title={version.name}
                        description={`${version.jobTitle} • ${version.updatedAt}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
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

        {/* Floating Action Button */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<BuildOutlined />}
        >
          <FloatButton icon={<SaveOutlined />} tooltip="Save Version" onClick={() => setSaveModalVisible(true)} />
          <FloatButton icon={<DownloadOutlined />} tooltip="Export PDF" onClick={handleExport} />
        </FloatButton.Group>
      </motion.div>
    </Content>
  );
};

export default ResumeBuilder; 