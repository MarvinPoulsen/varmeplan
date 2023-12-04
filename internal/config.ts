const forceAnalysisParam = '[module.varmeplan.force.analysisparams]';
const forceAnalysisDev = undefined;
// const forceAnalysisDev = ["Fjernvarme/blokvarme","Varmepumpe","Elvarme","Biobrændsel","Olie","Andet"];
export const forceAnalysis = forceAnalysisParam.includes('[') ? forceAnalysisDev : forceAnalysisParam;

const supplyareaMinimapIdParam = '[module.varmeplan.supplyarea.minimapid]';
const supplyareaMinimapIdDev = '12c3cde2-dda6-406b-8074-4a5d618b268b';
export const supplyareaMinimapId = supplyareaMinimapIdParam.includes('[') ? supplyareaMinimapIdDev : supplyareaMinimapIdParam;

const villagesMinimapIdParam = '[module.varmeplan.villages.minimapid]';
const villagesMinimapIdDev = 'e53080e9-fbde-4e12-8ba3-a46e4546c94e';
export const villagesMinimapId = villagesMinimapIdParam.includes('[') ? villagesMinimapIdDev : villagesMinimapIdParam;

const cottageareasMinimapIdParam = '[module.varmeplan.cottageareas.minimapid]';
const cottageareasMinimapIdDev = '1e33f516-c9fd-41a6-a761-eb1d2890c0af';
export const cottageareasMinimapId = cottageareasMinimapIdParam.includes('[') ? cottageareasMinimapIdDev : cottageareasMinimapIdParam;

const opencountryMinimapIdParam = '[module.varmeplan.opencountry.minimapid]';
const opencountryMinimapIdDev = '5490d72f-1077-4969-8c3c-1e6cc7fd012f';
export const opencountryMinimapId = opencountryMinimapIdParam.includes('[') ? opencountryMinimapIdDev : opencountryMinimapIdParam;

// supplyarea
const supplyareaDataParam = '[module.varmeplan.supplyarea.data]';
const supplyareaDataDev = 'ds_varmeplan_vi_forsyningsomr_view';
export const supplyareaData = supplyareaDataParam.includes('[') ? supplyareaDataDev : supplyareaDataParam;

const supplyareaAreaParam = '[module.varmeplan.supplyarea.area]';
const supplyareaAreaDev = 'ds_varmeplan_forsyningsomr';
export const supplyareaArea = supplyareaAreaParam.includes('[') ? supplyareaAreaDev : supplyareaAreaParam;

const supplyareaThemegroupParam = '[module.varmeplan.supplyarea.themegroup]';
const supplyareaThemegroupDev = 'forsyningsomr';
export const supplyareaThemegroup = supplyareaThemegroupParam.includes('[') ? supplyareaThemegroupDev : supplyareaThemegroupParam;

const supplyareaSelectFilterParam = '[module.varmeplan.supplyarea.select.filter.column]';
const supplyareaSelectFilterDev = 'navn';
export const supplyareaSelectFilter = supplyareaSelectFilterParam.includes('[') ? supplyareaSelectFilterDev : supplyareaSelectFilterParam;

const supplyareaButtonFilterParam = '[module.varmeplan.supplyarea.button.filter.column]';
const supplyareaButtonFilterDev = 'aar';
export const supplyareaButtonFilter = supplyareaButtonFilterParam.includes('[') ? supplyareaButtonFilterDev : supplyareaButtonFilterParam;

const supplyareaZoomToAreaParam = '[module.varmeplan.supplyarea.zoom2area.column]';
const supplyareaZoomToAreaDev = 'navn1203';
export const supplyareaZoomToArea = supplyareaZoomToAreaParam.includes('[') ? supplyareaZoomToAreaDev : supplyareaZoomToAreaParam;
// supplyarea


// villages
const villagesDataParam = '[module.varmeplan.villages.data]';
const villagesDataDev = 'ds_varmeplan_vi_landsbyer_view';
export const villagesData = villagesDataParam.includes('[') ? villagesDataDev : villagesDataParam;

const villagesAreaParam = '[module.varmeplan.villages.area]';
const villagesAreaDev = 'ds_varmeplan_landsbyer_varmeplan';
export const villagesArea = villagesAreaParam.includes('[') ? villagesAreaDev : villagesAreaParam;

const villagesThemegroupParam = '[module.varmeplan.villages.themegroup]';
const villagesThemegroupDev = 'landsbyer';
export const villagesThemegroup = villagesThemegroupParam.includes('[') ? villagesThemegroupDev : villagesThemegroupParam;

