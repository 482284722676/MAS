const API_BASE = '/api';

const CLASS_LABELS = {
  S: '安全', A: '实用', N: '自然', C: '可控',
  D: '神性', P: '危险', M: '气象', I: '无形',
  R: '毁灭', E: '消逝'
};

function classLabel(code) {
  return CLASS_LABELS[code] ? `${code} · ${CLASS_LABELS[code]}` : code;
}

async function request(url, options = {}) {
  const token = localStorage.getItem('mas_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('mas_token');
    localStorage.removeItem('mas_username');
    if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
      window.location.href = '/admin/login.html';
    }
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

function getAnomalies(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/anomalies${query ? '?' + query : ''}`);
}

function getAnomaly(id) {
  return request(`/anomalies/${id}`);
}

function createAnomaly(data) {
  return request('/anomalies', { method: 'POST', body: JSON.stringify(data) });
}

function updateAnomaly(id, data) {
  return request(`/anomalies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

function deleteAnomaly(id) {
  return request(`/anomalies/${id}`, { method: 'DELETE' });
}

function login(password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
}

function verifyToken() {
  return request('/auth/verify');
}

function getAuthStatus() {
  return request('/auth/status');
}

function changePassword(newPassword) {
  return request('/auth/password', { method: 'PUT', body: JSON.stringify({ newPassword }) });
}

function getStats() {
  return request('/stats');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}
