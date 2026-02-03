import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthenticationRoutes';
import productRoutes from './routes/ProductRoutes';
import { AppDataSource } from './contexts/AppDataSource';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
);

// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// Only listen if not in test
if (process.env.NODE_ENV === 'test') {
    // Start server without DB
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log('Server running'));
} else {
    // Start server after DB connects
    AppDataSource.initialize()
        .then(() => {
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`Microservice running on http://localhost:${PORT}`);
            });
        })
        .catch(err => console.error('Database connection error', err));
}