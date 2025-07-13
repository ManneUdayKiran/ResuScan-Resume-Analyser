from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from dotenv import load_dotenv
import os
import json
from typing import List, Dict, Any
import groq
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
import pdfplumber
from docx import Document
import cv2
import pytesseract
from PIL import Image
import numpy as np
import io
from datetime import datetime
import uuid
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
import requests
import base64

# Load environment variables
load_dotenv()

app = FastAPI(title="ResuScan API", description="Resume Analyzer + ATS Matcher")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model not found, download it
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# LinkedIn API Configuration
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:5173/linkedin-callback")
LINKEDIN_API_BASE_URL = "https://api.linkedin.com/v2"

# Resume versioning storage
RESUME_VERSIONS_FILE = "resume_versions.json"
resume_versions = {}

# Load existing resume versions
def load_resume_versions():
    global resume_versions
    if os.path.exists(RESUME_VERSIONS_FILE):
        try:
            with open(RESUME_VERSIONS_FILE, 'r') as f:
                resume_versions = json.load(f)
        except:
            resume_versions = {}

def save_resume_versions():
    with open(RESUME_VERSIONS_FILE, 'w') as f:
        json.dump(resume_versions, f, indent=2)

# Initialize resume versions
load_resume_versions()

# ATS-friendly resume templates
RESUME_TEMPLATES = {
    "professional": {
        "name": "Professional",
        "description": "Clean, traditional format suitable for most industries",
        "font_size": 11,
        "line_spacing": 1.2,
        "margins": (0.75, 0.75, 0.75, 0.75),
        "header_style": "bold",
        "section_spacing": 0.2
    },
    "modern": {
        "name": "Modern",
        "description": "Contemporary design with better visual hierarchy",
        "font_size": 10,
        "line_spacing": 1.3,
        "margins": (0.8, 0.8, 0.8, 0.8),
        "header_style": "bold_underline",
        "section_spacing": 0.25
    },
    "minimal": {
        "name": "Minimal",
        "description": "Simple, text-focused format for maximum ATS compatibility",
        "font_size": 12,
        "line_spacing": 1.1,
        "margins": (0.5, 0.5, 0.5, 0.5),
        "header_style": "bold",
        "section_spacing": 0.15
    }
}

# ATS Keywords database
ATS_KEYWORDS = {
    "software_engineer": [
        "python", "javascript", "react", "node.js", "sql", "git", "docker", "kubernetes",
        "aws", "azure", "machine learning", "api", "rest", "graphql", "microservices",
        "agile", "scrum", "tdd", "ci/cd", "jenkins", "jira", "confluence"
    ],
    "data_scientist": [
        "python", "r", "sql", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
        "matplotlib", "seaborn", "plotly", "jupyter", "spark", "hadoop", "kafka",
        "machine learning", "deep learning", "nlp", "computer vision", "statistics"
    ],
    "product_manager": [
        "agile", "scrum", "kanban", "jira", "confluence", "figma", "sketch", "product strategy",
        "user research", "a/b testing", "analytics", "sql", "excel", "powerpoint",
        "roadmapping", "stakeholder management", "market analysis", "competitive analysis"
    ],
    "marketing": [
        "google analytics", "facebook ads", "google ads", "seo", "sem", "content marketing",
        "social media", "email marketing", "mailchimp", "hubspot", "salesforce", "crm",
        "conversion optimization", "a/b testing", "branding", "market research"
    ]
}

