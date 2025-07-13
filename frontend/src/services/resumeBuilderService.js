const API_BASE_URL = 'http://localhost:8000';

export const resumeBuilderService = {
  // Get available templates
  async getTemplates() {
    const response = await fetch(`${API_BASE_URL}/get-resume-templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    return response.json();
  },

  // Get all saved versions
  async getVersions() {
    const response = await fetch(`${API_BASE_URL}/get-resume-versions`);
    if (!response.ok) {
      throw new Error('Failed to fetch versions');
    }
    return response.json();
  },

  // Get specific version
  async getVersion(versionId) {
    const response = await fetch(`${API_BASE_URL}/get-resume-version/${versionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch version');
    }
    return response.json();
  },

  // Save resume version
  async saveVersion(resumeData, versionName, jobTitle) {
    const formData = new FormData();
    formData.append('resume_data', JSON.stringify(resumeData));
    formData.append('version_name', versionName);
    formData.append('job_title', jobTitle);

    const response = await fetch(`${API_BASE_URL}/save-resume-version`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save version');
    }
    return response.json();
  },

  // Delete resume version
  async deleteVersion(versionId) {
    const response = await fetch(`${API_BASE_URL}/delete-resume-version/${versionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete version');
    }
    return response.json();
  },

  // Generate PDF
  async generatePDF(resumeData, templateId = 'professional') {
    const formData = new FormData();
    formData.append('resume_data', JSON.stringify(resumeData));
    formData.append('template_id', templateId);

    const response = await fetch(`${API_BASE_URL}/generate-resume-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    return response.blob();
  },

  // Save and generate PDF
  async saveAndGeneratePDF(resumeData, versionName, jobTitle, templateId = 'professional') {
    const formData = new FormData();
    formData.append('resume_data', JSON.stringify(resumeData));
    formData.append('version_name', versionName);
    formData.append('job_title', jobTitle);
    formData.append('template_id', templateId);

    const response = await fetch(`${API_BASE_URL}/save-and-generate-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save and generate PDF');
    }
    return response.blob();
  },
}; 