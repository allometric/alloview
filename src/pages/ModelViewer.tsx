import {
  FC,
  useState,
  SyntheticEvent
} from 'react';
import ModelTable from '../components/ModelTable';
import ModelTypeBox from '../components/boxes/ModelTypeBox';
import { Option } from '../types/box';
import CountryBox from '../components/boxes/CountryBox';
import GenusSpeciesBox from '../components/boxes/GenusSpeciesBox';

interface ModelViewerProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelViewer: FC<ModelViewerProps> = () => {
  const [modelType, setModelType] = useState<Option | null>(null);
  const [country, setCountry] = useState<Option | null>(null);
  const [genusSpecies, setGenusSpecies] = useState<Option | null>(null);

  const handleTypeChange = (event: SyntheticEvent, value: Option | null) => {
    setModelType(value);
  };

  const handleCountryChange = (event: SyntheticEvent, value: Option | null) => {
    setCountry(value);
  };

  const handleGenusSpeciesChange = (event: SyntheticEvent, value: Option | null) => {
    setGenusSpecies(value);
  };

  return (
    <div className='viewerContainer'>
      <div className='boxContainer'>
        <ModelTypeBox
          selectedOption={modelType}
          onChange={handleTypeChange}
        />
        <CountryBox
          selectedOption={country}
          onChange={handleCountryChange}
        />
        <GenusSpeciesBox
          selectedOption={genusSpecies}
          onChange={handleGenusSpeciesChange}
        />
      </div>
      <ModelTable
        selectedModelType={modelType}
        selectedCountry={country}
        selectedGenusSpecies={genusSpecies}
      />
    </div>
  )
}

export default ModelViewer;