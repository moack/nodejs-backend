import { Request, Response, NextFunction } from 'express';
import { IAuthenticationService } from '../abstractions/services/IAuthenticationService';

// Middleware to validate JWT token from cookie
export function createAuthMiddleware(authService: IAuthenticationService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.auth_token;
        if (!token) {
            // No Token
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify Token
        const userId = authService.verifyToken(token);
        if (!userId) {
            // Invalid
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Valid
        (req as any).userId = userId; // attach userId to request
        next();
    }
}