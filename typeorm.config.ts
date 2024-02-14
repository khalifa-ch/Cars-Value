import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Report } from './src/reports/report.entity';
import { User } from './src/users/user.entity';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

const configService = new ConfigService();
export default new DataSource({
  type: 'sqlite',
  database: configService.get('DB_NAME'),
  entities: [User, Report],
  synchronize: true,
  migrations: [],
});
