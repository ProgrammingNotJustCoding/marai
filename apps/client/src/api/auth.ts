import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SignupRequest {
  username: string;
  email: string;
  mobile: string;
  password: string;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
}

export interface SigninPasswordRequest {
  mobile: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  mobile: string;
  isMobileVerified: boolean;
  lastLoginAt?: string;
}

export interface AuthResponse {
  sessionID?: string;
  user?: User;
}

export const authAPI = {
  signup: async (data: SignupRequest) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  verifySignupOTP: async (data: VerifyOTPRequest) => {
    const response = await api.post("/auth/signup/verify", data);
    return response.data as AuthResponse;
  },

  requestSigninOTP: async (mobile: string) => {
    const response = await api.post("/auth/signin/otp", { mobile });
    return response.data;
  },

  verifySigninOTP: async (data: VerifyOTPRequest) => {
    const response = await api.post("/auth/signin/otp/verify", data);
    return response.data as AuthResponse;
  },

  resendSigninOTP: async (mobile: string) => {
    const response = await api.post("/auth/signin/otp/resend", { mobile });
    return response.data;
  },

  signinWithPassword: async (data: SigninPasswordRequest) => {
    const response = await api.post("/auth/signin/password", data);
    return response.data as AuthResponse;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data as User;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
