import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project-dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService, private readonly httpService: HttpService) { }

    async getProject(id: string) {
        const project: any = await this.prisma.project.findUnique({ where: { id } })
        if (!project) throw new NotFoundException('Project not found in the database.')
        const { data } = await firstValueFrom(this.httpService.get(`https://viacep.com.br/ws/${project.zip_code}/json/`))
        delete project.zip_code
        if (data.localidade && data.uf) {
            project.localization = `${data.localidade}/${data.uf}`
        } else {
            project.localization = null
        }
        return project
    }

    async listProjects(username: string) {
        const projects = await this.prisma.project.findMany({
            where: {
                username
            }
        })
        return projects
    }

    create(createProjectDto: CreateProjectDto, username: string) {
        createProjectDto.deadline = new Date(createProjectDto.deadline)
        return this.prisma.project.create({ data: { ...createProjectDto, user: { connect: { username } } } })
    }

    editProject(createProjectDto: CreateProjectDto, id: string) {
        createProjectDto.deadline = new Date(createProjectDto.deadline)
        return this.prisma.project.update({ where: { id }, data: createProjectDto })
    }

    markProjectAsDone(id: string) {
        return this.prisma.project.update({ where: { id }, data: { done: true } })
    }

    async deleteProject(id: string) {
        const project = await this.prisma.project.findUnique({ where: { id } })
        if (!project) throw new NotFoundException('Project not found in the database.')
        await this.prisma.project.delete({ where: { id } })
    }
}
