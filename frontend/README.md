# ResuScan Frontend

React frontend for the Resume Analyzer + ATS Matcher application.

## Features

- **Modern UI**: Built with Material-UI for a professional look
- **File Upload**: Drag and drop resume upload with support for PDF, DOCX, and DOC
- **ATS Analysis**: Real-time ATS compatibility scoring and keyword analysis
- **Skill Gap Analysis**: Visual representation of skills you have vs. need
- **Bullet Point Improvements**: AI-powered suggestions for better resume bullet points
- **Learning Recommendations**: Personalized project and course suggestions

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.jsx     # Navigation header
├── pages/              # Page components
│   ├── Home.jsx       # Landing page
│   └── ResumeAnalyzer.jsx  # Main analysis page
├── services/           # API services
│   └── api.js         # Backend API integration
└── App.jsx            # Main app component
```

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Material-UI**: Professional UI components
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Dropzone**: File upload functionality

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`. Make sure the backend server is running before using the application.

## Development

The development server runs on `http://localhost:5173` by default.

## Features Overview

1. **Home Page**: Attractive landing page with feature overview
2. **Resume Upload**: Drag and drop interface for resume files
3. **Job Selection**: Dropdown to select target job role
4. **Comprehensive Analysis**: 
   - ATS compatibility score
   - Skill gap analysis
   - Bullet point improvements
   - Learning recommendations
