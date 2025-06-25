import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Pokemon, PokemonMove } from '@/types/game';
import { createWillieTeam } from '@/services/pokeapi';
import { Button } from '@/components/ui/button';

const CombatScreen = () => {
  const { state, setCurrentScreen, setDialogue, updateFlag } = useGame();
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon | null>(null);
  const [playerCurrentIndex, setPlayerCurrentIndex] = useState(0);
  const [opponentPokemon, setOpponentPokemon] = useState<Pokemon | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Pokemon[]>([]);
  const [opponentCurrentIndex, setOpponentCurrentIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatOver, setCombatOver] = useState(false);
  const [showPokemonSelection, setShowPokemonSelection] = useState(false);
  // État local pour gérer l'équipe du joueur pendant le combat
  const [playerTeam, setPlayerTeam] = useState<Pokemon[]>([]);

  useEffect(() => {
    // Initialiser le combat
    const initCombat = async () => {
      if (state.player && state.player.team.length > 0) {
        // Copier l'équipe du joueur pour éviter les mutations directes
        const teamCopy = state.player.team.map(pokemon => ({ ...pokemon }));
        setPlayerTeam(teamCopy);
        
        const playerFirstPokemon = { ...teamCopy[0] };
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
    const randomFactor = 0.85 + Math.random() * 0.15;
    
    return Math.max(1, Math.floor(baseDamage * randomFactor));
  };

  const switchOpponentPokemon = () => {
    const nextIndex = opponentCurrentIndex + 1;
    if (nextIndex < opponentTeam.length) {
      setOpponentCurrentIndex(nextIndex);
      const nextPokemon = { ...opponentTeam[nextIndex] };
      setOpponentPokemon(nextPokemon);
      setBattleLog(prev => [...prev, `Willie envoie ${nextPokemon.name} !`]);
      return true;
    }
    return false;
  };

  const switchPlayerPokemon = (pokemonIndex: number) => {
    if (pokemonIndex >= playerTeam.length) return false;
    
    const selectedPokemon = playerTeam[pokemonIndex];
    
    // Vérifier que le Pokémon n'est pas K.O.
    if (selectedPokemon.stats.hp <= 0) {
      console.log('Pokémon K.O. sélectionné, impossible de l\'utiliser');
      return false;
    }
    
    // Mettre à jour l'état du Pokémon actuel dans l'équipe avant de changer
    if (playerPokemon) {
      const updatedTeam = [...playerTeam];
      updatedTeam[playerCurrentIndex] = { ...playerPokemon };
      setPlayerTeam(updatedTeam);
    }
    
    // Changer de Pokémon
    const nextPokemon = { ...selectedPokemon };
    setPlayerPokemon(nextPokemon);
    setPlayerCurrentIndex(pokemonIndex);
    setBattleLog(prev => [...prev, `Vous envoyez ${nextPokemon.name} !`]);
    setShowPokemonSelection(false);
    
    // Le tour du joueur se termine après le changement
    setIsPlayerTurn(false);
    
    // L'adversaire attaque après le changement
    setTimeout(() => {
      if (opponentPokemon) {
        opponentTurn(opponentPokemon);
      }
    }, 1500);
    
    return true;
  };

  const updatePlayerPokemonInTeam = (updatedPokemon: Pokemon) => {
    const updatedTeam = [...playerTeam];
    updatedTeam[playerCurrentIndex] = { ...updatedPokemon };
    setPlayerTeam(updatedTeam);
    setPlayerPokemon(updatedPokemon);
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
      
      setTimeout(() => {
        const hasNextPokemon = switchOpponentPokemon();
        if (!hasNextPokemon) {
          setTimeout(() => {
            endCombat(true);
          }, 1000);
        } else {
          setIsPlayerTurn(false);
          setTimeout(() => {
            const nextOpponentIndex = opponentCurrentIndex + 1;
            if (nextOpponentIndex < opponentTeam.length) {
              opponentTurn(opponentTeam[nextOpponentIndex]);
            }
          }, 1500);
        }
      }, 1000);
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
    
    // Mettre à jour le Pokémon du joueur et l'équipe
    updatePlayerPokemonInTeam(updatedPlayer);
    setBattleLog(prev => [...prev, `${currentOpponent.name} utilise ${randomMove.name} !`, `${playerPokemon.name} perd ${damage} PV !`]);
    
    if (newPlayerHp === 0) {
      setBattleLog(prev => [...prev, `${playerPokemon.name} est K.O. !`]);
      
      // Vérifier s'il y a d'autres Pokémon disponibles
      const availablePokemon = playerTeam.filter((pokemon, index) => 
        index !== playerCurrentIndex && pokemon.stats.hp > 0
      );
      
      if (availablePokemon.length > 0) {
        setBattleLog(prev => [...prev, 'Choisissez votre prochain Pokémon !']);
        setShowPokemonSelection(true);
        setIsPlayerTurn(true);
      } else {
        setTimeout(() => {
          endCombat(false);
        }, 1000);
      }
      return;
    }
    
    setIsPlayerTurn(true);
  };

  const endCombat = (playerWon: boolean) => {
    console.log('Combat terminé, joueur a gagné:', playerWon);
    setCombatOver(true);
    setIsPlayerTurn(false);
    
    const resultMessage = playerWon ? 'Vous avez gagné !' : 'Vous avez perdu...';
    setBattleLog(prev => [...prev, resultMessage]);
    
    // Quitter automatiquement le combat après un court délai
    setTimeout(() => {
      console.log('Sortie automatique du combat');
      setCurrentScreen('exploration');
      
      // Déclencher le dialogue de Willie après être retourné en exploration
      setTimeout(() => {
        const dialogueText = playerWon 
          ? 'Bravo ! Tu es vraiment doué ! Tu as un talent naturel pour les combats Pokémon !' 
          : 'Ne t\'inquiète pas, tu feras mieux la prochaine fois ! L\'entraînement est la clé du succès !';
        
        console.log('Déclenchement du dialogue de Willie');
        setDialogue({
          isActive: true,
          speaker: 'Willie',
          text: dialogueText,
          onComplete: () => {
            console.log('Dialogue terminé, déclenchement de la fin');
            updateFlag('gameCompleted', true);
            
            setTimeout(() => {
              console.log('Retour à l\'exploration');
              setCurrentScreen('exploration');
            }, 3000);
          }
        });
      }, 1000);
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
          <div className="mt-2 text-sm">
            Pokémon restants: {opponentTeam.length - opponentCurrentIndex}
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
        {/* Log de combat - maintenant scrollable */}
        <div className="flex-1 mr-4">
          <div className="h-full overflow-y-auto text-sm max-h-32 border rounded p-2">
            {battleLog.map((message, index) => (
              <div key={index} className="mb-1">{message}</div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-1/2">
          {showPokemonSelection && (
            <div className="grid grid-cols-1 gap-2">
              <h4 className="text-lg font-bold mb-2">Choisissez un Pokémon :</h4>
              {playerTeam.map((pokemon, index) => {
                // Ne montrer que les Pokémon vivants et différents du Pokémon actuel
                if (index === playerCurrentIndex || pokemon.stats.hp === 0) return null;
                return (
                  <Button
                    key={index}
                    onClick={() => switchPlayerPokemon(index)}
                    className="p-2 text-sm"
                  >
                    {pokemon.name} (PV: {pokemon.stats.hp}/{pokemon.stats.maxHp})
                  </Button>
                );
              })}
            </div>
          )}
          {isPlayerTurn && !combatOver && !showPokemonSelection && (
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
          {!isPlayerTurn && !combatOver && !showPokemonSelection && (
            <div className="text-center text-gray-600">
              Tour de l'adversaire...
            </div>
          )}
          {combatOver && (
            <div className="text-center text-lg font-bold">
              Combat terminé !
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatScreen;
