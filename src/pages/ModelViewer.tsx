import {
  FC
} from 'react';
import ModelTable from '../components/ModelTable';


interface ModelViewerProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelViewer: FC<ModelViewerProps> = () => {
  return (
    <div className='container viewerContainer'>
      <ModelTable/>
    </div>
  )
}

export default ModelViewer;