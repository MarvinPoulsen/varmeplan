import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { varmeplanMinimapId } from '../../config';

export interface SupplyAreaRow {
    id: number;
    navn: string;
    dato: Date;
    varmeinstallation: string;
    total_count: number;
    samlerhvervareal: number;
    bygningenssamlboligareal: number;
    shape_wkt: { wkt: string };
}

const SupplyAreaPage: FC = () => {
    const minimap: any = useRef(null);
    const [SupplyAreaData, setSupplyAreaData] = useState<SupplyAreaRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('ds_varmeplan_landsbyer_varmeplan');
        ds.execute({ command: 'read' }, function (rows: SupplyAreaRow[]) {
            setSupplyAreaData(rows);
        });
    };

console.log('SupplyAreaData: ',SupplyAreaData)

    return (
        <>
        <div id="SupplyArea-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={varmeplanMinimapId} name="supply-area" size="is-5" onReady={onMapReady} />
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
export default SupplyAreaPage;
