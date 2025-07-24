# ResuScan: Resume Analyzer + ATS Matcher

A comprehensive resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and provides personalized improvement suggestions.

visit my app at:https://frontend-two-pi-49.vercel.app/

## 🚀 Features

### ✅ ATS Compatibility Analysis
- Check resume against ATS systems
- Keyword matching and scoring
- Identify missing keywords for specific job roles
- Real-time compatibility score

### ✅ Skill Gap Analysis
- Compare your skills with job requirements
- Visual representation of skill gaps
- Identify missing skills for target roles
- Skill match percentage calculation

### ✅ Bullet Point Improvements
- AI-powered suggestions for better bullet points
- Action verb recommendations
- Quantifiable metrics suggestions
- ATS-friendly formatting

### ✅ Learning Recommendations
- Personalized project suggestions
- Course recommendations based on skill gaps
- Platform-specific learning paths
- Skill development roadmap

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Material-UI** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **React Dropzone** for file uploads

### Backend
- **FastAPI** for high-performance API
- **ResumeParser** for document parsing
- **Groq** for AI-powered analysis
- **spaCy** for NLP processing
- **NLTK** for text analysis

## 📁 Project Structure

```
ResumeAnalyzer/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   └── services/   # API services
│   └── README.md
├── backend/            # FastAPI backend
│   ├── main.py         # Main API server
│   ├── requirements.txt # Python dependencies
│   └── README.md
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Groq API key (get from https://console.groq.com/)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ResumeAnalyzer
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create .env file from env_example.txt
cp env_example.txt .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📋 API Endpoints

### POST /upload-resume
Upload and parse resume files (PDF, DOCX, DOC)

### POST /analyze-ats
Analyze ATS compatibility for specific job titles

### POST /skill-gap-analysis
Analyze skill gaps between resume and target job

### POST /improve-bullet-points
Get AI-powered bullet point improvement suggestions

### POST /recommend-projects-courses
Get personalized learning recommendations

### POST /comprehensive-analysis
Complete analysis including all features

## 🎯 How to Use

1. **Upload Resume**: Drag and drop your resume file
2. **Select Job Title**: Choose your target role
3. **Get Analysis**: Receive comprehensive feedback including:
   - ATS compatibility score
   - Skill gap analysis
   - Bullet point improvements
   - Learning recommendations

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### API Keys
- **Groq API**: Required for AI-powered analysis
- **OpenAI API**: Optional, for additional AI features

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Features in Detail

### ATS Compatibility
- Analyzes resume against job-specific keywords
- Provides compatibility score (0-100%)
- Identifies matched and missing keywords
- Suggests keyword improvements

### Skill Gap Analysis
- Extracts skills from resume text
- Compares with job requirements
- Visualizes skill gaps
- Provides learning roadmap

### Bullet Point Improvements
- AI-powered suggestions
- Action verb recommendations
- Quantifiable metrics
- ATS-friendly formatting

### Learning Recommendations
- Project suggestions based on skill gaps
- Course recommendations from popular platforms
- Personalized learning paths
- Skill development timeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for job seekers everywhere** 
