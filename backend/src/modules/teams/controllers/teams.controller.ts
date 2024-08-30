import { Controller, Get, Post } from '@nestjs/common';
import { TeamsService } from '../services/teams.service';

@Controller('api/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    return this.teamsService.findAll();
  }

  @Post('seed')
  async seed() {
    const team = await this.teamsService.seed();
    return { message: 'Time de exemplo adicionado', team };
  }
}