const villagesSelectFilterParam = '[module.varmeplan.villages.select.filter.column]';
const villagesSelectFilterDev = 'navn';
export const villagesSelectFilter = villagesSelectFilterParam.includes('[') ? villagesSelectFilterDev : villagesSelectFilterParam;

const villagesButtonFilterParam = '[module.varmeplan.villages.button.filter.column]';
const villagesButtonFilterDev = 'aar';
export const villagesButtonFilter = villagesButtonFilterParam.includes('[') ? villagesButtonFilterDev : villagesButtonFilterParam;

const villagesZoomToAreaParam = '[module.varmeplan.villages.zoom2area.column]';
const villagesZoomToAreaDev = 'navn';
export const villagesZoomToArea = villagesZoomToAreaParam.includes('[') ? villagesZoomToAreaDev : villagesZoomToAreaParam;
// villages


// cottageareas
const cottageareasDataParam = '[module.varmeplan.cottageareas.data]';
const cottageareasDataDev = 'ds_varmeplan_vi_sommerhusomr_view';
export const cottageareasData = cottageareasDataParam.includes('[') ? cottageareasDataDev : cottageareasDataParam;

const cottageareasAreaParam = '[module.varmeplan.cottageareas.area]';
const cottageareasAreaDev = 'ds_varmeplan_sommerhusomrader_navne';
export const cottageareasArea = cottageareasAreaParam.includes('[') ? cottageareasAreaDev : cottageareasAreaParam;

const cottageareasThemegroupParam = '[module.varmeplan.cottageareas.themegroup]';
const cottageareasThemegroupDev = 'sommerhusomr';
export const cottageareasThemegroup = cottageareasThemegroupParam.includes('[') ? cottageareasThemegroupDev : cottageareasThemegroupParam;

const cottageareasSelectFilterParam = '[module.varmeplan.cottageareas.select.filter.column]';
const cottageareasSelectFilterDev = 'navn';
export const cottageareasSelectFilter = cottageareasSelectFilterParam.includes('[') ? cottageareasSelectFilterDev : cottageareasSelectFilterParam;

const cottageareasButtonFilterParam = '[module.varmeplan.cottageareas.button.filter.column]';
const cottageareasButtonFilterDev = 'aar';
export const cottageareasButtonFilter = cottageareasButtonFilterParam.includes('[') ? cottageareasButtonFilterDev : cottageareasButtonFilterParam;

const cottageareasZoomToAreaParam = '[module.varmeplan.cottageareas.zoom2area.column]';
const cottageareasZoomToAreaDev = 'navn';
export const cottageareasZoomToArea = cottageareasZoomToAreaParam.includes('[') ? cottageareasZoomToAreaDev : cottageareasZoomToAreaParam;
// cottageareas


// opencountry
const opencountryDataParam = '[module.varmeplan.opencountry.data]';
const opencountryDataDev = 'ds_varmeplan_vi_aabneland_view';
export const opencountryData = opencountryDataParam.includes('[') ? opencountryDataDev : opencountryDataParam;

const opencountryAreaParam = '[module.varmeplan.opencountry.area]';
const opencountryAreaDev = undefined;
export const opencountryArea = opencountryAreaParam.includes('[') ? opencountryAreaDev : opencountryAreaParam;

const opencountryThemegroupParam = '[module.varmeplan.opencountry.themegroup]';
const opencountryThemegroupDev = 'aabneland';
export const opencountryThemegroup = opencountryThemegroupParam.includes('[') ? opencountryThemegroupDev : opencountryThemegroupParam;

const opencountrySelectFilterParam = '[module.varmeplan.opencountry.select.filter.column]';
const opencountrySelectFilterDev = 'navn';
export const opencountrySelectFilter = opencountrySelectFilterParam.includes('[') ? opencountrySelectFilterDev : opencountrySelectFilterParam;

const opencountryButtonFilterParam = '[module.varmeplan.opencountry.button.filter.column]';
const opencountryButtonFilterDev = 'aar';
export const opencountryButtonFilter = opencountryButtonFilterParam.includes('[') ? opencountryButtonFilterDev : opencountryButtonFilterParam;

const opencountryZoomToAreaParam = '[module.varmeplan.opencountry.zoom2area.column]';
const opencountryZoomToAreaDev = 'navn';
export const opencountryZoomToArea = opencountryZoomToAreaParam.includes('[') ? opencountryZoomToAreaDev : opencountryZoomToAreaParam;
// opencountry

