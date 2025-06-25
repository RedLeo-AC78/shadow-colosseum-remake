
"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pokemon } from '../types/game';

interface PokemonSelectorProps {
  slot: number;
  pokemonList: Array<{ id: number; name: string }>;
  selectedPokemon?: Pokemon;
  onSelect: (pokemonId: number, slot: number) => void;
  label: string;
}

const PokemonSelector = ({ slot, pokemonList, selectedPokemon, onSelect, label }: PokemonSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (pokemonId: number) => {
    onSelect(pokemonId, slot);
    setIsOpen(false);
  };

  return (
    <Card className="bg-white/10 border-white/30">
      <CardContent className="p-4">
        <h4 className="text-white text-lg mb-3">{label}</h4>
        
        {selectedPokemon ? (
          <div className="text-center space-y-3">
            <img 
              src={selectedPokemon.sprite} 
              alt={selectedPokemon.name}
              className="w-24 h-24 mx-auto bg-white/20 rounded-lg p-2"
            />
            <div className="text-white">
              <p className="font-bold capitalize">{selectedPokemon.name}</p>
              <p className="text-sm text-gray-300">
                Types: {selectedPokemon.types.join(', ')}
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  Changer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-96 overflow-y-auto bg-gray-900 border-yellow-400">
                <DialogHeader>
                  <DialogTitle className="text-yellow-400">Choisir un Pokémon</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-2">
                  {pokemonList.map((pokemon) => (
                    <Button
                      key={pokemon.id}
                      onClick={() => handleSelect(pokemon.id)}
                      variant="ghost"
                      className="h-auto p-2 text-white hover:bg-white/10 flex flex-col"
                    >
                      <span className="text-xs">#{pokemon.id}</span>
                      <span className="capitalize text-sm">{pokemon.name}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/50">
              <span className="text-white/50 text-xs">Vide</span>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black">
                  Choisir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-96 overflow-y-auto bg-gray-900 border-yellow-400">
                <DialogHeader>
                  <DialogTitle className="text-yellow-400">Choisir un Pokémon</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-2">
                  {pokemonList.map((pokemon) => (
                    <Button
                      key={pokemon.id}
                      onClick={() => handleSelect(pokemon.id)}
                      variant="ghost"
                      className="h-auto p-2 text-white hover:bg-white/10 flex flex-col"
                    >
                      <span className="text-xs">#{pokemon.id}</span>
                      <span className="capitalize text-sm">{pokemon.name}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PokemonSelector;
