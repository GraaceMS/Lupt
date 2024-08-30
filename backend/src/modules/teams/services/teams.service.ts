import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prismaService';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.teams.findMany();
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new InternalServerErrorException('Erro ao buscar times');
    }
  }
  async seed() {
    try {
      const team = await this.prisma.teams.create({
        data: {
          name: 'Time de Exemplo',
        },
      });
      console.log('Time de exemplo adicionado:', team);
      return team;
    } catch (error) {
      console.error('Error seeding teams:', error);
      throw new InternalServerErrorException(
        'Erro ao adicionar time de exemplo',
      );
    }
  }
}
