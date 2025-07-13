# ResuScan Backend

FastAPI backend for Resume Analyzer + ATS Matcher application.

## Features

- **Resume Parsing**: Extract information from PDF, DOCX, and other formats
- **ATS Compatibility Analysis**: Check resume against ATS systems
- **Skill Gap Analysis**: Identify missing skills for target job roles
- **Bullet Point Improvements**: AI-powered suggestions for better bullet points
- **Project/Course Recommendations**: Personalized learning recommendations

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables**
   - Copy `env_example.txt` to `.env`
   - Add your API keys:
     - GROQ_API_KEY: Get from https://console.groq.com/
     - OPENAI_API_KEY: Get from https://platform.openai.com/

3. **Install spaCy Model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Run the Server**
   ```bash
   python main.py
   ```
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### POST /upload-resume
Upload and parse a resume file.

### POST /analyze-ats
Analyze ATS compatibility for a specific job title.

### POST /skill-gap-analysis
Analyze skill gaps between resume and target job.

### POST /improve-bullet-points
Get AI-powered suggestions to improve bullet points.

### POST /recommend-projects-courses
Get personalized project and course recommendations.

### POST /comprehensive-analysis
Complete analysis including all features.

## Usage

The server will run on `http://localhost:8000`

API documentation available at `http://localhost:8000/docs` 