import React from 'react';
import './charts.scss';
import { toPrettyNumber, getBackgroundColor, getBorderColor } from '../../../utils';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { TLData } from '../../pages/SupplyArea';

export interface TableLegendProps {
    data: TLData[];
    onRowToggle: (rowIndex: number) => void;
}

type Heat = {
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    on: boolean;
};

const background = getBackgroundColor(0);
const borderColor = getBorderColor(0);

const columnHelper = createColumnHelper<Heat>();

const columns = [
    columnHelper.accessor('varme', {
        header: () => 'Varmekilde',
        cell: (info) => (
            <>
                <span
                    className="color-box"
                    style={{ background: background[info.row.index], borderColor: borderColor[info.row.index] }}
                ></span>
                {info.getValue()}
            </>
        ),
        footer: 'I alt',
    }),
    columnHelper.accessor('antalbygninger', {
        header: 'Antal bygninger',
        cell: (info) => toPrettyNumber(info.getValue()),
        // @ts-ignore
        footer: ({ table }) =>
            toPrettyNumber(
                table
                    .getFilteredRowModel()
                    .rows?.filter((item) => item.original.on)
                    .reduce((sum, row) => sum + parseInt(row.getValue('antalbygninger')), 0)
            ),
    }),
    columnHelper.accessor('boligareal', {
        header: 'Samlet boligareal',
        cell: (info) => toPrettyNumber(info.getValue()),
        // @ts-ignore
        footer: ({ table }) =>
            toPrettyNumber(
                table
                    .getFilteredRowModel()
                    .rows.filter((item) => item.original.on)
                    .reduce((total, row) => total + parseInt(row.getValue('boligareal')), 0)
            ),
    }),
    columnHelper.accessor('erhvervsareal', {
        header: 'Samlet erhvervsareal',
        cell: (info) => toPrettyNumber(info.getValue()),
        // @ts-ignore
        footer: ({ table }) =>
            toPrettyNumber(
                table
                    .getFilteredRowModel()
                    .rows?.filter((item) => item.original.on)
                    .reduce((sum, row) => sum + parseInt(row.getValue('erhvervsareal')), 0)
            ),
    }),
    columnHelper.accessor(
      // @ts-ignore
        (row) => [parseInt(row.boligareal), parseInt(row.erhvervsareal)].reduce((sum, current) => sum + current, 0),
        {
            id: 'arealialt',
            header: 'Areal i alt',
            cell: (info) => toPrettyNumber(info.getValue()),
            // @ts-ignore
            footer: ({ table }) =>
                toPrettyNumber(
                    table
                        .getFilteredRowModel()
                        .rows.filter((item) => item.original.on)
                        .reduce(
                            (total, row) =>
                                total + parseInt(row.getValue('erhvervsareal')) + parseInt(row.getValue('boligareal')),
                            0
                        )
                ),
        }
    ),
];
const TableLegend = ({ data, onRowToggle }: TableLegendProps) => {
    const rerender = React.useReducer(() => ({}), {})[1];
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <>
            <table className="table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} onClick={() => onRowToggle(row.index)}>
                            {row.getVisibleCells().map((cell) => {
                                const isOff = !cell.row.original.on ? ' is-off' : '';
                                // @ts-ignore
                                const isNumber = isNaN(cell.getValue()) ? 'content' : 'content has-text-right';
                                return (
                                    <td key={cell.id} className={isNumber + isOff}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} className={header.index === 0 ? 'content' : 'content has-text-right'}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.footer, header.getContext())}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </>
    );
};

export default TableLegend;
