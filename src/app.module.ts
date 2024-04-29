import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { join } from 'path';
import { ProjectModule } from './project/projects.module'
import { UserModule } from './users/user.module'
import { ClientModule } from './client/clinet.module'
import { AuthModule } from './users/auth/auth.module'

@Module({
  imports: [
    ProjectModule,
    UserModule,
    ClientModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'timesheet',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
      
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
