import { container } from "tsyringe";
import { IUserRepository } from "../../src/abstractions/repositories/IUserRepository";
import { UserRepository } from "../../src/repositories/UserRepository";

export const fakeUserRepo: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
} as any;

container.registerInstance<IUserRepository>("IUserRepository", fakeUserRepo);
