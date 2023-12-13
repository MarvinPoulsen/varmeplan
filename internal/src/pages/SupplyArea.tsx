import React, { FC, useEffect, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import Map from '../components/minimap/Minimap';
import {
    forceMapExtent,
    supplyareaArea,
    supplyareaButtonFilter,
    supplyareaDatasource,
    supplyareaMinimapId,
    supplyareaSelectFilter,
    supplyareaThemegroup,
    supplyareaZoomToArea,
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
} from '../../utils';

export interface AreaRow {
    navn1203: string;
    shape_wkt: { wkt: string };
}

const SupplyAreaPage: FC = () => {
    const minimap: any = useRef(null);
    const [supplyAreaData, setSupplyAreaData] = useState<HeatPlanRow[]>([]);
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
                            { [supplyareaButtonFilter]: year, [supplyareaSelectFilter]: area }, //setFilterParams({ [aar]: year, [navn]: area });
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                    } else {
                        ses.setProperties(
                            'datasource_filter_state',
                            datasource,
                            { [supplyareaButtonFilter]: 'false', [supplyareaSelectFilter]: 'true' },
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                        ses.getDatasource(datasource).setFilterParams({ [supplyareaButtonFilter]: year }, (response) => {
                            getTheme.repaint();
                            if (response.exception) console.log(response.exception);
                        });
                    }
                }
            }
            // if (area) {
            //     var req = minimap.current.getSession().createPageRequest('set-datasource-defaults');
            //     req.call(
            //         {
            //             datasource: 'ds_varmeplan_forsyningsomr_fjernvarme_view',
            //             names: 'aar,navn',
            //             values: year + ',' + area,
            //         },
            //         function (response) {
            //             minimap.current.getTheme('theme-varmeplan_forsyningsomr_fjernvarme_view').repaint();
            //         }
            //     );
            // } else {
            //     var req = minimap.current.getSession().createPageRequest('clear-datasource-defaults');
            //     req.call({ datasource: 'ds_varmeplan_forsyningsomr_fjernvarme_view' }, function (response) {
            //         var req = minimap.current.getSession().createPageRequest('set-datasource-defaults');
            //         req.call(
            //             { datasource: 'ds_varmeplan_forsyningsomr_fjernvarme_view', names: 'aar', values: year },
            //             function (response) {
            //                 minimap.current.getTheme('theme-varmeplan_forsyningsomr_fjernvarme_view').repaint();
            //             }
            //         );
            //     });
            // }
        }
    }, [area, year]);

    const onMapReady = (mm) => {
        minimap.current = mm;
        if (forceMapExtent){
            minimap.current.getMapControl().zoomToExtent(forceMapExtent);
        }
        const ses = mm.getSession();
        const ds = ses.getDatasource(supplyareaDatasource);
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setSupplyAreaData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row[supplyareaButtonFilter];
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

        const dsArea = ses.getDatasource(supplyareaArea);
        dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
            setAreaData(areaRows);
        });
        const themesList = minimap.current
            .getThemeContainer()
            .getThemeGroup(supplyareaThemegroup)
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
        supplyAreaData.length > 0
            ? area
                ? supplyAreaData.filter((item) => item[supplyareaSelectFilter] === area)
                : supplyAreaData
            : [];

    const filteredByYear =
        filteredByArea.length > 0 ? filteredByArea.filter((item) => item[supplyareaButtonFilter] === year) : [];
    const supplyAreaTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(supplyAreaData);
    const uniqueAreas = getAreas(supplyAreaData);
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

    const handleAreaFilter = (event) => {
        const area = event ? event.value : undefined;
        setArea(area);
        if (area) {
            const filteredAreaData = areaData.find((item) => item[supplyareaZoomToArea] === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 300);
        } else if (area === undefined) {
            minimap.current.getMapControl().setMarkingGeometry();
            const mapExtent = forceMapExtent ? forceMapExtent : minimap.current.getMapControl()._mapConfig.getExtent();
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
            <div id="SupplyArea-tab-content" className="container">
                <div className="block">
                    <div className="columns is-desktop">
                        <Map id={supplyareaMinimapId} name="supply-area" size="is-4-desktop box" onReady={onMapReady} />
                        <div className="column is-8-desktop">
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
                                        theme={(theme) => (
                                            {
                                            ...theme,
                                            borderRadius: 4,
                                            colors: {
                                              ...theme.colors,
                                              primary25: '#e4eff9',
                                              primary50: '#3e8ed040',
                                              primary: '#3082c5',
                                            },
                                          }
                                          )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="block">
                                <div className="columns is-desktop">
                                    <div className="column">
                                        {supplyAreaTable && (
                                            <TableLegend data={supplyAreaTable} onRowToggle={onHeatingAgentsToggle} />
                                        )}
                                    </div>
                                    <div className="column is-4-tablet">
                                        <div className="block stackedbar-no-legend box">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SupplyAreaPage;
