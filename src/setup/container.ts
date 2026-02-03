import { container } from "tsyringe";
import { IUserRepository } from "../abstractions/repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AuthenticationService } from "../services/AuthenticationService";
import { IAuthenticationService } from "../abstractions/services/IAuthenticationService";
import { IProductRepository } from "../abstractions/repositories/IProductRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { IUserService } from "../abstractions/services/IUserService";
import { UserService } from "../services/UserService";
import { ProductService } from "../services/ProductService";
import { IProductService } from "../abstractions/services/IProductService";

// Register Dependencis to Dependency Injection Container

// Repositories
container.register<IUserRepository>("IUserRepository", {
    useClass: UserRepository,
});

container.register<IProductRepository>("IProductRepository", {
    useClass: ProductRepository,
});

// Services
container.register<IUserService>("IUserService", {
    useClass: UserService,
});

container.register<IProductService>("IProductService", {
    useClass: ProductService,
});

container.register<IAuthenticationService>("IAuthenticationService", {
    useClass: AuthenticationService,
});
