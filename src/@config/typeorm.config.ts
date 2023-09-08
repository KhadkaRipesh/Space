import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE } from 'src/constant';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DATABASE.host,
  port: DATABASE.port,
  autoLoadEntities: true,
  username: DATABASE.user,
  password: DATABASE.password,
  database: DATABASE.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
