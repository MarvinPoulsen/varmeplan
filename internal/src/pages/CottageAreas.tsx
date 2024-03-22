import React, { FC, useEffect, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import {
    cottageareasArea,
    cottageareasButtonFilter,
    cottageareasDatasource,
    cottageareasMinimapId,
    cottageareasSelectFilter,
    cottageareasThemegroup,
    forceMapExtent,
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
    navn: string;
    shape_wkt: { wkt: string };
}

const CottageAreasPage: FC = () => {
    const minimap: any = useRef(null);
    const [cottageAreasData, setCottageAreasData] = useState<HeatPlanRow[]>([]);
    const [areaData, setAreaData] = useState<AreaRow[]>([]);
    const [year, setYear] = useState<string>('');
    const [area, setArea] = useState<string | undefined>(undefined);
    const [mapThemes, setMapThemes] = useState<string[]>([]);
    const [heatingAgents, setHeatingAgents] = useState<AnalysisParams[]>([]);

    useEffect(() => {
        if (minimap.current) {
            const mm = minimap.current;
            const ses = mm.getSession();
            if (mapThemes.length > 0) {
                for (const theme of mapThemes) {
                    const getTheme = mm.getTheme(theme);
                    const datasource = getTheme.getDatasources()[0];
                    if (area) {
                        ses.getDatasource(datasource).setFilterParams(
                            { [cottageareasButtonFilter]: year, [cottageareasSelectFilter]: area }, //setFilterParams({ [aar]: year, [navn]: area });
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                    } else {
                        ses.setProperties(
                            'datasource_filter_state',
                            datasource,
                            { [cottageareasButtonFilter]: 'false', [cottageareasSelectFilter]: 'true' },
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                        ses.getDatasource(datasource).setFilterParams({ [cottageareasButtonFilter]: year }, (response) => {
                            getTheme.repaint();
                            if (response.exception) console.log(response.exception);
                        });
                    }
                }
            }
        }
    }, [area, year]);

    const onMapReady = (mm) => {
        minimap.current = mm;
        if (forceMapExtent) {
            const mapExtent = getForcedMapExtent();
            minimap.current.getMapControl().zoomToExtent(mapExtent);
        }
        const ses = mm.getSession();
        const ds = ses.getDatasource(cottageareasDatasource);
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setCottageAreasData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row[cottageareasButtonFilter];
                })
            );
            setYear(maxValue.toString());
            const analysisParams = getAnalysisParams(rows);
            let params: AnalysisParams[] = [];
            if (analysisParams.length > 0) {
                for (let i = 0; i < analysisParams.length; i++) {
                    const analysisParam = analysisParams[i];
                    params.push({ title: analysisParam, on: true });
                }
                setHeatingAgents(params);
            }
        });

        const dsArea = ses.getDatasource(cottageareasArea);
        dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
            setAreaData(areaRows);
        });
        const themesList = minimap.current
            .getThemeContainer()
            .getThemeGroup(cottageareasThemegroup)
            ._elements.map((item) => item.name); // Indsæt param istedet
        setMapThemes(themesList);
    };

    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        handleThemeToggle(rowIndex);
    };

    const handleThemeToggle = (event) => {
        const theme = mapThemes[event];
        minimap.current.getTheme(theme).toggle();
    };

    const filteredByArea =
        cottageAreasData.length > 0
            ? area
                ? cottageAreasData.filter((item) => item[cottageareasSelectFilter] === area)
                : cottageAreasData
            : [];

    const filteredByYear =
        filteredByArea.length > 0 ? filteredByArea.filter((item) => item[cottageareasButtonFilter] === year) : [];

    const cottageAreasTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(cottageAreasData);
    const uniqueAreas = getAreas(cottageAreasData);
    const cottageAreasStackedbar =
        filteredByArea.length > 0 && createStackedbarData(filteredByArea, heatingAgents, uniqueYears);

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

    const handleAreaFilter = (event) => {
        const area = event ? event.value : undefined;
        setArea(area);
        if (area) {
            const filteredAreaData = areaData.find((item) => item[cottageareasSelectFilter] === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 300);
        } else if (area === undefined) {
            minimap.current.getMapControl().setMarkingGeometry();
            const mapExtent = forceMapExtent ? getForcedMapExtent() : minimap.current.getMapControl()._mapConfig.getExtent();
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
                    <div className="columns is-widescreen">
                        <Map id={cottageareasMinimapId} name="cottage-areas" size="is-4-desktop box" onReady={onMapReady} />
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
                                            onChange={handleAreaFilter}
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
                                            {cottageAreasTable && (
                                                <TableLegend data={cottageAreasTable} onRowToggle={onHeatingAgentsToggle} />
                                            )}
                                        </div>
                                        <div className="column is-4-desktop is-3-tablet">
                                            <div className="block stackedbar-no-legend box">
                                                {cottageAreasStackedbar && (
                                                    <StackedbarNoLegend
                                                        title={area ? area : 'Alle sommerhusområder'}
                                                        categories={uniqueYears}
                                                        dataSeries={cottageAreasStackedbar}
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
export default CottageAreasPage;
