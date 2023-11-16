const varmeplanMinimapIdParam = '[module.varmeplan.test.minimapid]';
const varmeplanMinimapIdDev = '12c3cde2-dda6-406b-8074-4a5d618b268b';
export const varmeplanMinimapId = varmeplanMinimapIdParam.includes('[') ? varmeplanMinimapIdDev : varmeplanMinimapIdParam;