@app.get("/")
async def root():
    return {"message": "ResuScan API - Resume Analyzer + ATS Matcher"}

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from PDF or DOCX file
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext == ".pdf":
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    elif ext == ".docx":
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")
    return text

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and parse resume (PDF/DOCX)
    """
    try:
        # Save uploaded file temporarily
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract text
        resume_text = extract_text_from_file(file_path)
        
        # Clean up temp file
        os.remove(file_path)
        
        return {
            "success": True,
            "resume_text": resume_text,
            "message": "Resume parsed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/analyze-ats")
async def analyze_ats_compatibility(
    resume_text: str = Form(...),
    job_title: str = Form(...)
):
    """
    Analyze ATS compatibility with comprehensive scoring
    """
    try:
        # Get relevant keywords for the job title
        job_keywords = ATS_KEYWORDS.get(job_title.lower().replace(" ", "_"), [])
        
        # Analyze resume text
        resume_lower = resume_text.lower()
        matched_keywords = [keyword for keyword in job_keywords if keyword.lower() in resume_lower]
        
        # Calculate keyword score (40% of total)
        keyword_score = min(100, (len(matched_keywords) / len(job_keywords)) * 100) if job_keywords else 0
        
        # Analyze format and structure
        format_score = analyze_resume_format(resume_text)
        
        # Analyze readability
        readability_score = analyze_readability(resume_text)
        
        # Analyze content structure
        structure_score = analyze_content_structure(resume_text)
        
        # Calculate overall ATS score (weighted average)
        ats_score = (
            keyword_score * 0.4 +      # 40% - Keywords
            format_score * 0.3 +       # 30% - Format
            readability_score * 0.2 +  # 20% - Readability
            structure_score * 0.1      # 10% - Structure
        )
        
        # Generate improvement suggestions
        missing_keywords = [keyword for keyword in job_keywords if keyword.lower() not in resume_lower]
        improvement_tips = generate_improvement_tips(resume_text, keyword_score, format_score, readability_score, structure_score)
        
        return {
            "ats_score": round(ats_score, 2),
            "keyword_score": round(keyword_score, 2),
            "format_score": round(format_score, 2),
            "readability_score": round(readability_score, 2),
            "structure_score": round(structure_score, 2),
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords[:10],  # Top 10 missing keywords
            "total_keywords_checked": len(job_keywords),
            "keywords_matched": len(matched_keywords),
            "improvement_tips": improvement_tips,
            "score_breakdown": {
                "keywords": f"{keyword_score:.1f}/100",
                "format": f"{format_score:.1f}/100",
                "readability": f"{readability_score:.1f}/100",
                "structure": f"{structure_score:.1f}/100"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing ATS compatibility: {str(e)}")

def analyze_resume_format(resume_text: str) -> float:
    """Analyze resume format for ATS compatibility"""
    score = 100.0
    issues = []
    
    # Check for common ATS-unfriendly elements
    lines = resume_text.split('\n')
    
    # Check for tables (indicated by multiple spaces or tabs)
    table_indicators = 0
    for line in lines:
        if '\t' in line or line.count('  ') > 3:
            table_indicators += 1
    
    if table_indicators > len(lines) * 0.1:  # More than 10% of lines have table formatting
        score -= 20
        issues.append("Avoid tables - use simple text formatting")
    
    # Check for graphics indicators (ASCII art, excessive symbols)
    graphic_indicators = 0
    for line in lines:
        if any(char in line for char in ['█', '▓', '▒', '░', '═', '║', '╔', '╗', '╚', '╝']):
            graphic_indicators += 1
    
    if graphic_indicators > 0:
        score -= 15
        issues.append("Remove graphics and ASCII art - use plain text")
    
    # Check for inconsistent formatting
    font_sizes = []
    for line in lines:
        if line.strip():
            # Simple heuristic for font size detection
            if line.isupper():
                font_sizes.append('large')
            elif line.strip() and not line.strip()[0].isupper():
                font_sizes.append('small')
            else:
                font_sizes.append('normal')
    
    if len(set(font_sizes)) > 2:  # Too many different font sizes
        score -= 10
        issues.append("Use consistent font sizes throughout")
    
    # Check for excessive formatting
    formatting_chars = sum(1 for char in resume_text if char in ['*', '**', '___', '###'])
    if formatting_chars > len(resume_text) * 0.01:  # More than 1% formatting characters
        score -= 10
        issues.append("Minimize special formatting - use plain text")
    
    return max(0, score)

def analyze_readability(resume_text: str) -> float:
    """Analyze resume readability"""
    score = 100.0
    
    # Calculate basic readability metrics
    sentences = resume_text.split('.')
    words = resume_text.split()
    
    if len(words) == 0:
        return 0
    
    # Average sentence length
    avg_sentence_length = len(words) / len(sentences) if sentences else 0
    if avg_sentence_length > 25:  # Too long sentences
        score -= 20
    elif avg_sentence_length < 5:  # Too short sentences
        score -= 10
    
    # Check for bullet points
    bullet_points = sum(1 for line in resume_text.split('\n') if line.strip().startswith(('•', '-', '*', '○')))
    if bullet_points < 3:  # Not enough bullet points
        score -= 15
    elif bullet_points > 20:  # Too many bullet points
        score -= 10
    
    # Check for action verbs
    action_verbs = ['developed', 'implemented', 'created', 'managed', 'led', 'designed', 'built', 'optimized', 'improved', 'increased', 'reduced', 'achieved', 'delivered', 'coordinated', 'facilitated', 'established', 'maintained', 'performed', 'conducted', 'analyzed', 'researched', 'collaborated', 'mentored', 'trained', 'supervised']
    
    action_verb_count = sum(1 for word in words if word.lower() in action_verbs)
    action_verb_ratio = action_verb_count / len(words) if words else 0
    
    if action_verb_ratio < 0.02:  # Less than 2% action verbs
        score -= 20
    elif action_verb_ratio > 0.1:  # More than 10% action verbs (might be repetitive)
        score -= 5
    
    return max(0, score)

def analyze_content_structure(resume_text: str) -> float:
    """Analyze resume content structure"""
    score = 100.0
    
    # Check for essential sections
    sections = ['experience', 'education', 'skills', 'contact', 'summary', 'objective']
    found_sections = sum(1 for section in sections if section.lower() in resume_text.lower())
    
    if found_sections < 3:  # Missing essential sections
        score -= 30
    elif found_sections < 4:
        score -= 15
    
    # Check for contact information
    contact_indicators = ['@', '.com', 'phone', 'email', 'linkedin']
    has_contact = any(indicator in resume_text.lower() for indicator in contact_indicators)
    if not has_contact:
        score -= 20
    
    # Check for dates (experience timeline)
    date_patterns = ['202', '201', '200', 'present', 'current']
    has_dates = any(pattern in resume_text.lower() for pattern in date_patterns)
    if not has_dates:
        score -= 15
    
    # Check for company names
    company_indicators = ['inc', 'corp', 'ltd', 'company', 'llc']
    has_companies = any(indicator in resume_text.lower() for indicator in company_indicators)
    if not has_companies:
        score -= 10
    
    return max(0, score)

def generate_improvement_tips(resume_text: str, keyword_score: float, format_score: float, readability_score: float, structure_score: float) -> List[str]:
    """Generate specific improvement tips based on scores"""
    tips = []
    
    # Keyword-based tips
    if keyword_score < 70:
        tips.append("Add more job-specific keywords from the job description")
        tips.append("Include industry-standard terminology and acronyms")
    
    # Format-based tips
    if format_score < 80:
        tips.append("Use consistent font size (12pt recommended)")
        tips.append("Avoid graphics, tables, and special formatting")
        tips.append("Use simple bullet points (•) instead of special characters")
        tips.append("Save as PDF to preserve formatting")
    
    # Readability tips
    if readability_score < 75:
        tips.append("Use action verbs to start bullet points")
        tips.append("Keep sentences concise (15-20 words maximum)")
        tips.append("Use bullet points to highlight achievements")
        tips.append("Quantify achievements with numbers and percentages")
    
    # Structure tips
    if structure_score < 80:
        tips.append("Include clear section headers (Experience, Education, Skills)")
        tips.append("Add contact information at the top")
        tips.append("Include dates for all experience entries")
        tips.append("List company names and job titles clearly")
    
    # General tips
    if len(tips) < 3:
        tips.append("Keep resume to 1-2 pages maximum")
        tips.append("Use reverse chronological order for experience")
        tips.append("Include relevant certifications and training")
    
    return tips[:8]  # Return top 8 tips

@app.post("/skill-gap-analysis")
async def skill_gap_analysis(
    resume_text: str = Form(...),
    target_job: str = Form(...)
):
    """
    Analyze skill gaps for target job
    """
    try:
        # Extract skills from resume
        doc = nlp(resume_text)
        resume_skills = extract_skills_from_text(resume_text)
        
        # Get required skills for target job
        required_skills = get_required_skills_for_job(target_job)
        
        # Find skill gaps
        missing_skills = [skill for skill in required_skills if skill.lower() not in [s.lower() for s in resume_skills]]
        existing_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in resume_skills]]
        
        # Calculate skill match percentage
        skill_match_percentage = (len(existing_skills) / len(required_skills)) * 100 if required_skills else 0
        
        return {
            "resume_skills": resume_skills,
            "required_skills": required_skills,
            "missing_skills": missing_skills,
            "existing_skills": existing_skills,
            "skill_match_percentage": round(skill_match_percentage, 2),
            "total_skills_required": len(required_skills),
            "skills_you_have": len(existing_skills),
            "skills_to_learn": len(missing_skills)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing skill gaps: {str(e)}")

@app.post("/improve-bullet-points")
async def improve_bullet_points(
    bullet_points: List[str] = Form(...),
    job_title: str = Form(...)
):
    """
    Improve bullet points using AI
    """
    try:
        improved_points = []
        
        for bullet in bullet_points:
            prompt = f"""
            Improve this bullet point for a {job_title} resume.
            
            Original: {bullet}
            
            Write ONLY the improved bullet point. Do not include:
            - Explanations
            - Numbered lists
            - Markdown formatting
            - "Improved version" text
            - Multiple bullet points
            
            The improved bullet point should:
            - Start with a strong action verb
            - Include quantifiable metrics if possible
            - Show impact and results
            - Use relevant keywords for {job_title}
            - Be 1-2 sentences maximum
            
            Return only the single improved bullet point text.
            """
            
            response = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="gemma2-9b-it",
                temperature=0.7,
                max_tokens=1024
            )
            
            improved_bullet = response.choices[0].message.content.strip()
            
            # Clean up the response - remove any markdown formatting and extra text
            improved_bullet = improved_bullet.replace('**', '').replace('*', '')
            improved_bullet = improved_bullet.replace('•', '').replace('-', '')
            
            # Remove any explanatory text and keep only the bullet point
            if ':' in improved_bullet:
                improved_bullet = improved_bullet.split(':')[-1].strip()
            if improved_bullet.startswith('Improved'):
                improved_bullet = improved_bullet.replace('Improved Version:', '').replace('Improved version:', '').strip()
            
            # Remove numbered lists and incomplete sentences
            lines = improved_bullet.split('\n')
            cleaned_lines = []
            for line in lines:
                line = line.strip()
                # Skip empty lines, numbered items, and incomplete sentences
                if (line and 
                    not line.startswith('•') and 
                    not line.startswith('-') and
                    not line.startswith('1.') and
                    not line.startswith('2.') and
                    not line.startswith('3.') and
                    not line.startswith('4.') and
                    not line.startswith('5.') and
                    not line.startswith('This improved') and
                    not line.startswith('Here\'s an improved') and
                    not line.startswith('Starts with') and
                    not line.startswith('Includes') and
                    not line.startswith('Shows') and
                    not line.startswith('Uses') and
                    not line.startswith('Be concise') and
                    not line.startswith('Return only') and
                    not line.startswith('Programming Languages') and
                    not line.startswith('**') and
                    not line.startswith('*') and
                    len(line) > 10):  # Only keep substantial content
                    cleaned_lines.append(line)
            
            improved_bullet = '\n'.join(cleaned_lines)
            
            improved_points.append({
                "original": bullet,
                "improved": improved_bullet
            })
        
        return {
            "improved_bullet_points": improved_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error improving bullet points: {str(e)}")

@app.post("/recommend-projects-courses")
async def recommend_projects_courses(
    missing_skills: List[str] = Form(...),
    job_title: str = Form(...)
):
    """
    Recommend projects and courses to fill skill gaps
    """
    try:
        recommendations = {
            "projects": [],
            "courses": []
        }
        
        # Pre-defined course and project recommendations
        course_database = {
            "python": [
                {
                    "name": "Python for Everybody",
                    "platform": "Coursera (University of Michigan)",
                    "description": "Free comprehensive Python course covering basics to advanced concepts",
                    "url": "https://www.coursera.org/specializations/python",
                    "duration": "4 months",
                    "level": "Beginner to Intermediate"
                },
                {
                    "name": "CS50's Introduction to Programming with Python",
                    "platform": "edX (Harvard)",
                    "description": "Free Harvard course on Python programming fundamentals",
                    "url": "https://www.edx.org/course/cs50s-introduction-to-programming-with-python",
                    "duration": "9 weeks",
                    "level": "Beginner"
                },
                {
                    "name": "Python Tutorial for Beginners",
                    "platform": "YouTube (Programming with Mosh)",
                    "description": "Free 6-hour comprehensive Python tutorial",
                    "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                    "duration": "6 hours",
                    "level": "Beginner"
                }
            ],
            "javascript": [
                {
                    "name": "JavaScript Algorithms and Data Structures",
                    "platform": "freeCodeCamp",
                    "description": "Free comprehensive JavaScript course with certifications",
                    "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
                    "duration": "300 hours",
                    "level": "Beginner to Advanced"
                },
                {
                    "name": "The Complete JavaScript Course 2024",
                    "platform": "YouTube (Jonas Schmedtmann)",
                    "description": "Free modern JavaScript course with real-world projects",
                    "url": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                    "duration": "12 hours",
                    "level": "Beginner to Intermediate"
                }
            ],
            "react": [
                {
                    "name": "React Tutorial for Beginners",
                    "platform": "YouTube (Programming with Mosh)",
                    "description": "Free React.js tutorial with hands-on projects",
                    "url": "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                    "duration": "3 hours",
                    "level": "Beginner"
                },
                {
                    "name": "React Full Course for Beginners",
                    "platform": "YouTube (freeCodeCamp)",
                    "description": "Complete React course with 8 projects",
                    "url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
                    "duration": "8 hours",
                    "level": "Beginner to Intermediate"
                }
            ],
            "sql": [
                {
                    "name": "SQL for Data Science",
                    "platform": "Coursera (UC Davis)",
                    "description": "Free SQL course focused on data science applications",
                    "url": "https://www.coursera.org/learn/sql-for-data-science",
                    "duration": "4 weeks",
                    "level": "Beginner"
                },
                {
                    "name": "Learn SQL In 60 Minutes",
                    "platform": "YouTube (Web Dev Simplified)",
                    "description": "Quick SQL tutorial covering all basics",
                    "url": "https://www.youtube.com/watch?v=p3qvj9hO_Bo",
                    "duration": "1 hour",
                    "level": "Beginner"
                }
            ],
            "machine learning": [
                {
                    "name": "Machine Learning Course",
                    "platform": "Coursera (Stanford)",
                    "description": "Free machine learning course by Andrew Ng",
                    "url": "https://www.coursera.org/learn/machine-learning",
                    "duration": "11 weeks",
                    "level": "Intermediate"
                },
                {
                    "name": "Machine Learning for Beginners",
                    "platform": "YouTube (freeCodeCamp)",
                    "description": "Complete ML course with Python",
                    "url": "https://www.youtube.com/watch?v=KNAWp2S3w94",
                    "duration": "3 hours",
                    "level": "Beginner"
                }
            ],
            "aws": [
                {
                    "name": "AWS Cloud Practitioner",
                    "platform": "AWS Training",
                    "description": "Free AWS fundamentals course",
                    "url": "https://aws.amazon.com/training/",
                    "duration": "6 hours",
                    "level": "Beginner"
                },
                {
                    "name": "AWS Tutorial for Beginners",
                    "platform": "YouTube (Simplilearn)",
                    "description": "Free AWS tutorial covering core services",
                    "url": "https://www.youtube.com/watch?v=ulprqHHW9ng",
                    "duration": "4 hours",
                    "level": "Beginner"
                }
            ]
        }
        
        project_database = {
            "python": [
                {
                    "name": "Personal Finance Tracker",
                    "description": "Build a web app to track income, expenses, and savings with data visualization",
                    "skills_developed": ["Python", "Web Development", "Data Analysis", "SQL"],
                    "difficulty": "Beginner",
                    "duration": "2-3 weeks",
                    "tech_stack": ["Flask/Django", "SQLite", "Chart.js"]
                },
                {
                    "name": "Weather App with API",
                    "description": "Create a weather application that fetches data from weather APIs",
                    "skills_developed": ["Python", "API Integration", "HTTP Requests", "JSON"],
                    "difficulty": "Beginner",
                    "duration": "1-2 weeks",
                    "tech_stack": ["Requests", "Tkinter", "OpenWeather API"]
                },
                {
                    "name": "Data Analysis Dashboard",
                    "description": "Analyze a dataset and create interactive visualizations",
                    "skills_developed": ["Python", "Pandas", "Matplotlib", "Data Analysis"],
                    "difficulty": "Intermediate",
                    "duration": "2-3 weeks",
                    "tech_stack": ["Pandas", "Matplotlib", "Jupyter"]
                }
            ],
            "javascript": [
                {
                    "name": "Todo List App",
                    "description": "Build a todo application with local storage and CRUD operations",
                    "skills_developed": ["JavaScript", "DOM Manipulation", "Local Storage", "CSS"],
                    "difficulty": "Beginner",
                    "duration": "1 week",
                    "tech_stack": ["HTML", "CSS", "JavaScript"]
                },
                {
                    "name": "Weather Dashboard",
                    "description": "Create a weather dashboard with multiple city support",
                    "skills_developed": ["JavaScript", "API Integration", "Async/Await", "Fetch API"],
                    "difficulty": "Beginner",
                    "duration": "2 weeks",
                    "tech_stack": ["HTML", "CSS", "JavaScript", "Weather API"]
                },
                {
                    "name": "E-commerce Product Page",
                    "description": "Build a product page with cart functionality and filters",
                    "skills_developed": ["JavaScript", "State Management", "Event Handling", "CSS Grid"],
                    "difficulty": "Intermediate",
                    "duration": "2-3 weeks",
                    "tech_stack": ["HTML", "CSS", "JavaScript"]
                }
            ],
            "react": [
                {
                    "name": "Personal Portfolio",
                    "description": "Create a responsive portfolio website with React components",
                    "skills_developed": ["React", "Component Architecture", "Responsive Design", "CSS"],
                    "difficulty": "Beginner",
                    "duration": "2 weeks",
                    "tech_stack": ["React", "CSS", "React Router"]
                },
                {
                    "name": "Task Management App",
                    "description": "Build a Trello-like task management application",
                    "skills_developed": ["React", "State Management", "Drag & Drop", "Local Storage"],
                    "difficulty": "Intermediate",
                    "duration": "3-4 weeks",
                    "tech_stack": ["React", "react-beautiful-dnd", "CSS"]
                },
                {
                    "name": "E-commerce Store",
                    "description": "Create a full e-commerce site with product catalog and cart",
                    "skills_developed": ["React", "Context API", "Routing", "API Integration"],
                    "difficulty": "Intermediate",
                    "duration": "4-5 weeks",
                    "tech_stack": ["React", "React Router", "Context API", "CSS"]
                }
            ],
            "sql": [
                {
                    "name": "Library Management System",
                    "description": "Design and implement a database for a library system",
                    "skills_developed": ["SQL", "Database Design", "ERD", "Normalization"],
                    "difficulty": "Beginner",
                    "duration": "2 weeks",
                    "tech_stack": ["MySQL/PostgreSQL", "ERD Tool"]
                },
                {
                    "name": "E-commerce Database",
                    "description": "Create a comprehensive database for an online store",
                    "skills_developed": ["SQL", "Complex Queries", "Joins", "Indexing"],
                    "difficulty": "Intermediate",
                    "duration": "3 weeks",
                    "tech_stack": ["MySQL/PostgreSQL", "Database Design"]
                }
            ],
            "machine learning": [
                {
                    "name": "House Price Predictor",
                    "description": "Build a ML model to predict house prices using regression",
                    "skills_developed": ["Python", "Scikit-learn", "Data Preprocessing", "Model Evaluation"],
                    "difficulty": "Intermediate",
                    "duration": "3-4 weeks",
                    "tech_stack": ["Python", "Scikit-learn", "Pandas", "Matplotlib"]
                },
                {
                    "name": "Sentiment Analysis Tool",
                    "description": "Create a tool that analyzes sentiment of text data",
                    "skills_developed": ["NLP", "Text Processing", "Classification", "Model Training"],
                    "difficulty": "Intermediate",
                    "duration": "4 weeks",
                    "tech_stack": ["Python", "NLTK", "Scikit-learn", "Flask"]
                }
            ],
            "aws": [
                {
                    "name": "Static Website Hosting",
                    "description": "Deploy a static website using AWS S3 and CloudFront",
                    "skills_developed": ["AWS S3", "CloudFront", "Static Hosting", "DNS"],
                    "difficulty": "Beginner",
                    "duration": "1 week",
                    "tech_stack": ["AWS S3", "CloudFront", "Route 53"]
                },
                {
                    "name": "Serverless API",
                    "description": "Build a serverless API using AWS Lambda and API Gateway",
                    "skills_developed": ["AWS Lambda", "API Gateway", "Serverless", "JSON"],
                    "difficulty": "Intermediate",
                    "duration": "2-3 weeks",
                    "tech_stack": ["AWS Lambda", "API Gateway", "DynamoDB"]
                }
            ]
        }
        
        # Generate recommendations based on missing skills
        for skill in missing_skills[:5]:  # Top 5 missing skills
            skill_lower = skill.lower()
            
            # Find matching courses
            for skill_key, courses in course_database.items():
                if skill_key in skill_lower or skill_lower in skill_key:
                    recommendations["courses"].extend(courses[:2])  # Add 2 courses per skill
                    break
            
            # Find matching projects
            for skill_key, projects in project_database.items():
                if skill_key in skill_lower or skill_lower in skill_key:
                    recommendations["projects"].extend(projects[:2])  # Add 2 projects per skill
                    break
        
        # If no specific matches, provide general recommendations
        if not recommendations["courses"]:
            recommendations["courses"] = course_database.get("python", [])[:2]
        if not recommendations["projects"]:
            recommendations["projects"] = project_database.get("python", [])[:2]
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.post("/comprehensive-analysis")
async def comprehensive_analysis(
    file: UploadFile = File(...),
    job_title: str = Form(...)
):
    """
    Comprehensive resume analysis including all features
    """
    try:
        # Parse resume
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract text
        resume_text = extract_text_from_file(file_path)
        
        # ATS Analysis
        ats_result = await analyze_ats_compatibility(resume_text, job_title)
        
        # Skill Gap Analysis
        skill_gap_result = await skill_gap_analysis(resume_text, job_title)
        
        # Improve bullet points
        bullet_points = extract_bullet_points(resume_text)
        bullet_improvements = await improve_bullet_points(bullet_points, job_title)
        
        # Get recommendations
        recommendations = await recommend_projects_courses(skill_gap_result['missing_skills'], job_title)
        
        # Clean up temp file
        os.remove(file_path)
        
        return {
            "resume_text": resume_text,
            "ats_analysis": ats_result,
            "skill_gap_analysis": skill_gap_result,
            "bullet_point_improvements": bullet_improvements,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in comprehensive analysis: {str(e)}")

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from resume text"""
    # Common technical skills
    technical_skills = [
        "python", "javascript", "java", "c++", "react", "angular", "vue", "node.js",
        "sql", "mongodb", "postgresql", "mysql", "aws", "azure", "docker", "kubernetes",
        "git", "jenkins", "jira", "agile", "scrum", "machine learning", "ai", "nlp",
        "data analysis", "excel", "powerpoint", "photoshop", "figma", "sketch"
    ]
    
    text_lower = text.lower()
    found_skills = [skill for skill in technical_skills if skill in text_lower]
    
    return found_skills

