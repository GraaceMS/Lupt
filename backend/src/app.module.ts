import { Module } from '@nestjs/common';

import { PrismaModule } from './database/prisma.module';
import { PrismaService } from './database/prismaService';
import { PlayersController } from './modules/players/controllers/user.controller';
import { PlayersModule } from './modules/players/players.module';
import { PlayersService } from './modules/players/services/user.service';
import { TeamsController } from './modules/teams/controllers/teams.controller';
import { TeamsService } from './modules/teams/services/teams.service';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [TeamsModule, PlayersModule, PrismaModule],
  controllers: [TeamsController, PlayersController],
  providers: [TeamsService, PlayersService, PrismaService],
})
export class AppModule {}
