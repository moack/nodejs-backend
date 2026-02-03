import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/dtos/LoginModels';
import { IAuthenticationService } from '../abstractions/services/IAuthenticationService';
import { IUserRepository } from '../abstractions/repositories/IUserRepository';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Recommended default value.
const SALT_ROUNDS = 10;

@injectable()
export class AuthenticationService implements IAuthenticationService {
    constructor(@inject("IUserRepository") private _users: IUserRepository) {
    }

    async register(request: RegisterRequest): Promise<boolean> {
        // Check if user exists
        const existing = await this._users.findByEmail(request.email);
        if (existing) {
            // User already exists
            console.log(`User with email '${request.email}' already exists.`);
            return false;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(request.password, SALT_ROUNDS);

        // Save user
        await this._users.create({
            email: request.email,
            password: hashedPassword,
            name: request.name,
        });
        return true;
    }

    async login(request: LoginRequest): Promise<LoginResponse | null> {
        const user = await this._users.findByEmail(request.email);
        if (!user) {
            console.log(`Cannot find user ${request.email}.`);
            return null;
        }

        const hashedPassword = await bcrypt.hash(request.password, SALT_ROUNDS);
        if (user.password !== hashedPassword) {
            // User already exists
            console.log(`Invalid password for '${request.email}'.`);
            return null;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: { id: user.id, email: user.email },
        };
    }

    logout(res: Response): void {
        res.clearCookie('auth_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
    }

    verifyToken(token: string): string | null {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
            return payload.userId;
        } catch {
            return null;
        }
    }

    setCookie(res: Response, token: string): void {
        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
    }
}
