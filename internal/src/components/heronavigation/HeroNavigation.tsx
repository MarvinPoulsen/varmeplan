import { Link, useLocation } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiNaturePeople,
    mdiHomeGroup,
    mdiBeach,
    mdiHomeThermometer,
} from '@mdi/js';
enum Tab {
    SupplyArea,
    Villages,
    CottageAreas,
    OpenCountry,
}
const HeroNavigation: FC = () => {
    let location = useLocation();

    const [isActiveTab, setActiveTab] = useState<Tab>(0);
    React.useEffect(() => {
        switch (location.pathname) {
            case '/':
            case '/forsyningsomraader':
                setActiveTab(Tab.SupplyArea);
                break;
            case '/landsbyer':
                setActiveTab(Tab.Villages);
                break;
            case '/sommerhusomraader':
                setActiveTab(Tab.CottageAreas);
                break;
            case '/detaabneland':
                setActiveTab(Tab.OpenCountry,
                    );
                break;
            default:
                setActiveTab(0);
        }
    }, [location]);
    const title: string = 'Varmeplan';
    return (
        <>
            <div className="hero-body">
                <div className="container has-text-centered">
                    <p className="title">{title}</p>
                </div>
            </div>
            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                    <div className="container">
                        <ul>
                            <li className={isActiveTab === Tab.SupplyArea ? 'is-active' : ''}>
                                <Link to="/forsyningsomraader">
                                    <span>
                                        <Icon path={mdiHomeThermometer} size={1} />
                                    </span>
                                    <span className="navigation-text">Forsyningsområder</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Villages ? 'is-active' : ''}>
                                <Link to="/landsbyer">
                                    <span>
                                        <Icon path={mdiHomeGroup} size={1} />
                                    </span>
                                    <span>Landsbyer</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.CottageAreas ? 'is-active' : ''}>
                                <Link to="/sommerhusomraader">
                                    <span>
                                        <Icon path={mdiBeach} size={1} />
                                    </span>
                                    <span>Sommerhusområder</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.OpenCountry ? 'is-active' : ''}>
                                <Link to="/detaabneland">
                                    <span>
                                        <Icon path={mdiNaturePeople} size={1} />
                                    </span>
                                    <span>Det åbne land</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    );
};
export default HeroNavigation;
