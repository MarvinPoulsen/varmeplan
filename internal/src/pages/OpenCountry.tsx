import React, { FC, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import Map from '../components/minimap/Minimap';
import { opencountryMinimapId } from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend from '../components/charts/StackedbarNoLegend';
import { getYears, HeatPlanRow, AnalysisParams, createTableData, createStackedbarData } from '../../utils';

const OpenCountryPage: FC = () => {
    const minimap: any = useRef(null);
    const [OpenCountryData, setOpenCountryData] = useState<HeatPlanRow[]>([]);
    const [year, setYear] = useState<string>('2011');

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
        const ds = ses.getDatasource('ds_varmeplan_vi_aabneland_view');
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setOpenCountryData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row.aar;
                })
            );
            setYear(maxValue.toString())
        });
    };


    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        // handleThemeToggle(rowIndex)
    };

    const filteredByYear = OpenCountryData.length > 0 ? OpenCountryData.filter((item) => item.aar === year) : [];

    const supplyAreaTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(OpenCountryData);
    const supplyAreaStackedbar = OpenCountryData.length > 0 && createStackedbarData(OpenCountryData, heatingAgents, uniqueYears);

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

    return (
        <>
        <div id="OpenCountry-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={opencountryMinimapId} name="open-country" size="is-4" onReady={onMapReady} />
                        <div className="column is-8">
                            <div className="field is-grouped">
                                {yearButtonRow}
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
                                                    title={'Det åbne land'}
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
export default OpenCountryPage;
