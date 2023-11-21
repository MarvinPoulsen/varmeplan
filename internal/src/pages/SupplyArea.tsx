import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';
import TableLegend from '../components/charts/TableLegend';

export interface SupplyAreaRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    // shape_wkt: { wkt: string };
}

export interface TLData {
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    on: boolean;
}

interface AnalysisParams {
    title: string;
    on: boolean;
}

const getYears = (data: SupplyAreaRow[]) => {
    const uniqueYears = [...new Set(data.map((item) => item.aar))];
    uniqueYears.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueYears;
};

const getAreas = (data: SupplyAreaRow[]) => {
    const uniqueAreas = [...new Set(data.map((item) => item.navn))];
    uniqueAreas.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueAreas;
};

const createTableData = (data: SupplyAreaRow[], analysisParams) => {
    const tableDate: TLData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const varme = analysisParam.title;
        const antalbygninger = data.find((item) => item.varme === varme)
            ? data.find((item) => item.varme === varme)!.antalbygninger
            : 0;
        const boligareal = data.find((item) => item.varme === varme)
            ? data.find((item) => item.varme === varme)!.boligareal
            : 0;
        const erhvervsareal = data.find((item) => item.varme === varme)
            ? data.find((item) => item.varme === varme)!.erhvervsareal
            : 0;
        const on = analysisParam.on;
        tableDate.push({
            varme,
            antalbygninger,
            boligareal,
            erhvervsareal,
            on,
        });
    }
    return tableDate;
};

const SupplyAreaPage: FC = () => {
    const minimap: any = useRef(null);
    const [supplyAreaData, setSupplyAreaData] = useState<SupplyAreaRow[]>([]);
    const [year, setYear] = useState<string>('2011');
    const [area, setArea] = useState<string | undefined>(undefined);

    const [heatingAgents, setHeatingAgents] = useState<AnalysisParams[]>([
        { title: 'Fjernvarme/blokvarme', on: true },
        { title: 'Varmepumpe', on: true },
        { title: 'Elvarme', on: true },
        { title: 'Biobrændsel', on: true },
        { title: 'Olie', on: true },
        { title: 'Andet', on: true },
    ]);

    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_landsbyer_vi_forsyningsomr_hist');
        ds.execute({ command: 'read' }, function (rows: SupplyAreaRow[]) {
            setSupplyAreaData(rows);
        });
    };

    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        // handleThemeToggle(rowIndex)
    };

    const filteredByYear = supplyAreaData.length > 0 ? supplyAreaData.filter((item) => item.aar === year) : [];
    // console.log('filteredByYear: ', filteredByYear);
    const filteredByArea =
        filteredByYear.length > 0 ? (area ? filteredByYear.filter((item) => item.navn === area) : filteredByYear) : [];
    // console.log('filteredByArea: ', filteredByArea);
    const supplyAreaTable = filteredByArea.length > 0 && createTableData(filteredByArea, heatingAgents);
    const uniqueYears = getYears(supplyAreaData);
    const uniqueAreas = getAreas(supplyAreaData);
    console.log('areas: ', uniqueAreas);

    const yearButtonRow: JSX.Element[] = [];
    for (let i = 0; i < uniqueYears.length; i++) {
        const uniqueYear = uniqueYears[i];
        yearButtonRow.push(
            <div className="control" key={uniqueYear}>
                <button
                    className={year === uniqueYear ? 'button is-info is-active' : 'button is-info is-light'}
                    onClick={() => setYear(uniqueYear)}
                    value={uniqueYear}
                >
                    {uniqueYear}
                </button>
            </div>
        );
    }

    const areaButtonRow: JSX.Element[] = [];
    for (let i = 0; i < uniqueAreas.length; i++) {
        const uniqueArea = uniqueAreas[i];
        areaButtonRow.push(
            <div className="control" key={uniqueArea}>
                <button
                    className={area === uniqueArea ? 'button is-info is-active' : 'button is-info is-light'}
                    onClick={() => setArea(uniqueArea)}
                    value={uniqueArea}
                >
                    {uniqueArea}
                </button>
            </div>
        );
    }

    return (
        <>
            <div id="SupplyArea-tab-content" className="container">
                <div className="block">
                    <div className="columns">
                        <Map id={varmeplanMinimapId} name="supply-area" size="is-4" onReady={onMapReady} />
                        <div className="column is-8">
                            <div className="field is-grouped">{yearButtonRow}</div>
                            <div className="block">
                                <div className="columns">
                                    <div className="column">
                                        {supplyAreaTable && (
                                            <TableLegend data={supplyAreaTable} onRowToggle={onHeatingAgentsToggle} />
                                        )}
                                    </div>
                                    <div className="column is-4">
                                        {areaButtonRow}
                                        <button className="button" onClick={() => setArea(undefined)}>
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SupplyAreaPage;
