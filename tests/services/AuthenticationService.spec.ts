import "reflect-metadata";
import { AuthenticationService } from "../../src/services/AuthenticationService";
import { IUserRepository } from "../../src/abstractions/repositories/IUserRepository";
import { LoginResponse, RegisterRequest } from "../../src/models/dtos/LoginModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock bcrypt so we can control hashing
jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock jwt
jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("AuthenticationService", () => {
    let authService: AuthenticationService;
    let userRepo: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        // Fake repository
        userRepo = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
        } as any;

        authService = new AuthenticationService(userRepo);
        jest.clearAllMocks();
    });

    describe("register", () => {

        it("should register a new user successfully", async () => {
            // Arrange
            const request: RegisterRequest = {
                email: "test@test.com",
                password: "password123",
                name: "Test User",
            };
            userRepo.findByEmail.mockResolvedValue(null); // user does not exist
            mockedBcrypt.hash.mockImplementation(async () => "hashed-password");

            // Act
            const result = await authService.register(request);

            // Assert
            expect(result).toBe(true);
            expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(userRepo.create).toHaveBeenCalledWith({
                email: "test@test.com",
                password: "hashed-password",
                name: "Test User",
            });
        });

        it("should return false if user already exists", async () => {
            // Arrange
            userRepo.findByEmail.mockResolvedValue({ id: 1, email: "test@test.com", password: "hashed" });

            // Act
            const result = await authService.register({ email: "test@test.com", password: "1234", name: "Test" });

            // Assert
            expect(result).toBe(false);
            expect(userRepo.create).not.toHaveBeenCalled();
        });

        it("should hash password and create user", async () => {
            // Arrange
            userRepo.findByEmail.mockResolvedValue(null);
            mockedBcrypt.hash.mockImplementation(async () => "hashed-password");

            const request: RegisterRequest = { email: "new@test.com", password: "1234", name: "New User" };

            // Act
            const result = await authService.register(request);

            // Assert
            expect(result).toBe(true);
            expect(mockedBcrypt.hash).toHaveBeenCalledWith("1234", 10);
            expect(userRepo.create).toHaveBeenCalledWith({
                email: "new@test.com",
                password: "hashed-password",
                name: "New User",
            });
        });
    });

    describe("login", () => {
        it("should return null if user not found", async () => {
            // Arrange
            userRepo.findByEmail.mockResolvedValue(null);

            // Act
            const result = await authService.login({ email: "notfound@test.com", password: "1234" });

            // Assert
            expect(result).toBeNull();
        });

        it("should return null if password is invalid", async () => {
            // Arrange
            const fakeUser = { id: 1, email: "test@test.com", password: "hashed-password" };
            userRepo.findByEmail.mockResolvedValue(fakeUser);
            mockedBcrypt.hash.mockImplementation(() => "wronghash");

            // Act
            const result = await authService.login({ email: "test@test.com", password: "1234" });

            // Assert
            expect(result).toBeNull();
        });

        it("should return token and user if password is correct", async () => {
            // Arrange
            const fakeUser = { id: 1, email: "test@test.com", password: "hashed-password" };
            userRepo.findByEmail.mockResolvedValue(fakeUser);
            mockedBcrypt.hash.mockImplementation(() => "hashed-password");
            mockedJwt.sign.mockImplementation(() => "fake-jwt-token");

            // Act
            const result = await authService.login({ email: "test@test.com", password: "1234" });

            // Assert
            expect(result).toEqual({
                token: "fake-jwt-token",
                user: { id: 1, email: "test@test.com" },
            });
            expect(mockedJwt.sign).toHaveBeenCalledWith({ userId: 1 }, expect.any(String), { expiresIn: "1d" });
        });
    });
});
