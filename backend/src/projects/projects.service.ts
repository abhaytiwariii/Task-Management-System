import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    if (!userId) return [];
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const project = await this.prisma.project.findFirst({
      where,
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found or unauthorized`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        priority: createProjectDto.priority || 'Medium',
        lead: createProjectDto.lead || 'Admin',
        dueDate: createProjectDto.dueDate ? new Date(createProjectDto.dueDate) : null,
        userId: createProjectDto.userId,
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const existing = await this.prisma.project.findFirst({ where });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found or unauthorized`);
    }

    const data: any = { ...updateProjectDto };
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const existing = await this.prisma.project.findFirst({ where });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found or unauthorized`);
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
