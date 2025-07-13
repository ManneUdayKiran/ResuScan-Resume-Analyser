import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Assessment, 
  TrendingUp, 
  School, 
  WorkOutline,
  Upload,
  Analytics,
  Lightbulb,
  Book,
  Build,
  Download,
  Edit
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'ATS Compatibility',
      description: 'Check your resume against Applicant Tracking Systems to ensure it gets past the initial screening.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills for your target job role and understand what you need to learn.'
    },
    {
      icon: <Lightbulb sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Bullet Point Improvements',
      description: 'Get AI-powered suggestions to make your bullet points more impactful and ATS-friendly.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Learning Recommendations',
      description: 'Receive personalized project and course recommendations to fill your skill gaps.'
    },
    {
      icon: <Build sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Resume Builder',
      description: 'Create ATS-friendly resumes with professional templates and save multiple versions for different roles.'
    },
    {
      icon: <Download sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '1-Click PDF Export',
      description: 'Generate professional PDF resumes instantly with our optimized templates for maximum ATS compatibility.'
    },
    {
      icon: <Edit sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-Time Editor',
      description: 'WYSIWYG editor with instant feedback, live preview, and real-time ATS compatibility scoring as you type.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 3
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              ResuScan
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
              Resume Analyzer + ATS Matcher
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', opacity: 0.8 }}>
              Upload your resume and instantly scan it for ATS compatibility, skill gaps, 
              and get personalized improvement suggestions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Upload />}
              onClick={() => navigate('/analyze')}
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Start Analyzing
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
          What ResuScan Does
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card elevation={2} sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box textAlign="center" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom textAlign="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* How It Works */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            How It Works
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Upload sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  1. Upload Resume
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your resume in PDF, DOCX, or other common formats
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Analytics sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  2. AI Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI analyzes your resume for ATS compatibility and skill gaps
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Book sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  3. Get Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive personalized suggestions for improvements and learning
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Resume Builder Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Build Professional Resumes
          </Typography>
          
          <Card elevation={3} sx={{ p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Create ATS-Friendly Resumes
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Build professional resumes with our optimized templates designed to pass through Applicant Tracking Systems. 
                  Save multiple versions for different job roles and export to PDF with one click.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Build />}
                    onClick={() => navigate('/builder')}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Start Building
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/analyze')}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Analyze Existing
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ✓ Professional Templates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from multiple ATS-optimized templates
                    </Typography>
                  </Card>
                  <Card sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ✓ Resume Versioning
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Save different versions for different job roles
                    </Typography>
                  </Card>
                  <Card sx={{ p: 2, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ✓ 1-Click PDF Export
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate professional PDFs instantly
                    </Typography>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Real-Time Editor Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Real-Time Resume Editor
          </Typography>
          
          <Card elevation={3} sx={{ p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  WYSIWYG Editor with Instant Feedback
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Edit your resume in real-time with live preview and instant ATS compatibility scoring. 
                  Get immediate feedback as you type and see your changes reflected instantly.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Edit />}
                    onClick={() => navigate('/editor')}
                    sx={{ 
                      px: 3, 
                      py: 1.5,
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                  >
                    Start Editing
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ⚡ Live Preview
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      See your resume as it will appear to employers
                    </Typography>
                  </Card>
                  <Card sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📊 Real-Time Scoring
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Get instant ATS compatibility feedback
                    </Typography>
                  </Card>
                  <Card sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      💡 Smart Suggestions
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Receive improvement tips as you edit
                    </Typography>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* CTA Section */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Ready to optimize your resume?
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<WorkOutline />}
            onClick={() => navigate('/analyze')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Analyze Your Resume Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 