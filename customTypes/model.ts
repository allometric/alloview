export type Descriptors = {
  genus: string,
  species: string,
  country: string[]
}

export type Variable = {
  name: string,
  unit: string
}

export type Model = {
  pub_id: string,
  inline_citation: string,
  model_id: string, 
  model_type: string,
  response: Variable,
  covariates: Variable[],
  descriptors: Descriptors,
  predict_fn_body: string[]
}

export type ModelApiResponse = {
  data: Model[],
  totalCount: number
}