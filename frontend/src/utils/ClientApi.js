const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';

async function handleResponse(response) {
    const text = await response.text();
    let json = null;
    try {
        json = text ? JSON.parse(text) : {};
    } catch (e) {
        // Implement appropriate error handling for invalid JSON
        throw new Error('Invalid JSON response');
    }

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            window.location.href = '/login';
            // Clear the session or token if needed
        }
        const error = {
            status: response.status,
            message: json.message || response.statusText,
            details: json.details,
        };
        throw error;
    }   
    return json;
}


function getToken() {
    // return localStorage.getItem('authToken') || '';
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiIyMWYxMDA1NTE0QGRzLnN0dWR5LmlpdG0uYWMuaW4iLCJyb2xlIjoiUkVDUlVJVEVSIiwiaWF0IjoxNzY1MDA2Mjk2LCJleHAiOjE3NjU2MTEwOTZ9.MAYq1Ey5zRTzOCOJNji0F1W1KObcT8lzPC6WU2FkADk'
}

export async function get(path) {
    const url = `${API_BASE}${path}`;
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
        method: 'GET',
        headers
    });

    return await handleResponse(response);
}

export async function post(path, body) {
    const url = `${API_BASE}${path}`;
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    return await handleResponse(response);
}

export default {get, post};