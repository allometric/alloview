import {
  FC, useState, Dispatch, SetStateAction
} from 'react';
import { Variable } from '../types/model';

type ModelCallProps = {
  isOpened: boolean,
  response: Variable,
  covariates: Variable[]
}

type ModelCallEllipseProps = {
  isOpened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
  covariates: Variable[]
}

const ModelCallEllipse: FC<ModelCallEllipseProps> = (props: ModelCallEllipseProps) => {

  const covariateSpans = props.covariates.map((covt, ix) => {
    return(
      <span 
        key = {ix}
        onClick = {() => props.setOpened(false)}
        style = {{display: "block"}}
      >
        <span>&nbsp;&nbsp;</span>{covt.name}
      </span>
    )
  })

  return(
    <span>
      {props.isOpened ? null : <span className='modelEllipse' onClick = {() => props.setOpened(true)}>...</span>}
      {props.isOpened ? covariateSpans : null}
    </span>
  )
}

export const ModelCall: FC<ModelCallProps> = (props: ModelCallProps) => {
  const [isOpened, setOpened] = useState(false);
  const responseName = props.response.name;
  const p = props.covariates.length;

  let modelArgs: JSX.Element[] = [];

  if(p >= 3) {
    modelArgs[1] = <ModelCallEllipse key="ellipse" setOpened = {setOpened} isOpened = {isOpened} covariates = {props.covariates}/> 
  } else {

    const covariateSpans = props.covariates.map((covt, ix) => {
      if(ix == props.covariates.length - 1) {
        return(<span key={covt.name}>{covt.name}</span>)
      } else {
        return(<span key={covt.name}>{covt.name}, </span>)
      }
    })

    modelArgs = modelArgs.concat(covariateSpans)
  }

  return (
    <div className='modelCall'>
      <span key={responseName}>{responseName}</span>
      <span key="fOpen">{" = ƒ("}</span>
      {modelArgs}
      <span key="fClose">{")"}</span>
    </div>
  )
}