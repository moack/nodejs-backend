import { Product } from "../../models/entities/Product";

// Repository for all Products
export interface IProductRepository {
    // Finds all Products in the Database
    findAll(): Promise<Product[]>;

    // Find a Product by it's Primary key in the Database
    findById(id: number): Promise<Product | null>;

    // Creates a Product in Database
    create(productData: Partial<Product>): Promise<Product>;

    // Updates a Product in Database
    update(id: number, productData: Partial<Product>): Promise<Product | null>;

    // Deletes a Product from Database
    delete(id: number): Promise<boolean>;
}