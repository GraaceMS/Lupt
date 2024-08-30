import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Players, Teams } from '@prisma/client';
import { PrismaService } from 'src/database/prismaService';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<Players> {
    console.log('Create data:', data);

    if (data.team_id === undefined || isNaN(data.team_id)) {
      console.log('Invalid Team ID:', data.team_id);
      throw new BadRequestException('Invalid Team ID');
    }

    console.log('Checking if team exists with ID:', data.team_id);
    const teamExists = await this.prisma.teams.findFirst({
      where: { id: data.team_id },
    });

    if (!teamExists) {
      console.log('Team not found with ID:', data.team_id);
      throw new NotFoundException(`Team with ID ${data.team_id} not found`);
    }

    try {
      return await this.prisma.players.create({
        data: {
          name: data.name,
          age: data.age,
          team: {
            connect: { id: data.team_id },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error('Error creating player:', error);
      throw new InternalServerErrorException('Erro ao adicionar jogador');
    }
  }

  async findAll(teamId?: string): Promise<Players[]> {
    const parsedTeamId = teamId ? parseInt(teamId, 10) : undefined;
  
    const query = parsedTeamId !== undefined ? 
      { team_id: parsedTeamId } : {}; 
  
    try {
      return await this.prisma.players.findMany({
        where: query,
        include: {
          team: true,
        },
      });
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new InternalServerErrorException('Erro ao buscar jogadores');
    }
  }
  

  async findOne(id: number): Promise<Players> {
    console.log('Find one player with ID:', id);

    if (isNaN(id) || id <= 0) {
      console.log('Invalid ID:', id);
      throw new BadRequestException('Invalid ID');
    }

    try {
      const player = await this.prisma.players.findFirst({
        where: { id },
      });

      if (!player) {
        console.log('Player not found with ID:', id);
        throw new NotFoundException(`Player with ID ${id} not found`);
      }
      return player;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw new InternalServerErrorException('Erro ao buscar jogador');
    }
  }

  async update(
    id: number,
    data: { name?: string; age?: number; teamId?: number },
  ): Promise<Players> {
    console.log('Update player with ID:', id, 'and data:', data);

    if (isNaN(id) || id <= 0) {
      console.log('Invalid ID:', id);
      throw new BadRequestException('Invalid ID');
    }

    try {
      console.log('Checking if player exists with ID:', id);
      const player = await this.prisma.players.findFirst({
        where: { id },
      });

      if (!player) {
        console.log('Player not found with ID:', id);
        throw new NotFoundException(`Player with ID ${id} not found`);
      }

      if (data.teamId) {
        console.log('Checking if team exists with ID:', data.teamId);
        if (isNaN(data.teamId)) {
          console.log('Invalid Team ID:', data.teamId);
          throw new BadRequestException('Invalid Team ID');
        }

        const teamExists = await this.prisma.teams.findFirst({
          where: { id: data.teamId },
        });

        if (!teamExists) {
          console.log('Team not found with ID:', data.teamId);
          throw new NotFoundException(`Team with ID ${data.teamId} not found`);
        }
      }

      const updatedPlayer = await this.prisma.players.update({
        where: { id },
        data: {
          name: data.name ?? player.name,
          age: data.age ?? player.age,
          team: data.teamId ? { connect: { id: data.teamId } } : undefined,
          updated_at: new Date(),
        },
      });

      console.log('Player updated successfully:', updatedPlayer);
      return updatedPlayer;
    } catch (error) {
      console.error('Error updating player:', error);
      throw new InternalServerErrorException('Erro ao atualizar jogador');
    }
  }

  async delete(id: number): Promise<void> {
    console.log('Deleting player with ID:', id);

    if (isNaN(id) || id <= 0) {
      console.log('Invalid ID:', id);
      throw new BadRequestException('Invalid ID');
    }

    try {
      console.log('Checking if player exists with ID:', id);
      const player = await this.prisma.players.findFirst({
        where: { id },
      });

      if (!player) {
        console.log('Player not found with ID:', id);
        throw new NotFoundException(`Player with ID ${id} not found`);
      }

      await this.prisma.players.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting player:', error);
      throw new InternalServerErrorException('Erro ao excluir jogador');
    }
  }
}
