import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { resumeBuilderService } from '../services/resumeBuilderService';

const ResumeBuilder = () => {
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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadVersions();
  }, []);

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

  const handleSaveAndGeneratePDF = async () => {
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
      const response = await resumeBuilderService.saveAndGeneratePDF(
        resumeData, versionName, jobTitle, selectedTemplate
      );
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${versionName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setAlert({
        open: true,
        message: 'Resume saved and PDF generated successfully!',
        severity: 'success'
      });
      setSaveDialogOpen(false);
      setVersionName('');
      setJobTitle('');
      loadVersions();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error saving and generating PDF',
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

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resume Builder
      </Typography>
      
      <Grid container spacing={3}>
        {/* Resume Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume Information
            </Typography>
            
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={resumeData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={resumeData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={resumeData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      value={resumeData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      margin="normal"
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company"
                          value={exp.company || ''}
                          onChange={(e) => handleArrayChange('experience', index, { ...exp, company: e.target.value })}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Dates"
                          value={exp.dates || ''}
                          onChange={(e) => handleArrayChange('experience', index, { ...exp, dates: e.target.value })}
                          margin="normal"
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="School"
                          value={edu.school || ''}
                          onChange={(e) => handleArrayChange('education', index, { ...edu, school: e.target.value })}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Dates"
                          value={edu.dates || ''}
                          onChange={(e) => handleArrayChange('education', index, { ...edu, dates: e.target.value })}
                          margin="normal"
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
                >
                  Add Project
                </Button>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        {/* Template Selection and Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Template & Actions
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                label="Template"
              >
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => setSaveDialogOpen(true)}
                disabled={loading}
                fullWidth
              >
                Save Version
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleGeneratePDF}
                disabled={loading}
                fullWidth
              >
                Generate PDF
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleSaveAndGeneratePDF}
                disabled={loading}
                fullWidth
              >
                Save & Generate PDF
              </Button>
            </Box>
          </Paper>

          {/* Saved Versions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Saved Versions
            </Typography>
            
            {versions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No saved versions yet
              </Typography>
            ) : (
              <List>
                {versions.map((version) => (
                  <React.Fragment key={version.id}>
                    <ListItem>
                      <ListItemText
                        primary={version.name}
                        secondary={`${version.job_title} • ${new Date(version.created_at).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
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
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
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
    </Box>
  );
};

export default ResumeBuilder; 