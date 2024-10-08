import {
  FC
} from 'react';
import { Model } from '../types/model';

const CountryCell: FC<Model> = (props: Model) => {
  let countryString: string;

  if(props.descriptors.country === undefined) {
    countryString = ''
  } else {
    countryString = props.descriptors.country.join(', ')
  }

  return(
    <p>{countryString}</p>
  )
}

export default CountryCell;