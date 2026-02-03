export interface LoginResponse {
    token: string;
    user: { id: number; email: string };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    // ... add more if needed
}