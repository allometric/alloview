import { FC } from 'react';
import { Model } from '../types/model';
import { ModelCall } from './ModelCall';
import { Link } from 'react-router-dom';

export const ModelCell: FC<Model> = (props: Model) => {
  return(
    <Link to = {"/model/" + props._id}>
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
    </Link>
  )
}