import {
  useState,
  useEffect,
  useReducer,
  FC,
  useRef
} from 'react';
import {Interface} from './components/Interface';
import {ModelTable} from './components/ModelTable';
import {AlloTag} from '@customTypes/tag';

interface ModelViewerProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelViewer: FC<ModelViewerProps> = () => {
  const [queryTags, setQueryTags] = useState<AlloTag[]>([]);

  return (
    <div className="container viewerContainer" style={{maxWidth: "800px"}}>
      <Interface queryTags = {queryTags} setQueryTags = {setQueryTags}/>
      <ModelTable queryTags = {queryTags}/>
    </div>
  )
}

export default ModelViewer;