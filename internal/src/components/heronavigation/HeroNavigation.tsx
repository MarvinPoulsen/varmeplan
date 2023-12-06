import { Link, useLocation } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiNaturePeople,
    mdiHomeGroup,
    mdiBeach,
    mdiHomeThermometer,
    mdiChartBar  , 
} from '@mdi/js';
enum Tab {
    SupplyArea,
    Villages,
    CottageAreas,
    OpenCountry,
    Municipality,
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
                case '/lollandkommune':
                    setActiveTab(Tab.Municipality,
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
                                    <span className="navigation-text ml-1">Forsyningsområder</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Villages ? 'is-active' : ''}>
                                <Link to="/landsbyer">
                                    <span>
                                        <Icon path={mdiHomeGroup} size={1} />
                                    </span>
                                    <span className="navigation-text ml-1">Landsbyer</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.CottageAreas ? 'is-active' : ''}>
                                <Link to="/sommerhusomraader">
                                    <span>
                                        <Icon path={mdiBeach} size={1} />
                                    </span>
                                    <span className="navigation-text ml-1">Sommerhusområder</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.OpenCountry ? 'is-active' : ''}>
                                <Link to="/detaabneland">
                                    <span>
                                        <Icon path={mdiNaturePeople} size={1} />
                                    </span>
                                    <span className="navigation-text ml-1">Det åbne land</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Municipality ? 'is-active' : ''}>
                                <Link to="/lollandkommune">
                                    <span>
                                        <Icon path={mdiChartBar  } size={1} />
                                    </span>
                                    <span className="navigation-text ml-1">Hele Lolland Kommune</span>
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
