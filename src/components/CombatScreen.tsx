
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Pokemon, PokemonMove } from '@/types/game';
import { createWillieTeam } from '@/services/pokeapi';
import { Button } from '@/components/ui/button';

const CombatScreen = () => {
  const { state, setCurrentScreen, setDialogue, updateFlag } = useGame();
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<Pokemon | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Pokemon[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatOver, setCombatOver] = useState(false);

  useEffect(() => {
    // Initialiser le combat
    const initCombat = async () => {
      if (state.player && state.player.team.length > 0) {
        const playerFirstPokemon = { ...state.player.team[0] };
        setPlayerPokemon(playerFirstPokemon);
        
        const willieTeam = await createWillieTeam();
        setOpponentTeam(willieTeam);
        if (willieTeam.length > 0) {
          setOpponentPokemon({ ...willieTeam[0] });
        }
        
        setBattleLog(['Le combat commence !', `${playerFirstPokemon.name} contre ${willieTeam[0]?.name || 'Pokémon inconnu'} !`]);
      }
    };
    
    initCombat();
  }, [state.player]);

  const calculateDamage = (attacker: Pokemon, defender: Pokemon, move: PokemonMove): number => {
    // Formule simplifiée de dégâts Pokémon
    const level = attacker.level;
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    const power = move.power;
    
    const baseDamage = ((((2 * level / 5 + 2) * power * attack / defense) / 50) + 2);
    const randomFactor = 0.85 + Math.random() * 0.15; // Entre 85% et 100%
    
    return Math.max(1, Math.floor(baseDamage * randomFactor));
  };

  const useMove = (move: PokemonMove) => {
    if (!playerPokemon || !opponentPokemon || !isPlayerTurn || combatOver) return;
    
    const damage = calculateDamage(playerPokemon, opponentPokemon, move);
    const newOpponentHp = Math.max(0, opponentPokemon.stats.hp - damage);
    
    const updatedOpponent = {
      ...opponentPokemon,
      stats: { ...opponentPokemon.stats, hp: newOpponentHp }
    };
    
    setOpponentPokemon(updatedOpponent);
    setBattleLog(prev => [...prev, `${playerPokemon.name} utilise ${move.name} !`, `${opponentPokemon.name} perd ${damage} PV !`]);
    
    if (newOpponentHp === 0) {
      setBattleLog(prev => [...prev, `${opponentPokemon.name} est K.O. !`]);
      endCombat(true);
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => opponentTurn(updatedOpponent), 1500);
  };

  const opponentTurn = (currentOpponent: Pokemon) => {
    if (!playerPokemon || !currentOpponent || combatOver) return;
    
    const randomMove = currentOpponent.moves[Math.floor(Math.random() * currentOpponent.moves.length)];
    const damage = calculateDamage(currentOpponent, playerPokemon, randomMove);
    const newPlayerHp = Math.max(0, playerPokemon.stats.hp - damage);
    
    const updatedPlayer = {
      ...playerPokemon,
      stats: { ...playerPokemon.stats, hp: newPlayerHp }
    };
    
    setPlayerPokemon(updatedPlayer);
    setBattleLog(prev => [...prev, `${currentOpponent.name} utilise ${randomMove.name} !`, `${playerPokemon.name} perd ${damage} PV !`]);
    
    if (newPlayerHp === 0) {
      setBattleLog(prev => [...prev, `${playerPokemon.name} est K.O. !`]);
      endCombat(false);
      return;
    }
    
    setIsPlayerTurn(true);
  };

  const endCombat = (playerWon: boolean) => {
    setCombatOver(true);
    const resultMessage = playerWon ? 'Vous avez gagné !' : 'Vous avez perdu...';
    setBattleLog(prev => [...prev, resultMessage]);
    
    setTimeout(() => {
      setDialogue({
        isActive: true,
        speaker: 'Willie',
        text: playerWon ? 'Bravo ! Tu es vraiment doué !' : 'Ne t\'inquiète pas, tu feras mieux la prochaine fois !',
        onComplete: () => {
          // Fondu au noir et fin du jeu
          updateFlag('gameCompleted', true);
          setTimeout(() => {
            setCurrentScreen('menu'); // Retour au menu pour l'instant
          }, 1000);
        }
      });
    }, 2000);
  };

  if (!playerPokemon || !opponentPokemon) {
    return (
      <div className="min-h-screen bg-green-800 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement du combat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-400 p-4">
      {/* Zone de combat */}
      <div className="flex justify-between items-center h-2/3">
        {/* Pokémon adverse */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Willie's {opponentPokemon.name}</h3>
          <img 
            src={opponentPokemon.sprite} 
            alt={opponentPokemon.name}
            className="w-32 h-32 mx-auto"
          />
          <div className="bg-white p-2 rounded mt-2">
            <div className="text-sm">PV: {opponentPokemon.stats.hp}/{opponentPokemon.stats.maxHp}</div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(opponentPokemon.stats.hp / opponentPokemon.stats.maxHp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pokémon du joueur */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Votre {playerPokemon.name}</h3>
          <img 
            src={playerPokemon.sprite} 
            alt={playerPokemon.name}
            className="w-32 h-32 mx-auto transform scale-x-[-1]"
          />
          <div className="bg-white p-2 rounded mt-2">
            <div className="text-sm">PV: {playerPokemon.stats.hp}/{playerPokemon.stats.maxHp}</div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(playerPokemon.stats.hp / playerPokemon.stats.maxHp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface de combat */}
      <div className="h-1/3 bg-white rounded-lg p-4 flex">
        {/* Log de combat */}
        <div className="flex-1 mr-4">
          <div className="h-full overflow-y-auto text-sm">
            {battleLog.map((message, index) => (
              <div key={index} className="mb-1">{message}</div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-1/2">
          {isPlayerTurn && !combatOver && (
            <div className="grid grid-cols-2 gap-2">
              {playerPokemon.moves.map((move, index) => (
                <Button
                  key={index}
                  onClick={() => useMove(move)}
                  className="p-2 text-sm"
                  disabled={move.pp === 0}
                >
                  {move.name}
                  <br />
                  <span className="text-xs">PP: {move.pp}/{move.maxPp}</span>
                </Button>
              ))}
            </div>
          )}
          {!isPlayerTurn && !combatOver && (
            <div className="text-center text-gray-600">
              Tour de l'adversaire...
            </div>
          )}
        </div>
      </div>
      
      {/* Fin de jeu */}
      {state.flags.gameCompleted && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-white text-4xl text-center">
            <div className="mb-4">À suivre...</div>
            <div className="text-2xl">Merci d'avoir joué !</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatScreen;
