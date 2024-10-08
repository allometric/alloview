import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  FC
} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ModelCell } from './ModelCell';
import CountryCell from './CountryCell';
import { Model, ModelAPIResponse } from '../types/model';
import { stringify } from 'querystring';
import {
  useInfiniteQuery
} from '@tanstack/react-query';
import { TaxaCell } from './TaxaCell';
import { Option } from './boxes/ModelTypeBox';


const columnHelper = createColumnHelper<Model>();

const columns = [
  columnHelper.accessor(row => ModelCell(row), 
    {
      id: 'Model',
      cell: info => <div>{info.getValue()}</div>,
      minSize: 250,
      maxSize: 300
    }
  ),
  columnHelper.accessor('inline_citation', {
    header: 'Publication',
  }),
  columnHelper.accessor(row => CountryCell(row), {
    id: 'Country',
    cell: info => info.getValue()
  }),
  columnHelper.accessor(row => TaxaCell(row), {
    id: 'Taxa',
    cell: info => info.getValue()
  })
];

interface ModelTableProps {
  limit?: number;
  onNextPage?: () => void;
  selectedModelType: Option | null;
  selectedCountry: Option | null;
}

type MongoDBFilter = string | { $in: string[] };

const ModelTable: FC<ModelTableProps> = (props: ModelTableProps) => {
  const containerRef = useRef<HTMLTableSectionElement>(null);

  const fetchModels = async(page: number, pageSize: number) => {
    const queryParams = {
      page: page,
      pageSize: pageSize
    };

    const queryStr = stringify(queryParams)
    const urlStr = 'https://api.allometric.org/models/?'.concat(queryStr)

    const findObj: Record<string, MongoDBFilter> = {};

    if (props.selectedModelType) {
      findObj.model_type = props.selectedModelType.label
    }

    if (props.selectedCountry) {
      findObj["descriptors.country"] = {$in: [props.selectedCountry.label]}
    }

    const response = await fetch(urlStr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(findObj)
    })

    if (!response.ok) {
      throw new Error('Error: ${response.status}');
    }

    const res = await response.json();

    const res_obj: ModelAPIResponse = {
      data: res,
      totalCount: res.length
    }

    return res_obj;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['models', props.selectedModelType, props.selectedCountry],
    queryFn: ({pageParam = 1}) => fetchModels(pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if(lastPage.data.length === 20) {
        return allPages.length + 1
      }
      return undefined
    }
  })

  const flatData = useMemo(
    () => data?.pages?.flatMap(model => model.data) ?? [], [data]
  )

  const lastBatchLength = data?.pages?.[data.pages.length - 1]?.data.length || 0;

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement? : HTMLTableSectionElement | null) => {
      if(containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        if(
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetchingNextPage &&
          lastBatchLength === 20
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetchingNextPage, lastBatchLength]
  )

  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <table className="table modelTable">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} style={{minWidth: header.column.columnDef.minSize, maxWidth: header.column.columnDef.maxSize}}>
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
        ref={containerRef}
      >
        {table.getRowModel().rows.map(row => {
          if(row.getIsExpanded()) {
            return <><tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                return <td key={cell.id} style={{minWidth: cell.column.columnDef.minSize, maxWidth: cell.column.columnDef.maxSize}}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              })}
            </tr>
            <tr><td colSpan={5}>{row.original.model_id}</td></tr></>
          } else {
            return <tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                return <td key={cell.id} style={{minWidth: cell.column.columnDef.minSize, maxWidth: cell.column.columnDef.maxSize}}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              })}
            </tr>
          }
        }
        )}
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
};

export default ModelTable;
