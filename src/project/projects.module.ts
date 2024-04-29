import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './entities/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects])],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}