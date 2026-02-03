import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { container } from "tsyringe";
import { AuthenticationService } from '../services/AuthenticationService';
import { loginRequestSchema } from '../validators/LoginValidators';
import { z } from 'zod';
import { UserService } from '../services/UserService';
import { createAuthMiddleware } from '../middleware/AuthenticationMiddleware';

// Settings
const JWT_SECRET = process.env.JWT_SECRET || '1234567890123457890123456789012';

// Get DI components
const userService = container.resolve(UserService);
const authService = container.resolve(AuthenticationService);

// Routers
const protectedRouter = Router();
protectedRouter.use(createAuthMiddleware(authService));
const unprotectedRouter = Router();

// Login Route
unprotectedRouter.post('/login', async (req: Request, res: Response) => {
    try {
        // Validate
        const requestModel = loginRequestSchema.parse(req.body);

        // Login
        const response = await authService.login(requestModel);

        if (!response) {
            // Failed
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Success - Set Cookie
        res.cookie('auth_token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: process.env.COOKIE_DURATION ?
                +process.env.COOKIE_DURATION :
                1000 * 60 * 60 * 24, // 1 day
        });

        // Success - Set Result
        res.json({ token: response.token, user: response.user });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout Route
unprotectedRouter.post('/logout', (_req: Request, res: Response) => {
    // Clear cookie
    res.clearCookie('auth_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });

    // Success - Set Result
    res.json({ message: 'Logged out' });
});

// Me Route
protectedRouter.get('/me', async (req: Request, res: Response) => {
    const token = req.cookies.auth_token;

    if (!token) {
        // No token
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    try {
        // Decrypt JWT token
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

        // Get User
        const user = await userService.findById(+payload.userId);

        if (!user) {
            // User not found in database
            return res.status(404).json({ message: 'User not found' });
        }

        // Success - Set Result
        res.json({
            user: {
                id: payload.userId,
                email: user.email,
            },
        });
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
});

unprotectedRouter.use(protectedRouter);

export default unprotectedRouter;
