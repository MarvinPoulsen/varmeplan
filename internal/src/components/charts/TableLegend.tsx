import React from 'react';
import './charts.scss';


import { toPrettyNumber, getBackgroundColor, getBorderColor } from '../../../utils';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'
  
  type Heat = {
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    on:boolean;
  }
  
  const background = getBackgroundColor(0);
  const borderColor = getBorderColor(0);
  const defaultData: Heat[] = [
    {
      varme: 'Fjernvarme/blokvarme',
      antalbygninger: 4,
      boligareal: 100,
      erhvervsareal: 50,
      on:true,
    },
    {
      varme: 'Elvarme',
      antalbygninger: 2,
      boligareal: 40,
      erhvervsareal: 80,
      on:true,
    },
    {
      varme: 'Varmepumpe',
      antalbygninger: 400,
      boligareal: 2000,
      erhvervsareal: 10,
      on:true,
    },
    {
      varme: 'Biobrændsel',
      antalbygninger: 600,
      boligareal: 120,
      erhvervsareal: 170,
      on:true,
    },
    {
      varme: 'Olie',
      antalbygninger: 5000,
      boligareal: 206,
      erhvervsareal: 120,
      on:false,
    },
    {
      varme: 'Andet',
      antalbygninger: 3,
      boligareal: 29,
      erhvervsareal: 110,
      on:true,
    },
  ]
  
  const columnHelper = createColumnHelper<Heat>()
  
  const columns = [
    columnHelper.accessor('varme', {
      cell: info => <><span className="color-box" style={{ background: background[info.row.index], borderColor: borderColor[info.row.index], }} ></span>{info.getValue()}</>,
      footer: info => 'I alt',
    }),
    columnHelper.accessor(row => row.antalbygninger, {
      id: 'antalbygninger',
      cell: info => toPrettyNumber(info.getValue()),
      header: () => <span>Antal bygninger</span>,
      // @ts-ignore
      footer: ({ table }) => toPrettyNumber(table.getFilteredRowModel().rows?.filter((item)=>item.original.on).reduce((sum, row) => sum + row.getValue('antalbygninger'), 0)),
    }),
    columnHelper.accessor('boligareal', {
      header: () => 'Samlet boligareal',
      cell: info => toPrettyNumber(info.getValue()),
      // @ts-ignore
      footer: ({ table }) => toPrettyNumber(table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue('boligareal'), 0)),
    }),
    columnHelper.accessor('erhvervsareal', {
      header: () => <span>Samlet erhvervsareal</span>,
      // @ts-ignore
      footer: ({ table }) => toPrettyNumber(table.getFilteredRowModel().rows?.reduce((sum, row) => sum + row.getValue('erhvervsareal'), 0)),
    }),
    columnHelper.accessor(row => [row.boligareal, row.erhvervsareal].reduce((sum, current) => sum + current, 0), {
        id: 'arealialt ',
        header: 'Areal i alt',
      cell: info => info.getValue(),
      // @ts-ignore
      footer: ({ table }) => table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue('erhvervsareal') + row.getValue('boligareal'), 0),
    }),
  ]
  const test = ()=> {
    console.log('number: ',toPrettyNumber(2000))
    console.log('string: ',toPrettyNumber('2000'))
}
const TableLegend = () => {

// test()

    const [data, setData] = React.useState(() => [...defaultData])
    const rerender = React.useReducer(() => ({}), {})[1]
  
    // console.log('data :', data)
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
//   console.log('table :', table)
    return (
      <>
        <table className="table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow">
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
              <tr key={row.id} onClick={(e)=>console.log('index of row: ',row.index,e)}>
                {row.getVisibleCells().map(cell => { 
                const isOff = !cell.row.original.on ? ' is-off' : '';
                console.log('cell: ', isOff)
                // @ts-ignore
                const isNumber = isNaN(cell.getValue()) ? 'content' : 'content has-text-right';
                return (
                  <td key={cell.id} className={isNumber + isOff}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )}
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => {
                return (
                  <th key={header.id} className={header.index === 0 ? 'content' : 'content has-text-right'}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                )}
                )}
              </tr>
            ))}
          </tfoot>
        </table>
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>
      </>
    )
  
}

export default TableLegend;