def get_required_skills_for_job(job_title: str) -> List[str]:
    """Get required skills for a specific job title"""
    job_skills_map = {
        "software engineer": [
            "python", "javascript", "java", "react", "node.js", "sql", "git", "docker",
            "aws", "agile", "scrum", "api", "rest", "microservices"
        ],
        "data scientist": [
            "python", "r", "sql", "pandas", "numpy", "scikit-learn", "tensorflow",
            "machine learning", "statistics", "data analysis", "jupyter"
        ],
        "product manager": [
            "agile", "scrum", "jira", "confluence", "figma", "product strategy",
            "user research", "analytics", "sql", "excel", "roadmapping"
        ],
        "marketing": [
            "google analytics", "facebook ads", "google ads", "seo", "sem",
            "content marketing", "social media", "email marketing", "crm"
        ]
    }
    
    return job_skills_map.get(job_title.lower(), [])

def extract_bullet_points(text: str) -> List[str]:
    """Extract bullet points from resume text"""
    # Simple bullet point extraction
    lines = text.split('\n')
    bullet_points = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('•') or line.startswith('-') or line.startswith('*'):
            bullet_points.append(line[1:].strip())
        elif re.match(r'^\d+\.', line):
            bullet_points.append(line)
    
    return bullet_points[:10]  # Return top 10 bullet points

