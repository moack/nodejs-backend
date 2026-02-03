import { User } from "../../models/entities/User";

export interface IUserRepository {
    findAll(): Promise<User[]>;

    // Find user by ID
    findById(id: number): Promise<User | null>;

    // Find user by email
    findByEmail(email: string): Promise<User | null>;

    // Create a new user
    create(userData: Partial<User>): Promise<User>;

    // Update a user
    update(id: number, userData: Partial<User>): Promise<User | null>;

    // Delete a user
    delete(id: number): Promise<boolean>;
}