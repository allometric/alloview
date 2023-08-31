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


type Variable = {
  name: string,
  unit: string
}

type Model = {
  pub_id: string,
  inline_citation: string,
  model_id: string, 
  model_type: string,
  response: Variable,
  covariates: Variable[],
  model_call: string
}

const columnHelper = createColumnHelper<Model>();

const ModelCell: FC<Model> = (props: Model) => {
  return(
    <div className='modelCell'>
      <p className='modelCall'>{props.model_call}</p>
      <div className='modelDetails'>
        <span className='modelType'>{props.model_type}</span>
      </div>
    </div>
  )
}

const columns = [
  columnHelper.accessor(row => ModelCell(row), 
    {
      id: 'Model',
      cell: info => info.getValue(),
      maxSize: 300
    }
  ),
  columnHelper.accessor(row => row.inline_citation, {
    id: 'Publication',
    cell: info => info.getValue()
  })
]

interface ModelTableProps {
  limit?: number;
  onNextPage?: () => void;
}

const ModelTable: FC<ModelTableProps> = () => {
  const [data, setData] = useState<Model[]>([]);
  const [isLoading, setLoading] = useState(true);

  const rerender = useReducer(() => ({}), {})[1]

  useEffect(() => {
    console.log('here!')
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="container tableContainer">
      <div className="tableContainer" style={{maxWidth: "600px"}}>
        <table className="table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
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
                  <td key={cell.id} style={{maxWidth: cell.column.columnDef.maxSize}}>
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
      </div>
    </div>
  )
}

export default ModelTable;