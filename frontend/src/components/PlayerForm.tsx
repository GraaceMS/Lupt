import { FC, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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

interface PlayerFormProps {
  player: Player | null;
  onClose: () => void;
  onSave: (player: Player) => void;
  teams: Team[];
}

const PlayerForm: FC<PlayerFormProps> = ({ player, onClose, onSave, teams }) => {
  const [name, setName] = useState<string>(player?.name ?? '');
  const [age, setAge] = useState<number>(player?.age ?? 0);
  const [teamId, setTeamId] = useState<number>(player?.team_id ?? 0);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setAge(player.age);
      setTeamId(player.team_id);
    }
  
  }, [player]);

  const handleSubmit = () => {
    if (!name || isNaN(age) || !teamId) {
      Swal.fire('Erro!', 'Preencha todos os campos corretamente.', 'error');
      return;
    }

    onSave({
      id: player?.id ?? 0,
      name,
      age,
      team_id: teamId,
    });
  };
  console.log(player);
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">{player ? 'Editar Jogador' : 'Adicionar Jogador'}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Timee</label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Selecione um time</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
