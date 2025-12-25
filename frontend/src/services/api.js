import axios from "axios";

// Use environment variable or default to deployed backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://resuscan-resume-analyser.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const resumeAPI = {
  // Upload and parse resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Analyze ATS compatibility
  analyzeATS: async (resumeText, jobTitle) => {
    const formData = new FormData();
    formData.append("resume_text", resumeText);
    formData.append("job_title", jobTitle);

    const response = await api.post("/analyze-ats", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Analyze skill gaps
  analyzeSkillGaps: async (resumeText, targetJob) => {
    const formData = new FormData();
    formData.append("resume_text", resumeText);
    formData.append("target_job", targetJob);

    const response = await api.post("/skill-gap-analysis", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Improve bullet points
  improveBulletPoints: async (bulletPoints, jobTitle) => {
    const formData = new FormData();
    bulletPoints.forEach((bullet, index) => {
      formData.append("bullet_points", bullet);
    });
    formData.append("job_title", jobTitle);

    const response = await api.post("/improve-bullet-points", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get project and course recommendations
  getRecommendations: async (missingSkills, jobTitle) => {
    const formData = new FormData();
    missingSkills.forEach((skill, index) => {
      formData.append("missing_skills", skill);
    });
    formData.append("job_title", jobTitle);

    const response = await api.post("/recommend-projects-courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Comprehensive analysis
  comprehensiveAnalysis: async (file, jobTitle) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_title", jobTitle);

    const response = await api.post("/comprehensive-analysis", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // LinkedIn profile analysis
  analyzeLinkedin: async (image, jobTitle) => {
    const formData = new FormData();
    formData.append("profile_image", image);
    formData.append("job_title", jobTitle);

    const response = await api.post("/analyze-linkedin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
