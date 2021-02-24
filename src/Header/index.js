import {useState,useEffect} from 'react';
import U28V1,{PageContext} from "./u28/v1";

const HeaderDoc = () => {
    const [globalMenu, setGlobalMenu] = useState('');
    const [viewport, setViewport] = React.useState({ width: 0, height: 0, isMobile: false });

    const handleWindowResize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        const isMobile = width < 860;
        const isTablet = width > 860 && width < 1600;
        setViewport({ width, height, isMobile, isTablet });
    };
    useEffect(() => {
        document.body.classList.add('f20', 'f20v0');
        document.getElementsByTagName('html')[0].classList.add('js');
        setTimeout(() => document.body.classList.add('ready'), 500);
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    const updateGlobalMenu = (menuContent) => {
        setGlobalMenu(menuContent);
    };
    return (
        <PageContext.Provider value={{globalMenu, updateGlobalMenu,viewport}}>
            <U28V1/>
        </PageContext.Provider>
    )
}
export default HeaderDoc;
