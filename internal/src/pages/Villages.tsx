import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';

export interface VillagesRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    // shape_wkt: { wkt: string };
}

const VillagesPage: FC = () => {
    const minimap: any = useRef(null);
    const [VillagesData, setVillagesData] = useState<VillagesRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_landsbyer_vi_landsbyer_hist');
        ds.execute({ command: 'read' }, function (rows: VillagesRow[]) {
            setVillagesData(rows);
        });
    };

console.log('VillagesData: ',VillagesData)

    return (
        <>
        <div id="Villages-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={varmeplanMinimapId} name="villages" size="is-5" onReady={onMapReady} />
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
export default VillagesPage;
