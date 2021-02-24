import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import HeaderHOC from "./Header";
window.React = React

 const Index = () => {
    return (
        <HeaderHOC/>
    );
};
const renderHeader = (el, props) => {
    ReactDOM.render(
        <Index {...props}/>,
        document.querySelector(el)
    );

}
export default renderHeader;


