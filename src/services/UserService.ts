import { inject, injectable } from "tsyringe";
import { IUserService } from "../abstractions/services/IUserService";
import { User } from "../models/entities/User";
import { IUserRepository } from "../abstractions/repositories/IUserRepository";

@injectable()
export class UserService implements IUserService {
    constructor(@inject("IUserRepository") private _users: IUserRepository) {
    }

    findById(id: number): Promise<User | null> {
        return this._users.findById(id);
    }
}