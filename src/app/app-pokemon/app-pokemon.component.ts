import { TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DisplayPokemon } from "../pokemon.interface";

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [TitleCasePipe],
  template: `
    <div>
      <p>
        <span style="font-weight: bold;">Id:</span> <span>{{ pokemon().id }}</span>
        <span style="font-weight: bold;">Name:</span>
        <span>{{ pokemon().name | titlecase }}</span>
      </p>
      <div>
        <img [attr.alt]="pokemon().name" [src]="pokemon().img" />
      </div>
    </div>
  `,
  styles: `
    p, div {
      padding: 0.5rem;
    }

    p > span {
      margin-right: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonComponent {
  pokemon = input.required<DisplayPokemon>();
}
