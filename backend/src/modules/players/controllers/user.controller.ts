import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlayersService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

class UpdatePlayerDto {
  name?: string;
  age?: number;
  teamId?: number;
}

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    console.log('Creating player with data:', data);
    return this.playersService.create(data);
  }

  @Get()
  async findAll(@Query('teamId') teamId: string) {
    console.log('Finding all players with teamId:', teamId);
    return this.playersService.findAll(teamId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('Finding player with id:', id);
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    console.log('Updating player with id:', id, 'and data:', updatePlayerDto);
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    console.log('Deleting player with id:', id);
    return this.playersService.delete(id);
  }
}
