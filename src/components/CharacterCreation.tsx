import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { fetchPokemonList, fetchPokemon } from '@/services/pokeapi';
import { Pokemon } from '@/types/game';
import PokemonSelector from './PokemonSelector';

const CharacterCreation = () => {
  const { setCurrentScreen, setPlayer, state } = useGame();
  const { playMainTitle } = useAudio(); // La musique continue du menu
  const [playerName, setPlayerName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);
  const [pokemonList, setPokemonList] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPokemonList();
    // S'assurer que la musique continue (au cas où)
    playMainTitle();
  }, [playMainTitle]);

  const loadPokemonList = async () => {
    try {
      setIsLoading(true);
      const list = await fetchPokemonList(150); // Premier 150 Pokémon
      setPokemonList(list);
    } catch (error) {
      console.error('Error loading Pokemon list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePokemonSelect = async (pokemonId: number, slot: number) => {
    try {
      const pokemon = await fetchPokemon(pokemonId);
      const newTeam = [...selectedPokemon];
      newTeam[slot] = pokemon;
      setSelectedPokemon(newTeam);
    } catch (error) {
      console.error('Error selecting Pokemon:', error);
    }
  };

  const handleStartGame = () => {
    if (playerName.trim() && selectedPokemon.length >= 1) {
      const player = {
        name: playerName.trim(),
        team: selectedPokemon.filter(p => p), // Remove empty slots
        position: {
          x: 0,
          y: 0,
          zone: 'gas-station-exterior'
        }
      };
      setPlayer(player);
      setCurrentScreen('cinematic');
    }
  };

  const canStart = playerName.trim() && selectedPokemon.length >= 1;

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/98fe95e3-f292-4ee1-a789-9eaa446f0a51.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-white text-2xl z-10">Chargement des Pokémon...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/lovable-uploads/98fe95e3-f292-4ee1-a789-9eaa446f0a51.png)',
      }}
    >
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="bg-black/50 border-yellow-400 border-2">
          <CardHeader>
            <CardTitle className="text-3xl text-yellow-400 text-center">
              Création du Personnage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Nom du joueur */}
            <div className="space-y-2">
              <Label htmlFor="player-name" className="text-white text-xl">
                Nom du Dresseur :
              </Label>
              <Input
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Entrez votre nom..."
                className="text-xl py-3 bg-white/10 border-white/30 text-white placeholder-gray-300"
                maxLength={12}
              />
            </div>

            {/* Sélection des Pokémon */}
            <div className="space-y-4">
              <h3 className="text-white text-xl">Choisissez votre équipe (2 Pokémon max) :</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PokemonSelector
                  slot={0}
                  pokemonList={pokemonList}
                  selectedPokemon={selectedPokemon[0]}
                  onSelect={handlePokemonSelect}
                  label="Pokémon 1"
                />
                <PokemonSelector
                  slot={1}
                  pokemonList={pokemonList}
                  selectedPokemon={selectedPokemon[1]}
                  onSelect={handlePokemonSelect}
                  label="Pokémon 2"
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={() => setCurrentScreen('menu')}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Retour
              </Button>
              <Button
                onClick={handleStartGame}
                disabled={!canStart}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8"
              >
                Commencer l'Aventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CharacterCreation;
