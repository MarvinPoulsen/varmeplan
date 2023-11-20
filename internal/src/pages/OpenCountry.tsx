import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';

export interface OpenCountryRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    // shape_wkt: { wkt: string };
}

const OpenCountryPage: FC = () => {
    const minimap: any = useRef(null);
    const [OpenCountryData, setOpenCountryData] = useState<OpenCountryRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_landsbyer_vi_aabneland_hist');
        ds.execute({ command: 'read' }, function (rows: OpenCountryRow[]) {
            setOpenCountryData(rows);
        });
    };

console.log('OpenCountryData: ',OpenCountryData)

    return (
        <>
        <div id="OpenCountry-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={varmeplanMinimapId} name="open-country" size="is-5" onReady={onMapReady} />
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
