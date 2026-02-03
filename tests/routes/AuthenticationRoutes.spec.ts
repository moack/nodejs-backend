import 'reflect-metadata';
import { container } from "tsyringe";
import '../../src/setup/container';
import { fakeUserRepo } from './AuthenticationRoutes.di';
import { app } from "../../src/app";
import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createAuthRoutes from "../../src/routes/AuthenticationRoutes";
import { IUserRepository } from "../../src/abstractions/repositories/IUserRepository";
import { UserRepository } from "../../src/repositories/UserRepository";
import { AuthenticationService } from "../../src/services/AuthenticationService";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("AuthenticationRoutes", () => {
    //let app: express.Express;
    //let fakeUserRepo: jest.Mocked<IUserRepository>;
    let authService: AuthenticationService;
    
    
    // Override the binding
    beforeEach(() => {
        //container.registerInstance<IUserRepository>("IUserRepository", fakeUserRepo);
    });

    it("should login successfully with valid credentials", async () => {
        // Arrange
        mockedBcrypt.hash.mockImplementation(async (password: string | Buffer<ArrayBufferLike>, saltRounds: string | number) => `hashed-${password}`);
        mockedJwt.sign.mockImplementation(() => "fake-jwt-token");
        fakeUserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: "test@test.com",
            password: "hashed-password",
        });
        
        // Act
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "password" });

        // Assert
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token", "fake-jwt-token");
        expect(res.body).toHaveProperty("user", { id: 1, email: "test@test.com" });
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
        // Arrange
        mockedBcrypt.hash.mockImplementation(async (password: string | Buffer<ArrayBufferLike>, saltRounds: string | number) => `hashed-${password}`);
        mockedJwt.sign.mockImplementation(() => "fake-jwt-token");
        fakeUserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: "test@test.com",
            password: "hashed-password",
        });

        // Act
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "wrong@test.com", password: "wrong" });

        // Assert
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
});
