import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { PlayersController } from './controllers/user.controller';
import { PlayersService } from './services/user.service';

@Module({
  imports: [PrismaModule],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService],
})
export class PlayersModule {}
