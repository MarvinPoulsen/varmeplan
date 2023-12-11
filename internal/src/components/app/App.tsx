import React, { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './app.scss';

import HeroNavigation from '../heronavigation/HeroNavigation';
import SupplyAreaPage from '../../pages/SupplyArea';
import VillagesPage from '../../pages/Villages';
import CottageAreasPage from '../../pages/CottageAreas';
import OpenCountryPage from '../../pages/OpenCountry';
import MunicipalityPage from '../../pages/Municipality';

const App: FC = () => {
    return (
        <>
            <section className="hero is-primary is-small">
                <HeroNavigation />
            </section>
            <section className="section">
                <Routes>
                    <Route path="/">
                        <Route index element={<SupplyAreaPage />} />
                        <Route path="/forsyningsomraader" element={<SupplyAreaPage />} />
                        <Route path="/landsbyer" element={<VillagesPage />} />
                        <Route path="/sommerhusomraader" element={<CottageAreasPage />} />
                        <Route path="/detaabneland" element={<OpenCountryPage />} />
                        <Route path="/lollandkommune" element={<MunicipalityPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </section>
        </>
    );
};

export default App;
