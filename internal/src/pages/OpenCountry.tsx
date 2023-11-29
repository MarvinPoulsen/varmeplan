import React, { FC, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import Map from '../components/minimap/Minimap';
import { opencountryMinimapId } from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend from '../components/charts/StackedbarNoLegend';
import Select from 'react-select';
import { getYears, getAreas, HeatPlanRow, AnalysisParams, createTableData, createStackedbarData } from '../../utils';

export interface AreaRow {
    navn: string;
    shape_wkt: { wkt: string };
}


const OpenCountryPage: FC = () => {
    const minimap: any = useRef(null);
    const [OpenCountryData, setOpenCountryData] = useState<HeatPlanRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_vi_aabneland_view');
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setOpenCountryData(rows);
        });
    };

console.log('OpenCountryData: ',OpenCountryData)

    return (
        <>
        <div id="OpenCountry-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={opencountryMinimapId} name="open-country" size="is-5" onReady={onMapReady} />
                    <div className="column">
                        <div className="block">
                            {minimap.current && (
                                <p>Varmeplan</p>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
                </div>
        </>
    );
};
export default OpenCountryPage;