@app.post("/analyze-linkedin")
async def analyze_linkedin_profile(
    profile_image: UploadFile = File(...),
    job_title: str = Form(...)
):
    """
    Analyze LinkedIn profile screenshot and provide optimization tips
    """
    try:
        # Read and process the image
        image_content = await profile_image.read()
        image = Image.open(io.BytesIO(image_content))
        
        # Convert to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Preprocess image for better OCR
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Extract text using OCR
        profile_text = pytesseract.image_to_string(thresh)
        
        # Analyze LinkedIn profile components
        analysis = analyze_linkedin_components(profile_text, job_title)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing LinkedIn profile: {str(e)}")

def analyze_linkedin_components(profile_text: str, job_title: str) -> Dict[str, Any]:
    """Analyze LinkedIn profile components and provide optimization tips"""
    
    # LinkedIn profile sections to analyze
    sections = {
        "headline": extract_headline(profile_text),
        "summary": extract_summary(profile_text),
        "experience": extract_experience(profile_text),
        "skills": extract_skills(profile_text),
        "education": extract_education(profile_text),
        "connections": extract_connections(profile_text)
    }
    
    # Generate optimization tips
    optimization_tips = generate_linkedin_optimization_tips(sections, job_title)
    
    # Calculate profile strength score
    profile_score = calculate_profile_strength(sections)
    
    return {
        "profile_score": profile_score,
        "sections": sections,
        "optimization_tips": optimization_tips,
        "visibility_score": calculate_visibility_score(sections),
        "keyword_optimization": analyze_keyword_optimization(profile_text, job_title)
    }

