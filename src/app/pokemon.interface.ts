
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_shiny: string
  };
}

export interface DisplayPokemon {
  id: number;
  name: string;
  img: string;
}