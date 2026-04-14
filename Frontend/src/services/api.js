// API Service for Trip Advisor Backend Integration
// Base URL for backend API
const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
  },
  trips: {
    create: '/trips',
    get: '/trips',
    getById: '/trips/:id',
    update: '/trips/:id',
    delete: '/trips/:id',
  },
  travel: {
    create: '/travel',
    get: '/travel',
  },
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  async signup(userData) {
    const response = await fetch(`${API_BASE_URL}${endpoints.auth.signup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}${endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Trip API
export const tripAPI = {
  async create(tripData) {
    const response = await fetch(`${API_BASE_URL}${endpoints.trips.create}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token when user is authenticated
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },

  async getAll() {
    const response = await fetch(`${API_BASE_URL}${endpoints.trips.get}`);
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}${endpoints.trips.getById.replace(':id', id)}`);
    return handleResponse(response);
  },
};

// Travel API
export const travelAPI = {
  async create(travelData) {
    const response = await fetch(`${API_BASE_URL}${endpoints.travel.create}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(travelData),
    });
    return handleResponse(response);
  },

  async getAll() {
    const response = await fetch(`${API_BASE_URL}${endpoints.travel.get}`);
    return handleResponse(response);
  },
};

// Helper function to check authentication status
export const checkAuth = () => {
  return !!localStorage.getItem('token');
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};