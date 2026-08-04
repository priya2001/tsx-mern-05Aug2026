import type { Character } from '../../../types/swapi';
import { CharacterCard } from './CharacterCard';

type CharacterGridProps = {
  characters: Character[];
  page: number;
};

export function CharacterGrid({ characters, page }: CharacterGridProps): JSX.Element {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Star Wars characters">
      {characters.map((character, index) => (
        <li key={character.url}>
          <CharacterCard character={character} index={index} page={page} />
        </li>
      ))}
    </ul>
  );
}
