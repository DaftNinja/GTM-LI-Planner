const API_URL = process.env.REACT_APP_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
};

export const authAPI = {
  register: async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

export const credentialsAPI = {
  saveGTM: async (data) => {
    const response = await fetch(`${API_URL}/credentials/gtm`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getGTM: async () => {
    const response = await fetch(`${API_URL}/credentials/gtm`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },

  saveLinkedIn: async (data) => {
    const response = await fetch(`${API_URL}/credentials/linkedin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getLinkedIn: async () => {
    const response = await fetch(`${API_URL}/credentials/linkedin`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },
};

export const progressAPI = {
  updateTask: async (phaseKey, taskId, completed, notes) => {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phaseKey, taskId, completed, notes }),
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/progress`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },

  getSummary: async () => {
    const response = await fetch(`${API_URL}/progress/summary`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },
};

export const eventsAPI = {
  save: async (eventData) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/events`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },
};
