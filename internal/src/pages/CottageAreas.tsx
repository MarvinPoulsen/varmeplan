import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';

export interface CottageAreasRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    // shape_wkt: { wkt: string };
}

const CottageAreasPage: FC = () => {
    const minimap: any = useRef(null);
    const [CottageAreasData, setCottageAreasData] = useState<CottageAreasRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_landsbyer_vi_sommerhuse_hist');
        ds.execute({ command: 'read' }, function (rows: CottageAreasRow[]) {
            setCottageAreasData(rows);
        });
    };

console.log('CottageAreasData: ',CottageAreasData)

    return (
        <>
        <div id="CottageAreas-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={varmeplanMinimapId} name="cottage-areas" size="is-5" onReady={onMapReady} />
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
export default CottageAreasPage;
