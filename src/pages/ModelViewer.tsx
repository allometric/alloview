import {
  FC,
  useState,
  SyntheticEvent
} from 'react';
import ModelTable from '../components/ModelTable';
import ModelTypeBox from '../components/ModelTypeBox';
import { Option } from '../components/ModelTypeBox';

interface ModelViewerProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelViewer: FC<ModelViewerProps> = () => {
  const [modelType, setModelType] = useState<Option | null>(null);

  const handleOptionChange = (event: SyntheticEvent, value: Option | null) => {
    console.log(value)
    setModelType(value);
  };

  return (
    <div className='container viewerContainer'>
      <ModelTypeBox
        selectedOption={modelType}
        onChange={handleOptionChange}
      />
      <ModelTable selectedModelType={modelType}/>
    </div>
  )
}

export default ModelViewer;