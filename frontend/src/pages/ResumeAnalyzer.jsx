import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CloudUpload,
  Assessment,
  TrendingUp,
  Lightbulb,
  School,
  ExpandMore,
  CheckCircle,
  Cancel,
  Warning,
  Star,
  LinkedIn,
  Visibility,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../services/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [linkedinImage, setLinkedinImage] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError('');
    },
  });

  const { getRootProps: getLinkedinRootProps, getInputProps: getLinkedinInputProps, isDragActive: isLinkedinDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      setLinkedinImage(acceptedFiles[0]);
      setError('');
    },
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }
    if (!jobTitle) {
      setError('Please select a job title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resumeAPI.comprehensiveAnalysis(file, jobTitle);
      setAnalysis(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedinAnalyze = async () => {
    if (!linkedinImage) {
      setError('Please upload a LinkedIn profile screenshot');
      return;
    }
    if (!jobTitle) {
      setError('Please select a job title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resumeAPI.analyzeLinkedin(linkedinImage, jobTitle);
      setLinkedinAnalysis(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during LinkedIn analysis');
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
      total_keywords_checked,
      improvement_tips,
      score_breakdown
    } = analysis.ats_analysis;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">ATS Compatibility Analysis</Typography>
          </Box>
          
          {/* Overall Score */}
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ mr: 2, color: ats_score >= 70 ? 'success.main' : ats_score >= 50 ? 'warning.main' : 'error.main' }}>
              {ats_score}/100
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overall ATS Compatibility Score
            </Typography>
          </Box>

          {/* Score Breakdown */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.main">
                  {score_breakdown.keywords}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keywords (40%)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.main">
                  {score_breakdown.format}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Format (30%)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.main">
                  {score_breakdown.readability}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Readability (20%)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.main">
                  {score_breakdown.structure}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structure (10%)
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Improvement Tips */}
          {improvement_tips && improvement_tips.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Improvement Tips
              </Typography>
              <List dense>
                {improvement_tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Keywords Analysis */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Matched Keywords ({matched_keywords.length}/{total_keywords_checked})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {matched_keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    color="success"
                    size="small"
                    icon={<CheckCircle />}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Missing Keywords
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {missing_keywords.slice(0, 10).map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    color="error"
                    size="small"
                    icon={<Cancel />}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderSkillGapResults = () => {
    if (!analysis?.skill_gap_analysis) return null;

    const { 
      skill_match_percentage, 
      existing_skills, 
      missing_skills, 
      total_skills_required,
      skills_you_have,
      skills_to_learn
    } = analysis.skill_gap_analysis;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Skill Gap Analysis</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ mr: 2, color: skill_match_percentage >= 70 ? 'success.main' : skill_match_percentage >= 50 ? 'warning.main' : 'error.main' }}>
              {skill_match_percentage}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Skill Match Percentage
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="success.main">{skills_you_have}</Typography>
              <Typography variant="body2" color="text.secondary">Skills You Have</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="error.main">{skills_to_learn}</Typography>
              <Typography variant="body2" color="text.secondary">Skills to Learn</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary.main">{total_skills_required}</Typography>
              <Typography variant="body2" color="text.secondary">Total Required</Typography>
            </Grid>
          </Grid>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>View Skills Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {existing_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills to Learn
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {missing_skills.slice(0, 10).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="error"
                        size="small"
                        icon={<Warning />}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  const renderBulletPointImprovements = () => {
    if (!analysis?.bullet_point_improvements?.improved_bullet_points) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Bullet Point Improvements</Typography>
          </Box>
          
          <List>
            {analysis.bullet_point_improvements.improved_bullet_points.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <Star color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Improved Version"
                    secondary={
                      <Box>
                        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                          {item.improved.split('\n').map((line, i) => (
                            <Typography key={i} variant="body2" component="div" sx={{ mb: 0.5 }}>
                              • {line.trim()}
                            </Typography>
                          ))}
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Original"
                    secondary={item.original}
                    sx={{ mb: 1 }}
                  />
                </ListItem>
                {index < analysis.bullet_point_improvements.improved_bullet_points.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderRecommendations = () => {
    if (!analysis?.recommendations) return null;

    const { projects, courses } = analysis.recommendations;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <School sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Learning Recommendations</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Recommended Projects
              </Typography>
              <List>
                {projects?.slice(0, 5).map((project, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Star color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={project.difficulty} 
                              size="small" 
                              color={project.difficulty === "Beginner" ? "success" : "warning"}
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={project.duration} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Skills: {project.skills_developed?.join(', ')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Recommended Courses
              </Typography>
              <List>
                {courses?.slice(0, 5).map((course, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {course.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={course.platform} 
                              size="small" 
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={course.duration} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={course.level} 
                              size="small" 
                              color={course.level.includes("Beginner") ? "success" : "warning"}
                            />
                          </Box>
                          {course.url && (
                            <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                              <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                View Course →
                              </a>
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderLinkedinResults = () => {
    if (!linkedinAnalysis) return null;

    const { 
      profile_score, 
      visibility_score, 
      sections, 
      optimization_tips, 
      keyword_optimization 
    } = linkedinAnalysis;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <LinkedIn sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">LinkedIn Profile Analysis</Typography>
          </Box>
          
          {/* Scores */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h4" color="primary.main">
                  {profile_score}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profile Strength Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign="center" p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h4" color="primary.main">
                  {visibility_score}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visibility Score
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Profile Sections */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Profile Section Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Headline
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {sections.headline?.text || 'Not found'}
                  </Typography>
                  <Chip 
                    label={sections.headline?.has_title ? 'Has Title' : 'Missing Title'} 
                    color={sections.headline?.has_title ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {sections.summary?.word_count || 0} words
                  </Typography>
                  <Chip 
                    label={sections.summary?.has_content ? 'Has Content' : 'Missing Content'} 
                    color={sections.summary?.has_content ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Experience
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {sections.experience?.count || 0} entries
                  </Typography>
                  <Chip 
                    label={sections.experience?.has_descriptions ? 'Has Descriptions' : 'Missing Descriptions'} 
                    color={sections.experience?.has_descriptions ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {sections.skills?.count || 0} skills listed
                  </Typography>
                  <Chip 
                    label={sections.skills?.has_endorsements ? 'Has Endorsements' : 'No Endorsements'} 
                    color={sections.skills?.has_endorsements ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Optimization Tips */}
          {optimization_tips && optimization_tips.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Optimization Tips
              </Typography>
              <List dense>
                {optimization_tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Lightbulb color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Keyword Optimization */}
          {keyword_optimization && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Keyword Optimization ({keyword_optimization.keyword_density}% match)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" gutterBottom>
                    Matched Keywords ({keyword_optimization.keywords_found}/{keyword_optimization.total_keywords})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {keyword_optimization.matched_keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" gutterBottom>
                    Missing Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {keyword_optimization.missing_keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        color="error"
                        size="small"
                        icon={<Cancel />}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resume & LinkedIn Analyzer
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Resume Analysis" icon={<Assessment />} />
        <Tab label="LinkedIn Analysis" icon={<LinkedIn />} />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Your Resume
          </Typography>
          
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
              cursor: 'pointer',
              mb: 3,
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop the file here' : 'Drag & drop a resume file here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PDF, DOCX, and DOC files
            </Typography>
            {file && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Job Title</InputLabel>
            <Select
              value={jobTitle}
              label="Select Job Title"
              onChange={(e) => setJobTitle(e.target.value)}
            >
              {jobTitles.map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            onClick={handleAnalyze}
            disabled={!file || !jobTitle || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
            fullWidth
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload LinkedIn Profile Screenshot
          </Typography>
          
          <Box
            {...getLinkedinRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isLinkedinDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: isLinkedinDragActive ? 'primary.50' : 'grey.50',
              cursor: 'pointer',
              mb: 3,
            }}
          >
            <input {...getLinkedinInputProps()} />
            <LinkedIn sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isLinkedinDragActive ? 'Drop the image here' : 'Drag & drop LinkedIn screenshot here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PNG, JPG, JPEG, and GIF files
            </Typography>
            {linkedinImage && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Selected: {linkedinImage.name}
              </Typography>
            )}
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Job Title</InputLabel>
            <Select
              value={jobTitle}
              label="Select Job Title"
              onChange={(e) => setJobTitle(e.target.value)}
            >
              {jobTitles.map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            onClick={handleLinkedinAnalyze}
            disabled={!linkedinImage || !jobTitle || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Visibility />}
            fullWidth
          >
            {loading ? 'Analyzing...' : 'Analyze LinkedIn Profile'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      )}

      {analysis && activeTab === 0 && (
        <Box>
          {renderATSResults()}
          {renderSkillGapResults()}
          {renderBulletPointImprovements()}
          {renderRecommendations()}
        </Box>
      )}

      {linkedinAnalysis && activeTab === 1 && (
        <Box>
          {renderLinkedinResults()}
        </Box>
      )}
    </Box>
  );
};

export default ResumeAnalyzer; 