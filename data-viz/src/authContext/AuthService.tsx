import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { fetchData } from '../utils/api';

const TOKEN_ENDPOINT = '/token/';

interface AuthResponse {
  access: string;
  refresh: string;
}

interface User {
  username: string;
  // Add other user properties as needed
}
interface User {
  // other properties...
  exp?: number; // add 'exp' property with optional number type
}
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    try {
      const response = await fetchData<AuthResponse>(TOKEN_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        requiresAuth: false,
      });

      if (response.access && response.refresh) {
        Cookies.set('accessToken', response.access, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', response.refresh, { secure: true, sameSite: 'strict', expires: 7 }); // Set refresh token to expire in 7 days
        const user = authService.decodeToken(response.access);
        return user;
      }
      throw new AuthError('Invalid response from server');
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AuthError(error.response?.data?.detail || 'Login failed');
      }
      throw new AuthError('An unexpected error occurred');
    }
  },

  logout: async () => {
    try {
      // Call a server-side logout endpoint if available
      // await fetchData('/logout/', { method: 'POST' });
    } catch (error) {
      //console.error('Logout failed:', error);
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  getCurrentUser: (): User | null => {
    const token = authService.getAccessToken();
    if (token) {
      return authService.decodeToken(token);
    }
    return null;
  },

  getAccessToken: (): string | null => {
    return Cookies.get('accessToken') || null;
  },

  isAuthenticated: (): boolean => {
    const token = authService.getAccessToken();
    if (!token) return false;
    
    const user = authService.decodeToken(token);
    return !!user && !authService.isTokenExpired(token);
  },

  refreshToken: async (): Promise<string | null> => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await fetchData<AuthResponse>(`${TOKEN_ENDPOINT}refresh/`, {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        requiresAuth: false,
      });

      if (response.access) {
        Cookies.set('accessToken', response.access, { secure: true, sameSite: 'strict' });
        return response.access;
      }
    } catch (error) {
      //console.error('Token refresh failed:', error);
      await authService.logout();
    }
    return null;
  },

  decodeToken: (token: string): User => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      //console.error('Token decoding failed:', error);
      throw new AuthError('Invalid token');
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = authService.decodeToken(token);
      if (decoded.exp === undefined) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      //console.error('Error checking token expiration:', error);
      return true;
    }
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await fetchData<User>('/user/', {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new AuthError((axiosError.response?.data as { detail: string })?.detail || 'Login failed');
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await fetchData('/change-password/', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new AuthError((axiosError.response?.data as { detail: string })?.detail || 'Login failed');
    }
  }
};

// Axios interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await authService.refreshToken();
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default authService;