def extract_headline(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn headline"""
    lines = text.split('\n')
    headline = ""
    
    # Look for headline (usually near the top, after name)
    for i, line in enumerate(lines):
        if line.strip() and len(line.strip()) > 10 and len(line.strip()) < 200:
            if not any(word in line.lower() for word in ['linkedin', 'profile', 'view', 'connect']):
                headline = line.strip()
                break
    
    return {
        "text": headline,
        "length": len(headline),
        "has_keywords": bool(headline),
        "has_title": any(word in headline.lower() for word in ['engineer', 'developer', 'manager', 'analyst', 'specialist'])
    }

def extract_summary(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn summary/about section"""
    summary_sections = []
    in_summary = False
    
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['about', 'summary', 'bio']):
            in_summary = True
            continue
        elif in_summary and line.strip():
            if any(word in line.lower() for word in ['experience', 'education', 'skills', 'contact']):
                break
            summary_sections.append(line.strip())
    
    summary_text = ' '.join(summary_sections)
    
    return {
        "text": summary_text,
        "length": len(summary_text),
        "has_content": len(summary_text) > 50,
        "word_count": len(summary_text.split())
    }

def extract_experience(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn experience section"""
    experience_entries = []
    in_experience = False
    
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['experience', 'work']):
            in_experience = True
            continue
        elif in_experience and line.strip():
            if any(word in line.lower() for word in ['education', 'skills', 'certifications']):
                break
            if len(line.strip()) > 10:
                experience_entries.append(line.strip())
    
    return {
        "entries": experience_entries,
        "count": len(experience_entries),
        "has_descriptions": any(len(entry) > 50 for entry in experience_entries),
        "has_dates": any(any(year in entry for year in ['202', '201', '200']) for entry in experience_entries)
    }

def extract_skills(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn skills section"""
    skills = []
    in_skills = False
    
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['skills', 'endorsements']):
            in_skills = True
            continue
        elif in_skills and line.strip():
            if any(word in line.lower() for word in ['education', 'certifications', 'interests']):
                break
            if len(line.strip()) > 2 and len(line.strip()) < 50:
                skills.append(line.strip())
    
    return {
        "skills": skills,
        "count": len(skills),
        "has_endorsements": any('endorsed' in skill.lower() for skill in skills),
        "has_keywords": len(skills) > 5
    }

