"use client";

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getPlayers,
  addPlayer,
  getPlayer,
  deletePlayer,
  getTeams,
  updatePlayer,
} from '../utils/api';
import Header from '../components/Header';
import PlayerForm from '@/components/PlayerForm';
import Link from 'next/link';

interface Player {
  id?: number;
  name: string;
  age: number;
  team_id: number;
  team?: Team;
}

interface Team {
  id: number;
  name: string;
}

const Home = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [noPlayers, setNoPlayers] = useState<boolean>(false);

  useEffect(() => {
    const loadPlayersAndTeams = async () => {
      setLoading(true);
      try {
        const [playersData, teamsData] = await Promise.all([
          getPlayers(),
          getTeams(),
        ]);
        setPlayers(playersData);
        setTeams(teamsData);
        setNoPlayers(playersData.length === 0);
      } catch (error) {
        Swal.fire(
          'Erro',
          'Não foi possível carregar jogadores ou times',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };
    loadPlayersAndTeams();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      const player = await getPlayer(id);
      setCurrentPlayer(player);
      setShowForm(true);
    } catch (error) {
      Swal.fire(
        'Erro',
        'Não foi possível carregar os detalhes do jogador',
        'error'
      );
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
    });

    if (result.isConfirmed) {
      try {
        await deletePlayer(id);
        const updatedPlayers = players.filter((player) => player.id !== id);
        setPlayers(updatedPlayers);
        setNoPlayers(updatedPlayers.length === 0);
        Swal.fire('Excluído!', 'O jogador foi excluído.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir o jogador', 'error');
      }
    }
  };

  const handleSavePlayer = async (player: Player) => {
    try {
      if (player.id) {
        await updatePlayer(player.id, player);
      } else {
        await addPlayer(player);
      }
      Swal.fire('Sucesso', 'Jogador cadastrado com sucesso', 'success');
      setShowForm(false);
      const updatedPlayers = await getPlayers();
      setPlayers(updatedPlayers);
      setNoPlayers(updatedPlayers.length === 0);
    } catch (error) {
      Swal.fire(
        'Erro!',
        'Não conseguimos cadastrar o jogador, tente novamente mais tarde.',
        'error'
      );
    }
  };

  const handleAddPlayer = () => {
    setCurrentPlayer(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddPlayer={handleAddPlayer} />

      <main className="flex-grow p-8">
        {loading ? (
         <div className="flex justify-center items-center">
         <img src="/gifpac.gif" alt="Loading..." />
          </div>
        ) : (
          <>
            {players.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">ID</th>
                      <th className="py-2 px-4 border-b text-left">Nome</th>
                      <th className="py-2 px-4 border-b text-left">Idade</th>
                      <th className="py-2 px-4 border-b text-left">Time</th>
                      <th className="py-2 px-4 border-b text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map(player => (
                      <tr key={player.id}>
                        <td className="py-2 px-4 border-b text-left">{player.id}</td>
                        <td className="py-2 px-4 border-b text-left">{player.name}</td>
                        <td className="py-2 px-4 border-b text-left">{player.age}</td>
                        <td className="py-2 px-4 border-b text-left">
                          {teams.find(teams => teams.id === player.team_id)?.name || 'Sem time'}
                        </td>
                        <td className="py-2 px-4 border-b text-left space-x-4">
                          <button
                          
                          onClick={()=>localStorage.setItem("id", `${player.id}`)}
                            className="bg-yellow-600 text-white px-2 py-1 rounded-md"
                          >
                             <Link href={'editPlayer'}>Editar</Link> 
                          </button>
                          <button
                            onClick={() => handleDelete(player.id!)}
                            className="bg-red-600 text-white px-2 py-1 rounded-md"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Não existe nenhum jogador cadastrado</p>
              </div>
            )}

            {showForm ?  (
              <PlayerForm
                player={currentPlayer}
                onClose={handleCloseForm}
                onSave={handleSavePlayer}
                teams={teams}
              />
            ) : (
              <div className="flex justify-center items-center">
               </div>
             )
             } 
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
