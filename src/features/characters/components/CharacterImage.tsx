import { useEffect, useState } from 'react';
import type { Character } from '../../../types/swapi';
import { buildCharacterFallbackImageUrl, buildCharacterImageUrl } from '../utils/characterMedia';

type CharacterImageProps = {
  character: Character;
  seed: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export function CharacterImage({
  character,
  seed,
  className = '',
  loading = 'lazy',
}: CharacterImageProps): JSX.Element {
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
  }, [character.url, seed]);

  const source = attempt === 0
    ? buildCharacterImageUrl(seed)
    : buildCharacterFallbackImageUrl(character, `${seed}-${attempt}`);

  return (
    <img
      alt={character.name}
      className={className}
      decoding="async"
      loading={loading}
      src={source}
      onError={() => {
        setAttempt((currentAttempt) => Math.min(currentAttempt + 1, 3));
      }}
    />
  );
}
