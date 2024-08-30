import { FC, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import {
  getPlayers,
  addPlayer,
  getTeams,
  updatePlayer,
} from '../utils/api';
import { IoArrowBack } from 'react-icons/io5';

import styles from './style.module.css';

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

interface PlayerFormProps {
  player: Player | null;
  onClose: () => void;
  onSave: (player: Player) => void;
  teams: Team[];
}

const PlayerForm: FC<PlayerFormProps> = ({ player }) => {
  const [name, setName] = useState<string>(player?.name ?? '');
  const [age, setAge] = useState<number>(player?.age ?? 0);
  const [teamId, setTeamId] = useState<number>(player?.team_id ?? 0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  const handleSavePlayer = async (player: Player) => {
    try {
      if (player.id) {
        await updatePlayer(player.id, player);
      } else {
        await addPlayer(player);
      }
      Swal.fire({
        title: 'Sucesso',
        text: 'Jogador cadastrado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/');
      });

    } catch (error) {
      Swal.fire(
        'Erro!',
        'Não conseguimos cadastrar o jogador, tente novamente mais tarde.',
        'error'
      );
    }
  };

  const handleSubmit = () => {
    if (!name || isNaN(age) || !teamId) {
      Swal.fire('Erro!', 'Preencha todos os campos corretamente.', 'error');
      return;
    }

    handleSavePlayer({
      id: player?.id ?? 0,
      name,
      age,
      team_id: teamId,
    });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAge(value ? Number(value) : 0);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.formContainer}>
      {loading && (
        <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-80 z-50">
          <img src="/gifpac.gif" alt="Loading..." />
        </div>
      )}

      <div className={styles.form}>
        <div className={styles.back}> <button
          onClick={handleGoHome}
          className={`${styles.button} ${styles.goHomeButton}`}
        ><IoArrowBack style={{ marginRight: '8px' }} />
          Voltar
        </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">{'Adicionar Jogador'}</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nome'
          />
          <span className={styles.divider}></span>
          <input
            type="number"
            onChange={handleAgeChange}
            placeholder='Idade'
          />
        </div>
        <div className={styles.inputGroup}>

          <select
            className={styles.time}
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
          >
            <option className={styles.time} value="">Time</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            className={`${styles.button} ${styles.saveButton}`}
          >
            Salvar
          </button>
          {/* <button
            onClick={handleCancel}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancelar
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
