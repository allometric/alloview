import {
  useState,
  useEffect,
  useReducer,
  useRef,
  FC,
  useMemo,
  StrictMode,
  useCallback
} from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ModelCell } from './TableComponents'
import { AlloTag } from '@customTypes/tag'
import { stringify } from 'querystring';
import { 
  useInfiniteQuery
} from '@tanstack/react-query';
import { Model, ModelApiResponse } from '@customTypes/model';

const columnHelper = createColumnHelper<Model>();

const CountryCell: FC<Model> = (props: Model) => {
  let countryString: string;

  if(props.descriptors.country === undefined) {
    countryString = ''
  } else {
    countryString = props.descriptors.country.join(', ')
  }

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
  const tableContainerRef = useRef<HTMLTableSectionElement>(null);
  const rerender = useReducer(() => ({}), {})[1]

  const fetchModels = async(page: number, pageSize: number) => {
    const queryParams: {[k: string]: any} = {};

    queryParams.page = page
    queryParams.pageSize = pageSize

    if(props.queryTags.length > 0) {
      queryParams.tagVals = props.queryTags.map(tag => tag.value)
    }

    const queryStr = stringify(queryParams)

    const response = await fetch('/api/models?'.concat(queryStr));
    const res = await response.json();

    return res;
  };

  const { data, fetchNextPage, isFetching, isLoading } = 
    useInfiniteQuery<ModelApiResponse>(
      ['models', props.queryTags],
      async ({ pageParam = 0 }) => {
        const fetchedModels = await fetchModels(pageParam, 20)
        return fetchedModels
      },
      {
        getNextPageParam: (_lastGroup, groups) => groups.length,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    )

  const flatData = useMemo(
    () => data?.pages?.flatMap(model => model.data) ?? [], [data]
  )

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const nPages = data?.pages?.length as number;
  const endReached = !(data?.pages?.[nPages-1]?.hasNext)
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement? : HTMLDivElement | null) => {
      if(containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement

        if(
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          !endReached
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, endReached]
  )

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  useEffect(() => {
    // Scroll to the top of the table element
   (tableContainerRef.current as HTMLElement).scrollTop = 0
  }, [props.queryTags])

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
      <tbody
        onScroll={e => fetchMoreOnBottomReached(e.target as HTMLTableSectionElement)}
        ref={tableContainerRef}
      >
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

//const rootElement = document.getElementById('root')
//
//if (!rootElement) throw new Error('Failed to find the root element')
//
//const queryClient = new QueryClient()
//
//ReactDOM.createRoot(rootElement).render(
//  <StrictMode>
//    <QueryClientProvider client={queryClient}>
//      <ModelTable queryTags={[]}/>
//    </QueryClientProvider>
//  </StrictMode>
//)