import {
  FC
} from 'react';
import {
  Variable,
  Model
} from './ModelTable'

const getModelCall = (response: Variable, covariates: Variable[]) => {
  const responseName = response.name;
  const p = covariates.length;

  let modelCall = []

  modelCall[0] = <span key={responseName}>{responseName}</span>
  modelCall[1] = <span key="fOpen">{" = ƒ("}</span>

  if(p >= 3) {
    const covtName = covariates[0].name
    modelCall[2] = <span key={covtName}>{covtName}</span> 
    modelCall[3] = <span key="argEllipse">...</span> 
  } else {

    const covariateSpans = covariates.map((covt, ix) => {
      if(ix == covariates.length - 1) {
        return(<span key={covt.name}>{covt.name}</span>)
      } else {
        return(<span key={covt.name}>{covt.name}, </span>)
      }
    })

    modelCall = modelCall.concat(covariateSpans)
  }

  modelCall[modelCall.length] = <span key="fClose">{")"}</span>
  return modelCall
}

export const ModelCell: FC<Model> = (props: Model) => {
  const modelCall = getModelCall(props.response, props.covariates);

  return(
    <div className='modelCell'>
      <div className='modelCall'>{modelCall}</div>
      <div className='modelDetails'>
        <span className='modelType'>{props.model_type}</span>
      </div>
    </div>
  )
}

