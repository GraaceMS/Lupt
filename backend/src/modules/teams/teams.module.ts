import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TeamsController } from './controllers/teams.controller';
import { TeamsService } from './services/teams.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
