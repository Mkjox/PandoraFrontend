export interface LoginPayload {
    UsernameOrEmail: string;
    Password: string;
  }
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface DecodedToken {
    nameid: string; 
    unique_name?: string; 
    exp?: number;         
    iat?: number;         
    // [key: string]: any;   
  }
  
  export interface AuthResult {
    success: boolean;
    token?: string;
    message?: string;
  }
  
  export interface LogoutResult {
    success: boolean;
    message?: string;
  }