def extract_education(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn education section"""
    education_entries = []
    in_education = False
    
    lines = text.split('\n')
    for line in lines:
        if any(word in line.lower() for word in ['education', 'university', 'college']):
            in_education = True
            continue
        elif in_education and line.strip():
            if any(word in line.lower() for word in ['experience', 'skills', 'certifications']):
                break
            if len(line.strip()) > 10:
                education_entries.append(line.strip())
    
    return {
        "entries": education_entries,
        "count": len(education_entries),
        "has_degrees": any(any(word in entry.lower() for word in ['bachelor', 'master', 'phd', 'degree']) for entry in education_entries)
    }

def extract_connections(text: str) -> Dict[str, Any]:
    """Extract and analyze LinkedIn connections"""
    connection_count = 0
    
    # Look for connection count patterns
    for line in text.split('\n'):
        if 'connection' in line.lower():
            numbers = re.findall(r'\d+', line)
            if numbers:
                connection_count = max(connection_count, int(numbers[0]))
    
    return {
        "count": connection_count,
        "has_connections": connection_count > 0,
        "is_networked": connection_count > 100
    }

def generate_linkedin_optimization_tips(sections: Dict[str, Any], job_title: str) -> List[str]:
    """Generate LinkedIn optimization tips based on profile analysis"""
    tips = []
    
    # Headline optimization
    headline = sections.get("headline", {})
    if not headline.get("has_title"):
        tips.append("Add your current job title to your headline")
    if headline.get("length", 0) < 50:
        tips.append("Expand your headline to include key skills and achievements")
    if not headline.get("has_keywords"):
        tips.append("Include relevant keywords from your target job in your headline")
    
    # Summary optimization
    summary = sections.get("summary", {})
    if not summary.get("has_content"):
        tips.append("Add a compelling summary that tells your professional story")
    if summary.get("word_count", 0) < 100:
        tips.append("Expand your summary to 100+ words with key achievements")
    if summary.get("word_count", 0) > 500:
        tips.append("Keep your summary concise (200-300 words recommended)")
    
    # Experience optimization
    experience = sections.get("experience", {})
    if experience.get("count", 0) < 2:
        tips.append("Add more work experience entries with detailed descriptions")
    if not experience.get("has_descriptions"):
        tips.append("Add detailed descriptions to your experience entries")
    if not experience.get("has_dates"):
        tips.append("Include dates for all experience entries")
    
    # Skills optimization
    skills = sections.get("skills", {})
    if skills.get("count", 0) < 10:
        tips.append("Add more relevant skills to your profile")
    if not skills.get("has_endorsements"):
        tips.append("Get endorsements for your key skills from colleagues")
    
    # Education optimization
    education = sections.get("education", {})
    if education.get("count", 0) == 0:
        tips.append("Add your educational background")
    if not education.get("has_degrees"):
        tips.append("Include your degree and field of study")
    
    # Connections optimization
    connections = sections.get("connections", {})
    if not connections.get("is_networked"):
        tips.append("Grow your network by connecting with industry professionals")
    if connections.get("count", 0) < 50:
        tips.append("Aim for 500+ connections for better visibility")
    
    # General tips
    tips.append("Use a professional headshot as your profile picture")
    tips.append("Add a background image that reflects your industry")
    tips.append("Engage with industry content by liking and commenting")
    tips.append("Share relevant articles and insights regularly")
    tips.append("Join and participate in industry-specific LinkedIn groups")
    
    return tips[:12]  # Return top 12 tips

def calculate_profile_strength(sections: Dict[str, Any]) -> float:
    """Calculate overall LinkedIn profile strength score"""
    score = 0
    max_score = 100
    
    # Headline (20 points)
    headline = sections.get("headline", {})
    if headline.get("has_title"):
        score += 10
    if headline.get("length", 0) > 50:
        score += 10
    
    # Summary (20 points)
    summary = sections.get("summary", {})
    if summary.get("has_content"):
        score += 10
    if summary.get("word_count", 0) > 100:
        score += 10
    
    # Experience (25 points)
    experience = sections.get("experience", {})
    if experience.get("count", 0) >= 2:
        score += 10
    if experience.get("has_descriptions"):
        score += 10
    if experience.get("has_dates"):
        score += 5
    
    # Skills (15 points)
    skills = sections.get("skills", {})
    if skills.get("count", 0) >= 10:
        score += 10
    if skills.get("has_endorsements"):
        score += 5
    
    # Education (10 points)
    education = sections.get("education", {})
    if education.get("count", 0) > 0:
        score += 5
    if education.get("has_degrees"):
        score += 5
    
    # Connections (10 points)
    connections = sections.get("connections", {})
    if connections.get("is_networked"):
        score += 10
    
    return min(score, max_score)

def calculate_visibility_score(sections: Dict[str, Any]) -> float:
    """Calculate LinkedIn visibility score"""
    score = 0
    max_score = 100
    
    # Profile completeness (40 points)
    profile_score = calculate_profile_strength(sections)
    score += (profile_score / 100) * 40
    
    # Network size (30 points)
    connections = sections.get("connections", {})
    connection_count = connections.get("count", 0)
    if connection_count >= 500:
        score += 30
    elif connection_count >= 200:
        score += 20
    elif connection_count >= 100:
        score += 10
    
    # Activity indicators (30 points)
    # This would require additional analysis of recent activity
    score += 15  # Base score for having a profile
    
    return min(score, max_score)

def analyze_keyword_optimization(profile_text: str, job_title: str) -> Dict[str, Any]:
    """Analyze keyword optimization for LinkedIn profile"""
    profile_lower = profile_text.lower()
    
    # Get relevant keywords for the job title
    job_keywords = ATS_KEYWORDS.get(job_title.lower().replace(" ", "_"), [])
    
    # Find matched and missing keywords
    matched_keywords = [keyword for keyword in job_keywords if keyword.lower() in profile_lower]
    missing_keywords = [keyword for keyword in job_keywords if keyword.lower() not in profile_lower]
    
    # Calculate keyword density
    keyword_density = len(matched_keywords) / len(job_keywords) if job_keywords else 0
    
    return {
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords[:10],
        "keyword_density": round(keyword_density * 100, 2),
        "total_keywords": len(job_keywords),
        "keywords_found": len(matched_keywords)
    }

# LinkedIn API Helper Functions
def get_linkedin_auth_url_helper() -> str:
    """Generate LinkedIn OAuth authorization URL"""
    if not LINKEDIN_CLIENT_ID:
        raise HTTPException(status_code=500, detail="LinkedIn Client ID not configured")
    
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization"
    params = {
        "response_type": "code",
        "client_id": LINKEDIN_CLIENT_ID,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "scope": "r_liteprofile r_emailaddress w_member_social",
        "state": "resuscan_linkedin_auth"
    }
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return f"{auth_url}?{query_string}"

def exchange_code_for_token(authorization_code: str) -> Dict[str, Any]:
    """Exchange authorization code for access token"""
    if not LINKEDIN_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="LinkedIn Client Secret not configured")
    
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": authorization_code,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET
    }
    
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to exchange code for token")
    
    return response.json()

def get_linkedin_profile(access_token: str) -> Dict[str, Any]:
    """Get LinkedIn profile data using access token"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    # Get basic profile
    profile_url = f"{LINKEDIN_API_BASE_URL}/me"
    profile_response = requests.get(profile_url, headers=headers)
    
    if profile_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch LinkedIn profile")
    
    profile_data = profile_response.json()
    
    # Get detailed profile with additional fields
    detailed_url = f"{LINKEDIN_API_BASE_URL}/me?projection=(id,firstName,lastName,profilePicture,email-address,positions,educations,skills,summary,headline,industry,location,publicProfileUrl)"
    detailed_response = requests.get(detailed_url, headers=headers)
    
    if detailed_response.status_code == 200:
        detailed_data = detailed_response.json()
        profile_data.update(detailed_data)
    
    return profile_data

def analyze_linkedin_profile_api(profile_data: Dict[str, Any], job_title: str) -> Dict[str, Any]:
    """Analyze LinkedIn profile data from API"""
    
    # Extract profile sections
    sections = {
        "headline": extract_headline_from_api(profile_data),
        "summary": extract_summary_from_api(profile_data),
        "experience": extract_experience_from_api(profile_data),
        "skills": extract_skills_from_api(profile_data),
        "education": extract_education_from_api(profile_data),
        "connections": extract_connections_from_api(profile_data)
    }
    
    # Generate optimization tips
    optimization_tips = generate_linkedin_optimization_tips(sections, job_title)
    
    # Calculate scores
    profile_score = calculate_profile_strength(sections)
    visibility_score = calculate_visibility_score(sections)
    
    # Analyze keyword optimization
    profile_text = create_profile_text_from_api(profile_data)
    keyword_optimization = analyze_keyword_optimization(profile_text, job_title)
    
    return {
        "profile_score": profile_score,
        "sections": sections,
        "optimization_tips": optimization_tips,
        "visibility_score": visibility_score,
        "keyword_optimization": keyword_optimization,
        "profile_data": profile_data
    }

def extract_headline_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract headline from LinkedIn API data"""
    headline = profile_data.get("headline", "")
    
    return {
        "text": headline,
        "length": len(headline),
        "has_keywords": bool(headline),
        "has_title": any(word in headline.lower() for word in ['engineer', 'developer', 'manager', 'analyst', 'specialist'])
    }

def extract_summary_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract summary from LinkedIn API data"""
    summary = profile_data.get("summary", "")
    
    return {
        "text": summary,
        "length": len(summary),
        "has_content": len(summary) > 50,
        "word_count": len(summary.split())
    }

def extract_experience_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract experience from LinkedIn API data"""
    positions = profile_data.get("positions", {}).get("values", [])
    experience_entries = []
    
    for position in positions:
        entry = {
            "title": position.get("title", ""),
            "company": position.get("companyName", ""),
            "dates": f"{position.get('startDate', {}).get('year', '')} - {position.get('endDate', {}).get('year', 'Present')}",
            "description": position.get("summary", "")
        }
        experience_entries.append(entry)
    
    return {
        "entries": experience_entries,
        "count": len(experience_entries),
        "has_descriptions": any(len(entry.get("description", "")) > 50 for entry in experience_entries),
        "has_dates": any(entry.get("dates") for entry in experience_entries)
    }

def extract_skills_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract skills from LinkedIn API data"""
    skills_data = profile_data.get("skills", {}).get("values", [])
    skills = [skill.get("skill", {}).get("name", "") for skill in skills_data]
    
    return {
        "skills": skills,
        "count": len(skills),
        "has_endorsements": any(skill.get("numEndorsements", 0) > 0 for skill in skills_data),
        "has_keywords": len(skills) > 5
    }

def extract_education_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract education from LinkedIn API data"""
    education_data = profile_data.get("educations", {}).get("values", [])
    education_entries = []
    
    for edu in education_data:
        entry = {
            "degree": edu.get("degree", ""),
            "school": edu.get("schoolName", ""),
            "dates": f"{edu.get('startDate', {}).get('year', '')} - {edu.get('endDate', {}).get('year', '')}"
        }
        education_entries.append(entry)
    
    return {
        "entries": education_entries,
        "count": len(education_entries),
        "has_degrees": any(any(word in entry.get("degree", "").lower() for word in ['bachelor', 'master', 'phd', 'degree']) for entry in education_entries)
    }

def extract_connections_from_api(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract connections from LinkedIn API data"""
    # Note: Connection count requires additional API permissions
    # For now, we'll provide a placeholder
    return {
        "count": 0,  # Would need additional API call to get actual count
        "has_connections": True,
        "is_networked": True
    }

def create_profile_text_from_api(profile_data: Dict[str, Any]) -> str:
    """Create text representation of LinkedIn profile from API data"""
    text_parts = []
    
    # Add headline
    if profile_data.get("headline"):
        text_parts.append(profile_data["headline"])
    
    # Add summary
    if profile_data.get("summary"):
        text_parts.append(profile_data["summary"])
    
    # Add experience
    positions = profile_data.get("positions", {}).get("values", [])
    for position in positions:
        text_parts.append(f"{position.get('title', '')} at {position.get('companyName', '')}")
        if position.get("summary"):
            text_parts.append(position["summary"])
    
    # Add skills
    skills_data = profile_data.get("skills", {}).get("values", [])
    skills = [skill.get("skill", {}).get("name", "") for skill in skills_data]
    if skills:
        text_parts.append(", ".join(skills))
    
    return " ".join(text_parts)

# Resume Versioning Endpoints
@app.post("/save-resume-version")
async def save_resume_version(
    resume_data: str = Form(...),
    version_name: str = Form(...),
    job_title: str = Form(...)
):
    """Save a new version of resume"""
    try:
        # Parse the JSON string back to dict
        resume_data_dict = json.loads(resume_data)
        
        version_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        version_data = {
            "id": version_id,
            "name": version_name,
            "job_title": job_title,
            "resume_data": resume_data_dict,
            "created_at": timestamp,
            "updated_at": timestamp
        }
        
        resume_versions[version_id] = version_data
        save_resume_versions()
        
        return {
            "success": True,
            "version_id": version_id,
            "message": f"Resume version '{version_name}' saved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving resume version: {str(e)}")

@app.get("/get-resume-versions")
async def get_resume_versions():
    """Get all saved resume versions"""
    try:
        versions = []
        for version_id, version_data in resume_versions.items():
            versions.append({
                "id": version_id,
                "name": version_data["name"],
                "job_title": version_data["job_title"],
                "created_at": version_data["created_at"],
                "updated_at": version_data["updated_at"]
            })
        
        # Sort by updated_at (newest first)
        versions.sort(key=lambda x: x["updated_at"], reverse=True)
        
        return {
            "success": True,
            "versions": versions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume versions: {str(e)}")

@app.get("/get-resume-version/{version_id}")
async def get_resume_version(version_id: str):
    """Get a specific resume version"""
    try:
        if version_id not in resume_versions:
            raise HTTPException(status_code=404, detail="Resume version not found")
        
        return {
            "success": True,
            "version": resume_versions[version_id]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume version: {str(e)}")

@app.delete("/delete-resume-version/{version_id}")
async def delete_resume_version(version_id: str):
    """Delete a resume version"""
    try:
        if version_id not in resume_versions:
            raise HTTPException(status_code=404, detail="Resume version not found")
        
        deleted_version = resume_versions.pop(version_id)
        save_resume_versions()
        
        return {
            "success": True,
            "message": f"Resume version '{deleted_version['name']}' deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting resume version: {str(e)}")

# PDF Resume Builder Endpoints
@app.get("/get-resume-templates")
async def get_resume_templates():
    """Get available resume templates"""
    try:
        templates = []
        for template_id, template_data in RESUME_TEMPLATES.items():
            templates.append({
                "id": template_id,
                "name": template_data["name"],
                "description": template_data["description"]
            })
        
        return {
            "success": True,
            "templates": templates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving templates: {str(e)}")

def create_ats_friendly_pdf(resume_data: Dict[str, Any], template_id: str = "professional") -> str:
    """Create an ATS-friendly PDF resume"""
    try:
        template = RESUME_TEMPLATES.get(template_id, RESUME_TEMPLATES["professional"])
        
        # Create PDF filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        pdf_filename = f"resume_{timestamp}.pdf"
        pdf_path = os.path.join("temp", pdf_filename)
        
        # Ensure temp directory exists
        os.makedirs("temp", exist_ok=True)
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=letter, 
                              leftMargin=template["margins"][0]*inch,
                              rightMargin=template["margins"][1]*inch,
                              topMargin=template["margins"][2]*inch,
                              bottomMargin=template["margins"][3]*inch)
        
        # Get styles
        styles = getSampleStyleSheet()
        
        # Create custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        section_style = ParagraphStyle(
            'CustomSection',
            parent=styles['Heading2'],
            fontSize=template["font_size"] + 2,
            spaceAfter=6,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=template["font_size"],
            spaceAfter=6,
            leading=template["font_size"] * template["line_spacing"],
            fontName='Helvetica'
        )
        
        # Build PDF content
        story = []
        
        # Name and contact info
        if resume_data.get("name"):
            story.append(Paragraph(resume_data["name"], title_style))
            story.append(Spacer(1, 6))
        
        # Contact information
        contact_info = []
        if resume_data.get("email"):
            contact_info.append(resume_data["email"])
        if resume_data.get("phone"):
            contact_info.append(resume_data["phone"])
        if resume_data.get("location"):
            contact_info.append(resume_data["location"])
        if resume_data.get("linkedin"):
            contact_info.append(resume_data["linkedin"])
        
        if contact_info:
            contact_text = " | ".join(contact_info)
            story.append(Paragraph(contact_text, body_style))
            story.append(Spacer(1, 12))
        
        # Summary
        if resume_data.get("summary"):
            story.append(Paragraph("SUMMARY", section_style))
            story.append(Paragraph(resume_data["summary"], body_style))
            story.append(Spacer(1, template["section_spacing"] * inch))
        
        # Experience
        if resume_data.get("experience"):
            story.append(Paragraph("EXPERIENCE", section_style))
            for exp in resume_data["experience"]:
                # Job title and company
                job_header = f"<b>{exp.get('title', '')}</b>"
                if exp.get('company'):
                    job_header += f" - {exp.get('company', '')}"
                if exp.get('dates'):
                    job_header += f" | {exp.get('dates', '')}"
                
                story.append(Paragraph(job_header, body_style))
                
                # Job description
                if exp.get('description'):
                    story.append(Paragraph(exp["description"], body_style))
                
                story.append(Spacer(1, 6))
            
            story.append(Spacer(1, template["section_spacing"] * inch))
        
        # Education
        if resume_data.get("education"):
            story.append(Paragraph("EDUCATION", section_style))
            for edu in resume_data["education"]:
                edu_text = f"<b>{edu.get('degree', '')}</b>"
                if edu.get('school'):
                    edu_text += f" - {edu.get('school', '')}"
                if edu.get('dates'):
                    edu_text += f" | {edu.get('dates', '')}"
                
                story.append(Paragraph(edu_text, body_style))
                story.append(Spacer(1, 6))
            
            story.append(Spacer(1, template["section_spacing"] * inch))
        
        # Skills
        if resume_data.get("skills"):
            story.append(Paragraph("SKILLS", section_style))
            skills_text = ", ".join(resume_data["skills"])
            story.append(Paragraph(skills_text, body_style))
            story.append(Spacer(1, template["section_spacing"] * inch))
        
        # Projects
        if resume_data.get("projects"):
            story.append(Paragraph("PROJECTS", section_style))
            for project in resume_data["projects"]:
                project_text = f"<b>{project.get('name', '')}</b>"
                if project.get('description'):
                    project_text += f" - {project.get('description', '')}"
                
                story.append(Paragraph(project_text, body_style))
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        
        return pdf_path
        
    except Exception as e:
        raise Exception(f"Error creating PDF: {str(e)}")

@app.post("/generate-resume-pdf")
async def generate_resume_pdf(
    resume_data: str = Form(...),
    template_id: str = Form("professional")
):
    """Generate ATS-friendly PDF resume"""
    try:
        # Parse the JSON string back to dict
        resume_data_dict = json.loads(resume_data)
        pdf_path = create_ats_friendly_pdf(resume_data_dict, template_id)
        
        return FileResponse(
            path=pdf_path,
            filename=f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@app.post("/save-and-generate-pdf")
async def save_and_generate_pdf(
    resume_data: str = Form(...),
    version_name: str = Form(...),
    job_title: str = Form(...),
    template_id: str = Form("professional")
):
    """Save resume version and generate PDF"""
    try:
        # Parse the JSON string back to dict
        resume_data_dict = json.loads(resume_data)
        
        # Save resume version
        version_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        version_data = {
            "id": version_id,
            "name": version_name,
            "job_title": job_title,
            "resume_data": resume_data_dict,
            "created_at": timestamp,
            "updated_at": timestamp
        }
        
        resume_versions[version_id] = version_data
        save_resume_versions()
        
        # Generate PDF
        pdf_path = create_ats_friendly_pdf(resume_data_dict, template_id)
        
        return FileResponse(
            path=pdf_path,
            filename=f"{version_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving and generating PDF: {str(e)}")

# LinkedIn API Endpoints
@app.get("/linkedin/auth-url")
async def get_linkedin_auth_url():
    """Get LinkedIn OAuth authorization URL"""
    try:
        auth_url = get_linkedin_auth_url_helper()
        return {
            "success": True,
            "auth_url": auth_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating auth URL: {str(e)}")

@app.post("/linkedin/callback")
async def linkedin_callback(
    code: str = Form(...),
    state: str = Form(...)
):
    """Handle LinkedIn OAuth callback"""
    try:
        # Exchange code for access token
        token_data = exchange_code_for_token(code)
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        return {
            "success": True,
            "access_token": access_token,
            "expires_in": token_data.get("expires_in", 3600)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing callback: {str(e)}")

@app.post("/linkedin/analyze-profile")
async def analyze_linkedin_profile_api_endpoint(
    access_token: str = Form(...),
    job_title: str = Form(...)
):
    """Analyze LinkedIn profile using API data"""
    try:
        # Get profile data from LinkedIn API
        profile_data = get_linkedin_profile(access_token)
        
        # Analyze the profile
        analysis = analyze_linkedin_profile_api(profile_data, job_title)
        
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing LinkedIn profile: {str(e)}")

@app.get("/linkedin/profile-data")
async def get_linkedin_profile_data(access_token: str):
    """Get raw LinkedIn profile data"""
    try:
        profile_data = get_linkedin_profile(access_token)
        return {
            "success": True,
            "profile_data": profile_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 