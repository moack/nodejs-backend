import { DataSource } from 'typeorm';
import { Product } from '../models/entities/Product';
import { User } from '../models/entities/User';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'testdb',
    entities: [Product, User],
    synchronize: true, // DEV ONLY: auto-create tables
    logging: false,
});
