import {
  FC,
  useState,
  SyntheticEvent
} from 'react';
import ModelTable from '../components/ModelTable';
import ModelTypeBox from '../components/boxes/ModelTypeBox';
import { Option } from '../components/boxes/ModelTypeBox';
import CountryBox from '../components/boxes/CountryBox';

interface ModelViewerProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelViewer: FC<ModelViewerProps> = () => {
  const [modelType, setModelType] = useState<Option | null>(null);
  const [country, setCountry] = useState<Option | null>(null);

  const handleTypeChange = (event: SyntheticEvent, value: Option | null) => {
    setModelType(value);
  };

  const handleCountryChange = (event: SyntheticEvent, value: Option | null) => {
    setCountry(value);
  };

  return (
    <div className='container viewerContainer'>
      <ModelTypeBox
        selectedOption={modelType}
        onChange={handleTypeChange}
      />
      <CountryBox
        selectedOption={country}
        onChange={handleCountryChange}
      />
      <ModelTable
        selectedModelType={modelType}
        selectedCountry={country}
      />
    </div>
  )
}

export default ModelViewer;