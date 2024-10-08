import { FC } from 'react';
import { Model, Taxon } from '../types/model';
import { GenusSpeciesText } from './GenusSpeciesText';


const formatTaxon = (taxon: Taxon): string => {
  if (taxon.genus === null || taxon.species === null) {
    return ""
  } else {
    return taxon.genus[0] + '. ' + taxon.species
  }
}

export const TaxaCell: FC<Model> = (props: Model) => {
  return(
    <div className='taxaCell'>
      <GenusSpeciesText
        isOpened = {false}
        genusSpecies = {props.descriptors.taxa.map(taxon => formatTaxon(taxon))}
      />
    </div>
  )
}