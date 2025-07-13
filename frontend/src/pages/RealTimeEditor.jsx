import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from '@mui/icons-material';
import { resumeBuilderService } from '../services/resumeBuilderService';

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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    atsScore: 0,
    suggestions: [],
    warnings: [],
    tips: []
  });

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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
    // Add to history
    addToHistory();
  }, [resumeData]);

  const loadTemplates = async () => {
    try {
      const response = await resumeBuilderService.getTemplates();
      setTemplates(response.templates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await resumeBuilderService.getVersions();
      setVersions(response.versions);
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const addToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(resumeData));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevData = JSON.parse(history[historyIndex - 1]);
      setResumeData(prevData);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextData = JSON.parse(history[historyIndex + 1]);
      setResumeData(nextData);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const generateFeedback = async () => {
    if (!resumeData.name) return;

    try {
      const resumeText = JSON.stringify(resumeData);
      const response = await fetch('http://localhost:8000/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          resume_text: resumeText,
          job_title: jobTitle || 'Software Engineer'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback({
          atsScore: data.ats_score,
          suggestions: data.improvement_tips || [],
          warnings: [],
          tips: []
        });
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  };

  const handleAutoSave = async () => {
    if (!resumeData.name) return;
    
    try {
      const autoSaveName = `Auto-save ${new Date().toLocaleTimeString()}`;
      await resumeBuilderService.saveVersion(resumeData, autoSaveName, jobTitle || 'General');
      setAlert({
        open: true,
        message: 'Auto-saved successfully!',
        severity: 'info'
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setResumeData(prev => ({
      ...prev,
      [field]: [...prev[field], {}]
    }));
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSaveVersion = async () => {
    if (!versionName.trim() || !jobTitle.trim()) {
      setAlert({
        open: true,
        message: 'Please provide both version name and job title',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await resumeBuilderService.saveVersion(resumeData, versionName, jobTitle);
      setAlert({
        open: true,
        message: 'Resume version saved successfully!',
        severity: 'success'
      });
      setSaveDialogOpen(false);
      setVersionName('');
      setJobTitle('');
      loadVersions();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error saving resume version',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const response = await resumeBuilderService.generatePDF(resumeData, selectedTemplate);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setAlert({
        open: true,
        message: 'PDF generated and downloaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error generating PDF',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVersion = async (versionId) => {
    try {
      const response = await resumeBuilderService.getVersion(versionId);
      setResumeData(response.version.resume_data);
      setJobTitle(response.version.job_title);
      setAlert({
        open: true,
        message: 'Resume version loaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error loading resume version',
        severity: 'error'
      });
    }
  };

  const deleteVersion = async (versionId) => {
    try {
      await resumeBuilderService.deleteVersion(versionId);
      setAlert({
        open: true,
        message: 'Resume version deleted successfully!',
        severity: 'success'
      });
      loadVersions();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error deleting resume version',
        severity: 'error'
      });
    }
  };

  const getFeedbackColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getFeedbackIcon = (score) => {
    if (score >= 80) return <CheckCircleIcon />;
    if (score >= 60) return <WarningIcon />;
    return <InfoIcon />;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Real-Time Resume Editor
      </Typography>
      
      <Grid container spacing={3}>
        {/* Editor Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '80vh', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Editor
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Undo">
                  <IconButton onClick={undo} disabled={historyIndex <= 0}>
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Redo">
                  <IconButton onClick={redo} disabled={historyIndex >= history.length - 1}>
                    <RedoIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  variant={previewMode ? "contained" : "outlined"}
                  startIcon={<VisibilityIcon />}
                  onClick={() => setPreviewMode(!previewMode)}
                  size="small"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </Box>
            </Box>

            {!previewMode ? (
              <Box>
                {/* Basic Information */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Basic Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={resumeData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={resumeData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={resumeData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={resumeData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="LinkedIn URL"
                          value={resumeData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Summary */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Professional Summary</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="Summary"
                      multiline
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      margin="normal"
                      size="small"
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Experience */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Work Experience</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {resumeData.experience.map((exp, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Job Title"
                              value={exp.title || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, title: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Company"
                              value={exp.company || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, company: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Dates"
                              value={exp.dates || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, dates: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              multiline
                              rows={3}
                              value={exp.description || ''}
                              onChange={(e) => handleArrayChange('experience', index, { ...exp, description: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => removeArrayItem('experience', index)}
                          color="error"
                          size="small"
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addArrayItem('experience')}
                      variant="outlined"
                      size="small"
                    >
                      Add Experience
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* Education */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Education</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {resumeData.education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Degree"
                              value={edu.degree || ''}
                              onChange={(e) => handleArrayChange('education', index, { ...edu, degree: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="School"
                              value={edu.school || ''}
                              onChange={(e) => handleArrayChange('education', index, { ...edu, school: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Dates"
                              value={edu.dates || ''}
                              onChange={(e) => handleArrayChange('education', index, { ...edu, dates: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => removeArrayItem('education', index)}
                          color="error"
                          size="small"
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addArrayItem('education')}
                      variant="outlined"
                      size="small"
                    >
                      Add Education
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* Skills */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Skills</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="Skills (comma-separated)"
                      value={resumeData.skills.join(', ')}
                      onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      margin="normal"
                      size="small"
                      helperText="Enter skills separated by commas"
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Projects */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Projects</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {resumeData.projects.map((project, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Project Name"
                              value={project.name || ''}
                              onChange={(e) => handleArrayChange('projects', index, { ...project, name: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              multiline
                              rows={2}
                              value={project.description || ''}
                              onChange={(e) => handleArrayChange('projects', index, { ...project, description: e.target.value })}
                              margin="normal"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => removeArrayItem('projects', index)}
                          color="error"
                          size="small"
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addArrayItem('projects')}
                      variant="outlined"
                      size="small"
                    >
                      Add Project
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ) : (
              <Box ref={previewRef}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {resumeData.name || 'Your Name'}
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {[resumeData.email, resumeData.phone, resumeData.location, resumeData.linkedin]
                    .filter(Boolean)
                    .join(' | ')}
                </Box>

                {resumeData.summary && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>SUMMARY</Typography>
                    <Typography variant="body1">{resumeData.summary}</Typography>
                  </Box>
                )}

                {resumeData.experience.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>EXPERIENCE</Typography>
                    {resumeData.experience.map((exp, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {exp.title} - {exp.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {exp.dates}
                        </Typography>
                        <Typography variant="body1">{exp.description}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {resumeData.education.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>EDUCATION</Typography>
                    {resumeData.education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {edu.degree} - {edu.school}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.dates}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {resumeData.skills.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>SKILLS</Typography>
                    <Typography variant="body1">{resumeData.skills.join(', ')}</Typography>
                  </Box>
                )}

                {resumeData.projects.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>PROJECTS</Typography>
                    {resumeData.projects.map((project, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {project.name}
                        </Typography>
                        <Typography variant="body1">{project.description}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Feedback Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '80vh', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Real-Time Feedback
            </Typography>

            {/* ATS Score */}
            <Card sx={{ mb: 3, backgroundColor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getFeedbackIcon(feedback.atsScore)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    ATS Compatibility Score
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" color={`${getFeedbackColor(feedback.atsScore)}.main`}>
                    {feedback.atsScore}%
                  </Typography>
                  <Chip 
                    label={feedback.atsScore >= 80 ? 'Excellent' : feedback.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    color={getFeedbackColor(feedback.atsScore)}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {feedback.suggestions.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Improvement Suggestions
                  </Typography>
                  {feedback.suggestions.map((suggestion, index) => (
                    <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <InfoIcon sx={{ mr: 1, mt: 0.5, color: 'info.main' }} />
                      <Typography variant="body2">{suggestion}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Template Selection */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Template & Actions
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    label="Template"
                    size="small"
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => setSaveDialogOpen(true)}
                    disabled={loading}
                    size="small"
                  >
                    Save Version
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleGeneratePDF}
                    disabled={loading}
                    size="small"
                  >
                    Generate PDF
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Saved Versions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Saved Versions
                </Typography>
                
                {versions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No saved versions yet
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {versions.map((version) => (
                      <Box key={version.id} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {version.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {version.job_title} • {new Date(version.created_at).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <IconButton
                            onClick={() => loadVersion(version.id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteVersion(version.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Resume Version</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Version Name"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            margin="normal"
            placeholder="e.g., Software Engineer 2024"
          />
          <TextField
            fullWidth
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            margin="normal"
            placeholder="e.g., Software Engineer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveVersion} variant="contained" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        aria-label="quick actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setPreviewMode(!previewMode)}
      >
        <VisibilityIcon />
      </Fab>
    </Box>
  );
};

export default RealTimeEditor; 