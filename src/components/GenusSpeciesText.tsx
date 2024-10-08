import { FC, useState } from 'react';

type GenusSpeciesTextProps = {
  isOpened: boolean,
  genusSpecies: string[]
}

export const GenusSpeciesText: FC<GenusSpeciesTextProps> = (props: GenusSpeciesTextProps) => {
  const [isOpened, setOpened] = useState(false);
  const { genusSpecies } = props;

  // Show the first two pairs and calculate the remaining count
  const displayedGenusSpecies = genusSpecies.slice(0, 2);
  const remainingCount = genusSpecies.length - displayedGenusSpecies.length;

  // Render the default view with +N if more than two
  const summary = (
    <span onClick={() => setOpened(true)}>
      {displayedGenusSpecies.map((gs, ix) => (
        <span key={ix}>{gs}{ix < displayedGenusSpecies.length - 1 ? ', ' : ''}</span>
      ))}
      {remainingCount > 0 ? ` +${remainingCount}` : ''}
    </span>
  );

  // Render all genus-species pairs with line breaks
  const fullList = genusSpecies.map((gs, ix) => (
    <span key={ix} style={{ display: 'block' }}>
      {gs}
    </span>
  ));

  return (
    <span>
      {isOpened ? (
        <div onClick={() => setOpened(false)}>{fullList}</div>
      ) : (
        summary
      )}
    </span>
  );
};