import { FC } from 'react';
import { Model } from '../types/model';
import { ModelCall } from './ModelCall';


export const ModelCell: FC<Model> = (props: Model) => {
  return(
    <div className='modelCell'>
      <ModelCall
        isOpened = {false}
        response = {props.response}
        covariates = {props.covariates}
      />
      <div className='modelDetails'>
        <span className='modelType'>{props.model_type}</span>
      </div>
    </div>
  )
}