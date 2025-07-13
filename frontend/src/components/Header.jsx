import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assessment, Home, Build, Edit } from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Assessment sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          ResuScan
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Assessment />}
            onClick={() => navigate('/analyze')}
          >
            Analyze Resume
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Build />}
            onClick={() => navigate('/builder')}
          >
            Resume Builder
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Edit />}
            onClick={() => navigate('/editor')}
          >
            Real-Time Editor
          </Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;