import { Delete } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Body, Controller, Get, Headers, NotAcceptableException, Param, Patch, Post, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from './dto/create-project-dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }
    @Get()
    listProjects(@Req() { user }, @Headers('username') username) {
        if (user.username !== username) throw new NotAcceptableException('username passed in headers must be the same of logged user.')
        if (!username) throw new NotAcceptableException('username must be passed in headers.')
        return this.projectsService.listProjects(username)
    }

    @Get(':id')
    getProject(@Param('id') id: string) {
        return this.projectsService.getProject(id)
    }

    @Post()
    create(@Req() { user }, @Headers('username') username, @Body() createProjectDto: CreateProjectDto) {
        if (user.username !== username) throw new NotAcceptableException('username passed in headers must be the same of logged user.')
        if (!username) throw new NotAcceptableException('username must be passed in headers.')
        return this.projectsService.create(createProjectDto, username)
    }

    @Put(':id')
    editProject(@Req() { user }, @Param('id') id: string, @Headers('username') username, @Body() createProjectDto: CreateProjectDto) {
        if (user.username !== username) throw new NotAcceptableException('username passed in headers must be the same of logged user.')
        if (!username) throw new NotAcceptableException('username must be passed in headers.')
        return this.projectsService.editProject(createProjectDto, id)
    }

    @Patch(':id/done')
    markProjectAsDone(@Req() { user }, @Param('id') id: string, @Headers('username') username) {
        if (user.username !== username) throw new NotAcceptableException('username passed in headers must be the same of logged user.')
        if (!username) throw new NotAcceptableException('username must be passed in headers.')
        return this.projectsService.markProjectAsDone(id)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteProject(@Req() { user }, @Param('id') id: string, @Headers('username') username) {
        if (user.username !== username) throw new NotAcceptableException('username passed in headers must be the same of logged user.')
        if (!username) throw new NotAcceptableException('username must be passed in headers.')
        return this.projectsService.deleteProject(id)
    }


}
