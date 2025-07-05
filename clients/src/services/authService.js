const API_URL = 'http://localhost:3001/api/login';

export async function login(username, password) {
  try {
    console.log('Attempting login with:', { username, password: '***' });
    console.log('Login URL:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Login response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    // Store tokens and user data
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      console.log('Stored access_token');
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
      console.log('Stored refresh_token');
    }
    if (data.user_role) {
      localStorage.setItem('user_role', data.user_role);
      console.log('Stored user_role:', data.user_role);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Stored user data');
    }

    return { success: true, data };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: err.message };
  }
}

export function logout() {
  localStorage.clear();
  window.location.href = '/login';
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return null;

  const response = await fetch('https://zodr.zodml.org/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: 'your-client-id',
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  }
  return null;
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getUserRole() {
  return localStorage.getItem('user_role');
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function getAuthHeaders() {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
} 