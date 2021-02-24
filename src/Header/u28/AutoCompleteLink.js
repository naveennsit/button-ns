/* Name                 : AutoCompleteLink
 * Type                 : Single Component
 * Child Components     : NA
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : NA
 * Descriptions         : Accepts value and generates auto complete link with search event
 */

/* eslint-disable jsx-a11y/role-supports-aria-props */

/* Imports */
import React from 'react';

const AutoCompleteLink = ({ firstMatched, val, searchValue, dropdownStyles, handleSearch }) => {
  /* Declarations */
  const repRegex = new RegExp(searchValue, 'gi');
  const completeb = val.label.replace(repRegex, `<b>${searchValue}</b>`);
  const AutoCompleteHTML = (
    <li aria-selected={!!firstMatched}>
      <a
        href="#"
        onClick={(e) => handleSearch(e)}
        className="u28-search u28complete"
        data-trackas="header:search"
        data-lbl={`keyword:${searchValue}:suggest:${val.label}`}
        dangerouslySetInnerHTML={{ __html: completeb }}
        style={{ marginLeft: dropdownStyles.left, maxWidth: dropdownStyles.width }}
        tabIndex={'-1'}
      />
    </li>
  );

  return val.label === searchValue ? null : AutoCompleteHTML;
};
export default AutoCompleteLink;