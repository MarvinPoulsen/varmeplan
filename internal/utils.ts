
import colors from './colors';

export interface HeatPlanRow {
    id: number;
    navn: string;
    aar: string;
    varme: string;
    antalbygninger: string;
    boligareal: string;
    erhvervsareal: string;
}

export interface AnalysisParams {
    title: string;
    on: boolean;
}

export interface TLData {
    varme: string;
    antalbygninger: number;
    boligareal: number;
    erhvervsareal: number;
    on: boolean;
}

export interface StackedDataSeries{
  name: string;
  values: number[];
  stack: string;
};

export const toPrettyNumber = (numValue) => {
	return new Intl.NumberFormat().format(numValue);
}

export const getBackgroundColor = (start)=>{
	if (start){
	  const arr1 = colors.bgColors.slice(start);
	  const arr2 = colors.bgColors.slice(0,start);
	  return arr1.concat(arr2); 
	} else {
	  return colors.bgColors;
	}
}

export const getBorderColor = (start)=>{
  if (start){
    const arr1 = colors.borderColors.slice(start);
    const arr2 = colors.borderColors.slice(0,start);
    return arr1.concat(arr2); 
  } else {
    return colors.borderColors;
  }
}

export const getYears = (data: HeatPlanRow[]) => {
    const uniqueYears = [...new Set(data.map((item) => item.aar))];
    uniqueYears.sort(
        (a, b) => a.localeCompare(b) //using String.prototype.localCompare()
    );
    return uniqueYears;
};

export const getAreas = (data: HeatPlanRow[]) => {
    const uniqueAreas = [...new Set(data.map((item) => item.navn))];
    uniqueAreas.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueAreas;
};



export const createTableData = (data: HeatPlanRow[], analysisParams: AnalysisParams[]) => {
    const tableDate: TLData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const varme = analysisParam.title;
        const antalbygninger = data.find((item) => item.varme === varme)
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.antalbygninger), 0)
            : 0;
        const boligareal = data.find((item) => item.varme === varme)
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.boligareal), 0)
            : 0;
        const erhvervsareal = data.find((item) => item.varme === varme)
            ? data.filter((item) => item.varme === varme).reduce((sum, cur) => sum + parseInt(cur.erhvervsareal), 0)
            : 0;
        const on = analysisParam.on;
        tableDate.push({
            varme,
            antalbygninger,
            boligareal,
            erhvervsareal,
            on,
        });
    }
    return tableDate;
};

export const createStackedbarData = (data: HeatPlanRow[], analysisParams: AnalysisParams[], years: string[]) => {
    const stackedbarData: StackedDataSeries[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const values: number[] = [];
        for (let k = 0; k < years.length; k++) {
            const year = years[k];
            const dataByYear = data.filter((item) => item.aar === year);
            const dataByTitle = dataByYear.filter((item) => item.varme === analysisParam.title);
            const value = dataByTitle.reduce((sum, cur) => sum + parseInt(cur.antalbygninger), 0);
            values.push(value);
        }
        stackedbarData.push({
            name: analysisParam.title,
            values,
            stack: '0',
        });
    }
    return stackedbarData;
};
