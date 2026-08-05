import { useState } from 'react';
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
  const [useFallbackImage, setUseFallbackImage] = useState(false);
  const source = useFallbackImage
    ? buildCharacterFallbackImageUrl(character, seed)
    : buildCharacterImageUrl(seed);

  return (
    <img
      alt={character.name}
      className={className}
      decoding="async"
      loading={loading}
      src={source}
      onError={() => {
        setUseFallbackImage(true);
      }}
    />
  );
}
