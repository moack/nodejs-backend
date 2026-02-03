import { Response } from "express";
import { RegisterRequest } from "../../models/dtos/LoginModels";
import { LoginRequest, LoginResponse } from "../../validators/LoginValidators";

// Interface for Authenticating and registering users.
export interface IAuthenticationService {
    // Registers a User 
    register(request: RegisterRequest): Promise<boolean>;

    // Tries to login a user
    login(email: LoginRequest): Promise<LoginResponse | null>;

    // Logsout a user
    logout(res: Response): void;

    // Verifies a JWT token
    verifyToken(token: string): string | null;

    // Sets the cookie with JWT token
    setCookie(res: Response, token: string): void;
}