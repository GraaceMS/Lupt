import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  onAddPlayer: () => void;
}
const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema de Jogadores</h1>    
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
         <Link href={'addPlayer'}>Adicionar Jogador</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;
