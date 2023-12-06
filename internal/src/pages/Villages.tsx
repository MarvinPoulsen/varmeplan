import React, { FC, useEffect, useRef, useState } from 'react';
import '../components/charts/charts.scss';
import Map from '../components/minimap/Minimap';
import { villagesButtonFilter, villagesArea, villagesDatasource, villagesMinimapId, villagesThemegroup, villagesSelectFilter, villagesZoomToArea } from '../../config';
import TableLegend from '../components/charts/TableLegend';
import StackedbarNoLegend from '../components/charts/StackedbarNoLegend';
import Select from 'react-select';
import { getYears, getAreas, HeatPlanRow, AnalysisParams, createTableData, createStackedbarData, getAnalysisParams } from '../../utils';

export interface AreaRow {
    navn: string;
    shape_wkt: { wkt: string };
}


const VillagesPage: FC = () => {
    const minimap: any = useRef(null);
    const [villagesData, setVillagesData] = useState<HeatPlanRow[]>([]);
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
                            { [villagesButtonFilter]: year, [villagesSelectFilter]: area }, //setFilterParams({ [aar]: year, [navn]: area });
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                    } else {
                        ses.setProperties(
                            'datasource_filter_state',
                            datasource,
                            { [villagesButtonFilter]: 'false', [villagesSelectFilter]: 'true' },
                            (response) => {
                                getTheme.repaint();
                                if (response.exception) console.log(response.exception);
                            }
                        );
                        ses.getDatasource(datasource).setFilterParams({ [villagesButtonFilter]: year }, (response) => {
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
        const ses = mm.getSession();
        const ds = ses.getDatasource(villagesDatasource);
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setVillagesData(rows);
            let maxValue = Math.max.apply(
                null,
                rows.map((row) => {
                    return row[villagesButtonFilter];
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

        const dsArea = ses.getDatasource(villagesArea);
        dsArea.execute({ command: 'read' }, function (areaRows: AreaRow[]) {
            setAreaData(areaRows);
        });
        const themesList = minimap.current
            .getThemeContainer()
            .getThemeGroup(villagesThemegroup)
            ._elements.map((item) => item.name);
        setMapThemes(themesList);
    };


    const onHeatingAgentsToggle = (rowIndex: number) => {
        const updatedHeatingAgents = [...heatingAgents];
        updatedHeatingAgents[rowIndex].on = !updatedHeatingAgents[rowIndex].on;
        setHeatingAgents(updatedHeatingAgents);
        handleThemeToggle(rowIndex)
    };

    const handleThemeToggle = (event) => {
        const theme = mapThemes[event];
        minimap.current.getTheme(theme).toggle();
    };
	
    const filteredByArea =
        villagesData.length > 0 
			? area
				? villagesData.filter((item) => item[villagesSelectFilter] === area) 
				: villagesData 
			: [];

    const filteredByYear = 
		filteredByArea.length > 0 ? filteredByArea.filter((item) => item[villagesButtonFilter] === year) : [];

    const villagesTable = filteredByYear.length > 0 && createTableData(filteredByYear, heatingAgents);
    const uniqueYears = getYears(villagesData);
    const uniqueAreas = getAreas(villagesData);
    const villagesStackedbar = filteredByArea.length > 0 && createStackedbarData(filteredByArea, heatingAgents, uniqueYears);

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

const handleYearFilter = () => {

}

    const handleAreaFilter = (event) => {
        const area = event ? event.value : undefined;
        setArea(area);
        if (area) {
            const filteredAreaData = areaData.find((item) => item[villagesZoomToArea] === area);
            filteredAreaData && minimap.current.getMapControl().setMarkingGeometry(filteredAreaData.shape_wkt, true, true, 300);
        } else if (area === undefined) {
            minimap.current.getMapControl().setMarkingGeometry();
            const mapExtent = minimap.current.getMapControl()._mapConfig.getExtent();
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
        <div id="Villages-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={villagesMinimapId} name="villages" size="is-4" onReady={onMapReady} />
                        <div className="column is-8">
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
                                    />
                                </div>
                            </div>
                            <div className="block">
                                <div className="columns">
                                    <div className="column">
                                        {villagesTable && (
                                            <TableLegend data={villagesTable} onRowToggle={onHeatingAgentsToggle} />
                                        )}
                                    </div>
                                    <div className="column is-4">
                                        <div className="block stackedbar-no-legend">
                                            {villagesStackedbar && (
                                                <StackedbarNoLegend
                                                    title={area ? area : 'Alle forsyningesområder'}
                                                    categories={uniqueYears}
                                                    dataSeries={villagesStackedbar}
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
export default VillagesPage;
function setMapThemes(themesList: any) {
    throw new Error('Function not implemented.');
}

function setYear(arg0: any) {
    throw new Error('Function not implemented.');
}

function setHeatingAgents(params: AnalysisParams[]) {
    throw new Error('Function not implemented.');
}

function setAreaData(areaRows: AreaRow[]) {
    throw new Error('Function not implemented.');
}

function setArea(uniqueArea: string): void {
    throw new Error('Function not implemented.');
}

