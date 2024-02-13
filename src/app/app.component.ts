import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { computedAsync } from 'ngxtension/computed-async';
import { startWith, switchMap } from 'rxjs';
import { PokemonComponent } from './app-pokemon/app-pokemon.component';
import { getPokemonFn } from './get-pokemon';
import { DisplayPokemon } from './pokemon.interface';

const DEFAULT_POKEMON: DisplayPokemon = {
  id: 0,
  name: '',
  img: 'https://placehold.co/400',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, PokemonComponent],
  template: `
    <h1>Different way to retrieve data via HttpClient</h1>
    <h3>Signal + AsyncPipe + HttpClient</h3>
    @if (pokemon$ | async; as pokemon) {
      <app-pokemon [pokemon]="pokemon" />
    }

    <h3>Signal + make HttpClient call in effect</h3>
    @if (pokemon2(); as pokemon2) {
      <app-pokemon [pokemon]="pokemon2" />
    }

    <h3>Signal + HttpClient + toObservable + toSignal + SwitchMap</h3>
    @if (pokemon3(); as pokemon3) {
      <app-pokemon [pokemon]="pokemon3" />
    }

    <h3>Signal + computedAsync</h3>
    @if (pokemon4(); as pokemon4) {
      <app-pokemon [pokemon]="pokemon4" />
    }

    <h3>Signal + computedAsync + requireSync = true</h3>
    <app-pokemon [pokemon]="pokemon5()" />

    <h3>Signal + computedAsync + requireSync = true + behavior = concat behavior</h3>
    <app-pokemon [pokemon]="pokemonConcat()" />
  `,
  styles: `
    p, h1, h3 {
      padding: 0.5rem;
    }

    p > span {
      margin-right: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  pokemonId = signal(25);
  getPokemon = getPokemonFn();

  pokemon$ = this.getPokemon(this.pokemonId());
  pokemon2 = signal<DisplayPokemon | null>(null);
  pokemon3 = toSignal<DisplayPokemon>(
    toObservable(this.pokemonId)
      .pipe(switchMap((id) => this.getPokemon(id)))  
  );
  pokemon4 = computedAsync(() => this.getPokemon(this.pokemonId()));
  pokemon5 = computedAsync(() => this.getPokemon(this.pokemonId())
    .pipe(startWith(DEFAULT_POKEMON)),
    {
      requireSync: true,
    }
  );

  pokemonConcat = computedAsync(() => this.getPokemon(this.pokemonId()) 
    .pipe(startWith(DEFAULT_POKEMON)),
    {
      behavior: 'concat',
      requireSync: true,
    }
  );

  constructor() {
    effect((cleanUp) => {
      const subscription = this.getPokemon(this.pokemonId())
        .subscribe((p) => this.pokemon2.set(p))
    
      cleanUp(() => subscription.unsubscribe());
    });
  }
}
