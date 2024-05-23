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
import { InvitationModule } from './invitation/invitation.module'
import { OrganizationModule } from './organization/organization.module'
require('dotenv').config();


@Module({
  imports: [
    ProjectModule,
    UserModule,
    ClientModule,
    AuthModule,
    InvitationModule,
    OrganizationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
