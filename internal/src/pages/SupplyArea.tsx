import React, { FC, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import '../components/app/app.scss';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend, { StackedDataSeries } from '../components/charts/StackedbarNoLegend';
import Select from 'react-select';

export interface AreaRow {
    navn1203: string;
    shape_wkt: { wkt: string };
}

export interface SupplyAreaRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: string;
    boligareal: string;
    erhvervsareal: string;
    shape_wkt: { wkt: string };
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
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.antalbygninger), 0)
            : 0;
        const boligareal = data.find((item) => item.varme === varme)
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.boligareal), 0)
            : 0;
        const erhvervsareal = data.find((item) => item.varme === varme)
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.erhvervsareal), 0)
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

const createStackedbarData = (data: SupplyAreaRow[], analysisParams, years) => {
    const stackedbarData: StackedDataSeries[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const values: number[] = [];
        for (let k = 0; k < years.length; k++) {
            const year = years[k];
            const dataByYear = data.filter((item) => item.aar === year);
            const dataByTitle = dataByYear.filter((item) => item.varme === analysisParam.title);
            const value = dataByTitle.reduce((sum, cur) => sum + parseInt(cur.antalbygninger), 0);
            values.push(value);
        }
        stackedbarData.push({
            name: analysisParam.title,
            values,
            stack: '0',
        });
    }
    return stackedbarData;
};

const SupplyAreaPage: FC = () => {
    const minimap: any = useRef(null);
    const [supplyAreaData, setSupplyAreaData] = useState<SupplyAreaRow[]>([]);
    const [areaData, setAreaData] = useState<AreaRow[]>([]);
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
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row.aar;
                })
            );
            setYear(maxValue.toString())
        });

        const dsArea = ses.getDatasource('ds_varmeplan_forsyningsomr');
        dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
            setAreaData(areaRows);
        });
    };

    const testing = () => {
        if (area) {
            const filteredAreaData = areaData.find((item) => item.navn1203 === area);
            console.log('filteredAreaData: ', filteredAreaData!.shape_wkt);
            minimap.current.getMapControl().setMarkingGeometry(filteredAreaData!.shape_wkt, true, true, 0);
        } else if (area === undefined) {
            console.log('area is undefined');
        }
    };

    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        // handleThemeToggle(rowIndex)
    };

    const filteredByArea =
        supplyAreaData.length > 0 ? (area ? supplyAreaData.filter((item) => item.navn === area) : supplyAreaData) : [];

    const filteredByYear = filteredByArea.length > 0 ? filteredByArea.filter((item) => item.aar === year) : [];

    const supplyAreaTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(supplyAreaData);
    const uniqueAreas = getAreas(supplyAreaData);
    const supplyAreaStackedbar = filteredByArea.length > 0 && createStackedbarData(filteredByArea, heatingAgents, uniqueYears);

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

    const handleAreaFilter = (event) => {
        console.log('event: ', event);
        const area = event ? event.value : undefined;
        setArea(area);
        if (area) {
            const filteredAreaData = areaData.find((item) => item.navn1203 === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 0);
        } else if (area === undefined) {
            console.log('area is undefined');
            const mapExtent = minimap.current.getMapControl()._mapConfig.getExtent();
            minimap.current.getMapControl().zoomToExtent(mapExtent);
        }
    };

    const options = uniqueAreas.map((element) => {
        const value = element;
        const label = element;
        return {
            value,
            label,
        };
    });

    return (
        <>
            <div id="SupplyArea-tab-content" className="container">
                <div className="block">
                    <div className="columns">
                        <Map id={varmeplanMinimapId} name="supply-area" size="is-4" onReady={onMapReady} />
                        <div className="column is-8">
                            <div className="field is-grouped">
                                {yearButtonRow}
                                <div className="control is-expanded">
                                    <Select
                                        name="area"
                                        options={options}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={handleAreaFilter}
                                        placeholder="Filtrer på område"
                                    />
                                </div>
                            </div>
                            <div className="block">
                                <div className="columns">
                                    <div className="column">
                                        {supplyAreaTable && (
                                            <TableLegend data={supplyAreaTable} onRowToggle={onHeatingAgentsToggle} />
                                        )}
                                    </div>
                                    <div className="column is-4">
                                        <div className="block stackedbar-no-legend">
                                            {supplyAreaStackedbar && (
                                                <StackedbarNoLegend
                                                    title={area ? area : 'Alle forsyningesområder'}
                                                    categories={uniqueYears}
                                                    dataSeries={supplyAreaStackedbar}
                                                    visibility={heatingAgents.map((item) => item.on)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block control">
                                <button className="button" onClick={testing}>
                                    Testing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SupplyAreaPage;
