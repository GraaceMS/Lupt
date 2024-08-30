import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prismaService';
import { PlayersController } from './controllers/user.controller';
import { PlayersService } from './services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlayersController],
  providers: [PlayersService, PrismaService],
  exports: [PlayersService],
})
export class UserModule {}
