import { IProductRepository } from '../abstractions/repositories/IProductRepository';
import { AppDataSource } from '../contexts/AppDataSource';
import { Product } from '../models/entities/Product';
import { Repository } from 'typeorm';

export class ProductRepository implements IProductRepository {
    private repo: Repository<Product>;

    constructor() {
        this.repo = AppDataSource.getRepository(Product);
    }

    findAll(): Promise<Product[]> {
        return this.repo.find();
    }

    findById(id: number): Promise<Product | null> {
        return this.repo.findOneBy({ id });
    }

    create(productData: Partial<Product>): Promise<Product> {
        const product = this.repo.create(productData);
        return this.repo.save(product);
    }

    update(id: number, productData: Partial<Product>): Promise<Product | null> {
        return this.repo.findOneBy({ id }).then(product => {
            if (!product) return null;
            Object.assign(product, productData);
            return this.repo.save(product);
        });
    }

    delete(id: number): Promise<boolean> {
        return this.repo.delete(id).then(result => result.affected === 1);
    }
}
