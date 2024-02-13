import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { DisplayPokemon, Pokemon } from "./pokemon.interface";

export const getPokemonFn = (): (id: number) => Observable<DisplayPokemon> => {
  const httpClient = inject(HttpClient);

  return (id: number) => {
    return httpClient.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .pipe(
        map((p) => ({
          id: p.id,
          name: p.name,
          img: p.sprites.front_shiny
        }))
      );
  }
}
