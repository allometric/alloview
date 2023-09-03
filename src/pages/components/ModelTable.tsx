import {
  useState,
  useEffect,
  useReducer,
  FC
} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ModelCell } from './TableComponents'
import { AlloTag } from '@customTypes/tag'
import { stringify } from 'querystring';

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
  descriptors: Descriptors
}

const columnHelper = createColumnHelper<Model>();

const CountryCell: FC<Model> = (props: Model) => {
  const countryString = props.descriptors.country.join(', ')

  return(
    <p>{countryString}</p>
  )
}

const columns = [
  columnHelper.accessor(row => ModelCell(row), 
    {
      id: 'Model',
      cell: info => info.getValue(),
      minSize: 250,
      maxSize: 300
    }
  ),
  columnHelper.accessor(row => row.inline_citation, {
    id: 'Publication',
    cell: info => info.getValue(),
    minSize: 200,
    maxSize: 250
  }),
  columnHelper.accessor(row => CountryCell(row), {
    id: 'Country',
    cell: info => info.getValue(),
    minSize: 80,
    maxSize: 100
  }),
  columnHelper.accessor(row => row.descriptors, {
    id: 'Species',
    cell: info => <i>{info.getValue().genus + ' ' + info.getValue().species}</i>,
    minSize: 80,
    maxSize: 100
  })
]

interface ModelTableProps {
  limit?: number;
  onNextPage?: () => void;
  queryTags: AlloTag[]
}

export const ModelTable: FC<ModelTableProps> = (props: ModelTableProps) => {
  const [data, setData] = useState<Model[]>([]);
  const [isLoading, setLoading] = useState(true);

  const rerender = useReducer(() => ({}), {})[1]

  useEffect(() => {
      let queryStr: string = ''

      if(props.queryTags.length > 0) {
        const queryParams = {
          tagVals: props.queryTags.map(tag => tag.value)
        }
        queryStr = stringify(queryParams)
      }

    fetch('/api/models?'.concat(queryStr))
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [props.queryTags]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <table className="table modelTable">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} style={{minWidth: header.column.columnDef.minSize}}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} style={{minWidth: cell.column.columnDef.minSize}}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}