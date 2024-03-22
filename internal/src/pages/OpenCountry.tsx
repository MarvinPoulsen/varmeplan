import React, { FC, useEffect, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import {
    opencountryArea,
    opencountryButtonFilter,
    opencountryDatasource,
    opencountryMinimapId,
    opencountrySelectFilter,
    opencountryZoomToArea,
    opencountryThemegroup,
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
const OpenCountryPage: FC = () => {
    const minimap: any = useRef(null);
    const [openCountryData, setOpenCountryData] = useState<HeatPlanRow[]>([]);
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
                            { [opencountryButtonFilter]: year, [opencountrySelectFilter]: area }, //setFilterParams({ [aar]: year, [navn]: area });
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                    } else {
                        ses.setProperties(
                            'datasource_filter_state',
                            datasource,
                            { [opencountryButtonFilter]: 'false', [opencountrySelectFilter]: 'true' },
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                        ses.getDatasource(datasource).setFilterParams({ [opencountryButtonFilter]: year }, (response) => {
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
        const ds = ses.getDatasource(opencountryDatasource);
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setOpenCountryData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row[opencountryButtonFilter];
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
        if (opencountryArea) {
            const dsArea = ses.getDatasource(opencountryArea);
            dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
                setAreaData(areaRows);
            });
        }
        const themesList = minimap.current
            .getThemeContainer()
            .getThemeGroup(opencountryThemegroup)
            ._elements.map((item) => item.name);
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
        openCountryData.length > 0
            ? area
                ? openCountryData.filter((item) => item[opencountrySelectFilter] === area)
                : openCountryData
            : [];

    const filteredByYear =
        filteredByArea.length > 0 ? filteredByArea.filter((item) => item[opencountryButtonFilter] === year) : [];

    const openCountryTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(openCountryData);
    const openCountryStackedbar =
        openCountryData.length > 0 && createStackedbarData(openCountryData, heatingAgents, uniqueYears);

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
            const filteredAreaData = areaData.find((item) => item[opencountryZoomToArea] === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 300);
        } else if (area === undefined) {
            minimap.current.getMapControl().setMarkingGeometry();
            const mapExtent = forceMapExtent ? getForcedMapExtent() : minimap.current.getMapControl()._mapConfig.getExtent();
            minimap.current.getMapControl().zoomToExtent(mapExtent);
        }
    };
    let areaSelectRow: JSX.Element = <div></div>;
    if (opencountryArea) {
        const uniqueAreas = getAreas(openCountryData);
        const options = uniqueAreas.map((element) => {
            const value = element;
            const label = element;
            return {
                value,
                label,
            };
        });
        areaSelectRow = (
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
        );
    }

    return (
        <>
            <div id="OpenCountry-tab-content" className="container">
                <div className="block">
                    <div className="columns is-widescreen">
                        <Map id={opencountryMinimapId} name="open-country" size="is-4-desktop box" onReady={onMapReady} />
                        <div className="column is-8-desktop">
                            <div className="columns">
                                <div className="column is-narrow-tablet">
                                    <div className="field is-grouped">{yearButtonRow}</div>
                                </div>

                                <div className="column">{areaSelectRow}</div>
                            </div>
                            <div className="columns">
                                <div className="block">
                                    <div className="columns">
                                        <div className="column">
                                            {openCountryTable && (
                                                <TableLegend data={openCountryTable} onRowToggle={onHeatingAgentsToggle} />
                                            )}
                                        </div>
                                        <div className="column is-4-tablet">
                                            <div className="block stackedbar-no-legend box">
                                                {openCountryStackedbar && (
                                                    <StackedbarNoLegend
                                                        title={'Det åbne land'}
                                                        categories={uniqueYears}
                                                        dataSeries={openCountryStackedbar}
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
export default OpenCountryPage;
