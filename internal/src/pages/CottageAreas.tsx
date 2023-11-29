import React, { FC, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import Map from '../components/minimap/Minimap';
import { cottageareasMinimapId } from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend from '../components/charts/StackedbarNoLegend';
import Select from 'react-select';
import { getYears, getAreas, HeatPlanRow, AnalysisParams, createTableData, createStackedbarData } from '../../utils';

export interface AreaRow {
    navn: string;
    shape_wkt: { wkt: string };
}

const CottageAreasPage: FC = () => {
    const minimap: any = useRef(null);
    const [CottageAreasData, setCottageAreasData] = useState<HeatPlanRow[]>([]);
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
        const ds = ses.getDatasource('ds_varmeplan_vi_sommerhusomr_view');
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setCottageAreasData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row.aar;
                })
            );
            setYear(maxValue.toString())
        });

        const dsArea = ses.getDatasource('ds_varmeplan_sommerhusomrader_navne');
        dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
            setAreaData(areaRows);
        });
    };


    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        // handleThemeToggle(rowIndex)
    };

    const filteredByArea =
        CottageAreasData.length > 0 ? (area ? CottageAreasData.filter((item) => item.navn === area) : CottageAreasData) : [];

    const filteredByYear = filteredByArea.length > 0 ? filteredByArea.filter((item) => item.aar === year) : [];

    const supplyAreaTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(CottageAreasData);
    const uniqueAreas = getAreas(CottageAreasData);
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
            const filteredAreaData = areaData.find((item) => item.navn === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 300);
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
        <div id="CottageAreas-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={cottageareasMinimapId} name="cottage-areas" size="is-4" onReady={onMapReady} />
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
                            {/* <div className="block control">
                                <button className="button" onClick={testing}>
                                    Testing
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CottageAreasPage;
