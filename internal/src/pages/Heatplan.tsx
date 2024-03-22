import React, { FC, useEffect, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import {
    forceMapExtent,
    justamapMinimapId,
} from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend from '../components/charts/StackedbarNoLegend';
import Select from 'react-select';
import {
    getYears,
    getAreas,
    HeatPlanRow,
    AnalysisParams,
    createTableData,
    createStackedbarData,
    getAnalysisParams,
    getForcedMapExtent,
} from '../../utils';

export interface AreaRow {
    navn1203: string;
    shape_wkt: { wkt: string };
}

const HeatplanPage: FC = () => {
    const minimap: any = useRef(null);
    // const [areaTable, setAreaTable] = useState<HeatPlanRow[]>([]);
    // const [areaData, setAreaData] = useState<AreaRow[]>([]);
    const [year, setYear] = useState<string>('2024');
    // const [area, setArea] = useState<string | undefined>(undefined);
    const [mapThemes, setMapThemes] = useState<string[]>([]);
    // const [heatingAgents, setHeatingAgents] = useState<AnalysisParams[]>([]);

const area = undefined;
// const year = '';
const areaTable = [
    {
        "varme": "Fjernvarme/blokvarme",
        "antalbygninger": 9523,
        "boligareal": 1464588,
        "erhvervsareal": 761484,
        "on": true
    },
    {
        "varme": "Varmepumpe",
        "antalbygninger": 287,
        "boligareal": 35717,
        "erhvervsareal": 9003,
        "on": true
    },
    {
        "varme": "Elvarme",
        "antalbygninger": 1174,
        "boligareal": 141592,
        "erhvervsareal": 32966,
        "on": true
    },
    {
        "varme": "Biobrændsel",
        "antalbygninger": 227,
        "boligareal": 28403,
        "erhvervsareal": 10810,
        "on": true
    },
    {
        "varme": "Olie",
        "antalbygninger": 600,
        "boligareal": 44882,
        "erhvervsareal": 167690,
        "on": true
    },
    {
        "varme": "Andet",
        "antalbygninger": 23,
        "boligareal": 1071,
        "erhvervsareal": 7521,
        "on": true
    }
]
const options = [
    {
        "value": "varme2",
        "label": "varme2"
    },
    {
        "value": "Søllested Forsyningsområde",
        "label": "Søllested Forsyningsområde"
    },
    {
        "value": "Rødbyhavn Forsyningsområde",
        "label": "Rødbyhavn Forsyningsområde"
    },
    {
        "value": "Rødby Forsyningsområde",
        "label": "Rødby Forsyningsområde"
    },
    {
        "value": "ret",
        "label": "ret"
    },
    {
        "value": "Nakskov Forsyningsområde",
        "label": "Nakskov Forsyningsområde"
    },
    {
        "value": "Maribo Forsyningsområde",
        "label": "Maribo Forsyningsområde"
    },
    {
        "value": "Holeby Forsyningsområde",
        "label": "Holeby Forsyningsområde"
    },
    {
        "value": "2020vp",
        "label": "2020vp"
    }
]
const uniqueYears = [
    "2011",
    "2015",
    "2017",
    "2021",
    "2024"
]

const heatplanAreaStackedbar = [
    {
        "name": "Fjernvarme/blokvarme",
        "values": [
            7697,
            8553,
            8663,
            9308,
            9523
        ],
        "stack": "0"
    },
    {
        "name": "Varmepumpe",
        "values": [
            89,
            129,
            154,
            195,
            287
        ],
        "stack": "0"
    },
    {
        "name": "Elvarme",
        "values": [
            1527,
            1402,
            1350,
            1244,
            1174
        ],
        "stack": "0"
    },
    {
        "name": "Biobrændsel",
        "values": [
            244,
            243,
            251,
            264,
            227
        ],
        "stack": "0"
    },
    {
        "name": "Olie",
        "values": [
            2366,
            1586,
            1455,
            785,
            600
        ],
        "stack": "0"
    },
    {
        "name": "Andet",
        "values": [
            63,
            47,
            44,
            29,
            23
        ],
        "stack": "0"
    }
]

const heatingAgents = [
    {
        "title": "Fjernvarme/blokvarme",
        "on": true
    },
    {
        "title": "Varmepumpe",
        "on": true
    },
    {
        "title": "Elvarme",
        "on": true
    },
    {
        "title": "Biobrændsel",
        "on": true
    },
    {
        "title": "Olie",
        "on": true
    },
    {
        "title": "Andet",
        "on": true
    }
]
    useEffect(() => {
        if (minimap.current) {
            const mm = minimap.current;
            const ses = mm.getSession();
            if (mapThemes.length > 0) {
                for (const theme of mapThemes) {
                    const getTheme = mm.getTheme(theme);
                    const datasource = getTheme.getDatasources()[0];
                    // if (area) {
                    //     ses.getDatasource(datasource).setFilterParams(
                    //         { [supplyareaButtonFilter]: year, [supplyareaSelectFilter]: area }, //setFilterParams({ [aar]: year, [navn]: area });
                    //         (response) => {
                    //             getTheme.repaint();
                    //             if (response.exception) console.log(response.exception);
                    //         }
                    //     );
                    // } else {
                    //     ses.setProperties(
                    //         'datasource_filter_state',
                    //         datasource,
                    //         { [supplyareaButtonFilter]: 'false', [supplyareaSelectFilter]: 'true' },
                    //         (response) => {
                    //             getTheme.repaint();
                    //             if (response.exception) console.log(response.exception);
                    //         }
                    //     );
                    //     ses.getDatasource(datasource).setFilterParams({ [supplyareaButtonFilter]: year }, (response) => {
                    //         getTheme.repaint();
                    //         if (response.exception) console.log(response.exception);
                    //     });
                    // }
                }
            }
        }
    }, [area, year]);

    const onMapReady = (mm) => {
        minimap.current = mm;
        if (forceMapExtent) {
            const mapExtent = getForcedMapExtent();
            minimap.current.getMapControl().zoomToExtent(mapExtent);
            console.log('mapExtent: ',mapExtent)
            console.log('forceMapExtent: ',forceMapExtent)
        }
        const ses = mm.getSession();
    };

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

    
    const onHeatingAgentsToggle = (rowIndex: number) => {
        console.log(rowIndex)
    };

return (
    <>
    <div id="Heatplan-tab-content" className="container">
        <div className="block">
            <div className="columns is-widescreen">
    <Map id={justamapMinimapId} name="hiddenmap" size="is-4-desktop box" onReady={onMapReady} />
                        <div className="column is-8-desktop">
                            <div className="columns">
                                <div className="column is-narrow-tablet">
                                    <div className="field is-grouped">{yearButtonRow}</div>
                                </div>
                                <div className="column">
                                    <div className="control is-expanded">
                                        <Select
                                            name="area"
                                            options={options}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isClearable={true}
                                            isSearchable={true}
                                            onChange={(e)=>console.log(e)}
                                            placeholder="Filtrer på område"
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 4,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#e4eff9',
                                                    primary50: '#3e8ed040',
                                                    primary: '#3082c5',
                                                },
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="block">
                                    <div className="columns">
                                        <div className="column">
                                            {areaTable && (
                                                <TableLegend data={areaTable} onRowToggle={onHeatingAgentsToggle} />
                                            )}
                                        </div>
                                        <div className="column is-4-desktop is-3-tablet">
                                            <div className="block stackedbar-no-legend box">
                                                {heatplanAreaStackedbar && (
                                                    <StackedbarNoLegend
                                                        title={area ? area : 'Alle forsyningesområder'}
                                                        categories={uniqueYears}
                                                        dataSeries={heatplanAreaStackedbar}
                                                        visibility={heatingAgents.map((item) => item.on)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
);
};
export default HeatplanPage;
