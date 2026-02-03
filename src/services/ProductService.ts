import { IProductService } from '../abstractions/services/IProductService';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../abstractions/repositories/IProductRepository';
import { Product } from '../models/entities/Product';

@injectable()
export class ProductService implements IProductService {
    constructor(@inject("IProductRepository") private _products: IProductRepository) {
    }

    findAll(): Promise<Product[]> {
        return this._products.findAll();
    }
    
    findById(id: number): Promise<Product | null> {
        return this._products.findById(id);
    }
    
    create(product: Partial<Product>): Promise<Product> {
        return this._products.create(product);
    }
    
    update(id: number, product: Partial<Product>): Promise<Product | null> {
        return this._products.update(id, product);
    }
    
    delete(id: number): Promise<boolean> {
        return this._products.delete(id);
    }
}
