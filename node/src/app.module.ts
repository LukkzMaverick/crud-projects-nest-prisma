import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [ProjectsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
