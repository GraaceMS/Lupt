import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import {
  getPlayers,
  addPlayer,
  getPlayer,
  updatePlayer,
  getTeams
} from '../utils/api';
import styles from './style.module.css';
import { IoArrowBack } from 'react-icons/io5';

interface Player {
  id?: number;
  name: string;
  age: number;
  team_id: number;
}

interface Team {
  id: number;
  name: string;
}

const EditPlayer: FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [team_id, setteam_id] = useState<number>(0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadPlayersAndTeams = async () => {
      setLoading(true);
      try {
        const [playersData, teamsData] = await Promise.all([
          getPlayers(),
          getTeams(),
        ]);
        setTeams(teamsData); 
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível carregar jogadores ou times', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadPlayersAndTeams();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      const playerData = await getPlayer(id);
      setName(playerData.name);
      setAge(playerData.age); // Atualiza a idade assim que os dados são carregados
      setteam_id(playerData.team_id);
      setCurrentPlayer(playerData); 
      setShowForm(true);
    } catch (error) {
      Swal.fire('Erro', 'Não foi possível carregar os detalhes do jogador', 'error');
    }
  };

  const handleSavePlayer = async () => {
    try {
      const playerData: Player = {
        id: currentPlayer?.id,
        name,
        age,
        team_id,
      };

      if (playerData.id) {
        await updatePlayer(playerData.id, playerData);
        Swal.fire({
          title: 'Sucesso',
          text: 'Jogador editado com sucesso',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/');
        });
      } else {
        await addPlayer(playerData);
        Swal.fire('Sucesso', 'Jogador cadastrado com sucesso', 'success');
      }

      setShowForm(false);
    } catch (error) {
      Swal.fire('Erro!', 'Não conseguimos cadastrar ou editar o jogador, tente novamente mais tarde.', 'error');
    }
  };

  const handleSubmit = () => {
    if (!name || isNaN(age) || !team_id) {
      Swal.fire('Erro!', 'Preencha todos os campos corretamente.', 'error');
      return;
    }
    handleSavePlayer();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('id');
    if (storedPlayerId) {
      handleEdit(Number(storedPlayerId));
    }
  }, []);

  return (
    <div className={styles.formContainer}>
      {loading ? (
        <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-80 z-50">
          <img src="/gifpac.gif" alt="Loading..." />
        </div>
      ) : (
        <>
          {showForm ? (
            <div className={styles.form}>
              <div className={styles.back}>
                <button
                  onClick={handleGoHome}
                  className={`${styles.button} ${styles.goHomeButton}`}
                >
                  <IoArrowBack style={{ marginRight: '8px' }} />
                  Voltar
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-6">Editar Jogador</h2>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
                <span className={styles.divider}></span>
                <input
                  type="number"
                  placeholder="Idade"
                  value={age} // Define o valor do campo como o estado da idade
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <select
                  value={team_id}
                  onChange={(e) => setteam_id(Number(e.target.value))}
                  className={styles.input}
                >
                  <option value="">Time</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={handleSubmit} className={`${styles.button} ${styles.saveButton}`}>
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.loader}>
              <img src="/gifpac.gif" alt="Loading..." />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditPlayer;
