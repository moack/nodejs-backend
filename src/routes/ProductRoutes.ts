import { Router, Request, Response } from 'express';
import { createAuthMiddleware } from '../middleware/AuthenticationMiddleware';
import { container } from 'tsyringe';
import { AuthenticationService } from '../services/AuthenticationService';
import { ProductService } from '../services/ProductService';

// Routers
const router = Router();

// Get DI components
const productService = container.resolve(ProductService);
const authService = container.resolve(AuthenticationService);

// Setup Routers
router.use(createAuthMiddleware(authService));

// GET all products
router.get('/', async (_req: Request, res: Response) => {
    const products = await productService.findAll();
    res.json(products);
});

// GET product by ID
router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const product = await productService.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// POST create product
router.post('/', async (req: Request, res: Response) => {
    const { name, price, description } = req.body;
    const product = await productService.create({ name, price, description });
    res.status(201).json(product);
});

// PUT update product
router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const updated = await productService.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
});

// DELETE product
router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await productService.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json();
});

export default router;
