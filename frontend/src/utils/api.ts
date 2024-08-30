import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getPlayers = async () => {
  try {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter jogadores:', error);
    throw error;
  }
};


export const getPlayer = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/players/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter jogador:', error);
    throw error;
  }
};


export const getTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/teams`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter times:', error);
    throw error;
  }
};



export const addPlayer = async (playerData: { name: string; age: number; team_id: number }) => {
  console.log('Adicionando jogador com dados:', playerData);
  try {
    const response = await axios.post(`${API_URL}/players`, playerData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error);
    throw error;
  }
};



export const updatePlayer = async (id: number, playerData: { name?: string; age?: number; team_id?: number }) => {
  console.log('updateplayer       ',playerData)
  const {team_id} = playerData
  try {
    const response = await axios.patch(`${API_URL}/players/${id}`, playerData);
    console.log('testando          ',response)
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar jogador:', error);
    throw error;
  }
};


export const deletePlayer = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/players/${id}`);
  } catch (error) {
    console.error('Erro ao excluir jogador:', error);
    throw error;
  }
};
