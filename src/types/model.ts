export type Taxon = {
  family: string | null,
  genus: string | null,
  species: string | null
}

export type Descriptors = {
  country: string[],
  region: string[],
  taxa: Taxon[]
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
  descriptors: Descriptors
}

export type ModelAPIResponse = {
  data: Model[],
  totalCount: number
}