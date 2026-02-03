import { IUserRepository } from '../abstractions/repositories/IUserRepository';
import { AppDataSource } from '../contexts/AppDataSource';
import { User } from '../models/entities/User';
import { Repository } from 'typeorm';

export class UserRepository implements IUserRepository {
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    // Find all users
    findAll(): Promise<User[]> {
        return this.repo.find();
    }

    // Find user by ID
    findById(id: number): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    // Find user by email
    findByEmail(email: string): Promise<User | null> {
        return this.repo.findOneBy({ email });
    }

    // Create a new user
    async create(userData: Partial<User>): Promise<User> {
        const user = this.repo.create(userData);
        return this.repo.save(user);
    }

    // Update a user
    async update(id: number, userData: Partial<User>): Promise<User | null> {
        const user = await this.repo.findOneBy({ id });
        if (!user) return null;
        Object.assign(user, userData);
        return this.repo.save(user);
    }

    // Delete a user
    async delete(id: number): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected === 1;
    }
}
