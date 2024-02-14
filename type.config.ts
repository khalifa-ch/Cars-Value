import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export default class TypeOrmCongfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: 'sqlite',
          database: configService.get('DB_NAME'),
          synchronize: true,
          entities: ['**/*.entity.js'],
        };
        break;
      case 'test':
        return {
          type: 'sqlite',
          database: configService.get('DB_NAME'),
          synchronize: false,
          entities: ['**/*.entity.ts'],
        };
        break;
      case 'production':
        // Adjust configuration for production environment if needed
        break;
      default:
    }
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    ConfigService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    TypeOrmCongfig.getOrmConfig(ConfigService),
};
// "typeorm": "ts-node --require tsconfig-paths/register ./node_modules/typeorm/cli",
// "migration:run": "npm run typeorm migration:run -- -d ./db/typeorm.config.ts",
// "migration:generate": "npm run typeorm -- -d ./db/typeorm.config.ts migration:generate ./db/migrations/%npm_config_name%",
// "migration:create": "npm run typeorm -- migration:create ./db/migrations/$npm_config_name",
// "migration:revert": "npm run typeorm -- -d ./db/typeorm.config.ts migration:revert",
// "migration:show": "npm run typeorm -- migration:show -d ./db/typeorm.config.ts"
