import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId?: string) {
    const where: any = { userId };
    if (projectId) {
      where.projectId = projectId;
    }
    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    if (createTaskDto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: createTaskDto.projectId, userId: createTaskDto.userId },
      });
      if (!project) {
        throw new NotFoundException(`Project with ID ${createTaskDto.projectId} not found or does not belong to user`);
      }
    }

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (updateTaskDto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: updateTaskDto.projectId, userId: existing.userId },
      });
      if (!project) {
        throw new NotFoundException(`Project with ID ${updateTaskDto.projectId} not found or does not belong to user`);
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
