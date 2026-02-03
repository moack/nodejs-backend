import { User } from "../../models/entities/User";

// Service for User related Logic
export interface IUserService {
    // Finds a User by it's Primary Key
    findById(id: number): Promise<User | null>
}