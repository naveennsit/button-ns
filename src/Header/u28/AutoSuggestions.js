/* eslint-disable max-len */
/* Name                 : AutoSuggestions
 * Type                 : Split Component
 * Child Components     : AutoCompleteLink, AutoSuggestLink
 * External Libraries   : NA
 * Generic Components   : NA
 * Descriptions         : Hadnle autocomplete/autosuggestions for the keyword entered in ASK Oracle search bar
 */

/* eslint-disable jsx-a11y/role-supports-aria-props */

/* Imports */
import React, { useState, useEffect } from 'react';
import { fetchSearchAutoSuggestions, fetchSearchAutoComplete } from '../actions/headerActions';
import AutoCompleteLink from './AutoCompleteLink';
import AutoSuggestLink from './AutoSuggestLink';
let searchClose = false;
const AutoSuggestions = ({
  searchValueTemp,
  dropdownStyles,
  handleSearch,
  handleDropdownActiveSatate,
  updateClosestSearchValue,
  wrapperStyle,
  fallbackWidth,
  resetAutoSuggests,
  activeSearch
}) => {
  /* Declarations */
  const defaultAutoSuggests = { loading: false, data: [] };

  /* States */
  const [openSuggestionDropdown, updateSuggestionDropdownState] = useState(false);
  const [autoSuggestions, setautoSuggestionsState] = useState({ ...defaultAutoSuggests });
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [firstMatchedVal, setFirstMatchedVal] = useState({});
  const [searchValue, updateSearchValue] = useState('');

  /* Hooks */
  useEffect(() => {
    updateSearchValue(searchValueTemp);
    handleAutoSuggestions();
  }, [searchValueTemp]);

  useEffect(() => {
    clearAutoSuggests();
  }, [resetAutoSuggests]);

  useEffect(() => {
    if (activeSearch) {
      searchClose = false;
      updateSuggestionDropdownState(false);
    } else {
      searchClose = true;
    }
  }, [activeSearch]);

  /* Functions */
  // Clear Auto suggetions/load data
  const handleAutoSuggestions = () => {
    if (searchValueTemp.length > 2) {
      getAutoSuggestions();
      getAutoCompleteValues();
    } else {
      clearAutoSuggests();
    }
  };

  // clear populate values
  const clearAutoSuggests = () => {
    updateSuggestionDropdownState(false);
    setAutoCompleteData([]);
    setautoSuggestionsState({ ...defaultAutoSuggests });
    updateSearchValue('');
    setFirstMatchedVal({});
  };

  // Get Auto Suggestions data from API
  const getAutoSuggestions = () => {
    setautoSuggestionsState({
      ...autoSuggestions,
      loading: true
    });

    fetchSearchAutoSuggestions(searchValueTemp)
      .then((autoSuggestResp) => {
        // handleDropdownActiveSatate(false);
        // setautoSuggestionsState({ data: [], loading: false });
        // setTimeout(() => {
        if (!searchClose) {
          handleDropdownActiveSatate(true);
          setautoSuggestionsState({
            data: [...autoSuggestResp],
            loading: false
          });
          updateSuggestionDropdownState(true);
        }
        // }, 500);
      });
  };

  // Get Auto Complete data from API
  const getAutoCompleteValues = () => {
    fetchSearchAutoComplete(searchValueTemp).then((autoCompleteDataTempResp) => {
      // setFirstMatchedText([]);
      // setAutoCompleteData([]);
      // setTimeout(() => {
      // Check firts result is cloesest match with search keyword
      setFirstMatchedText([...autoCompleteDataTempResp]);
      setAutoCompleteData([...autoCompleteDataTempResp]);
      // }, 500);
    });
  };

  // Find any autocomplete term matchs with searched term, if match disaply as first result in the list
  const setFirstMatchedText = (data) => {
    let matchedVal = {};
    if (data.length > 0 && data[0].label && data[0].label.toLocaleLowerCase().indexOf(searchValueTemp.toLocaleLowerCase()) === 0) {
      // eslint-disable-next-line prefer-destructuring
      matchedVal = data[0];
      const newSearchVal = data[0].label;
      const tmp = `${searchValueTemp}${newSearchVal.substr(searchValueTemp.length, newSearchVal.length)}`;
      updateSearchValue(tmp);
      updateClosestSearchValue(tmp);
    }
    setFirstMatchedVal(matchedVal);
  };

  const textHighliter = (text) => text.replace(new RegExp(searchValueTemp, 'gi'), `<b>${searchValueTemp}</b>`);

  return (
    <div className="u28suggestw1" style={{ transform: (wrapperStyle && wrapperStyle.transform) || 'inherit' }}>
      <ul
        className={['u28suggest', openSuggestionDropdown && searchValue.length > 0 ? 'active' : ''].join(' ')}
        style={{ maxWidth: fallbackWidth || 'inherit' }}
      >
        {firstMatchedVal && firstMatchedVal.label ? (
          <li aria-selected>
            <a
              onClick={(e) => handleSearch(e)}
              style={{ marginLeft: dropdownStyles.left, maxWidth: dropdownStyles.width }}
              className="u28-search u28complete"
              data-lbl={`keyword:${searchValueTemp}:suggest:${firstMatchedVal.label}`}
              data-trackas="header:search"
              href="#"
              dangerouslySetInnerHTML={{ __html: textHighliter(firstMatchedVal.label) }}
              tabIndex={'-1'}
            />
          </li>
        ) : null}
        {firstMatchedVal && firstMatchedVal.label !== searchValueTemp && (
          <li aria-selected={!!searchValue && !firstMatchedVal.label}>
            <a
              onClick={(e) => handleSearch(e)}
              tabIndex={'-1'}
              className="u28-search u28complete"
              style={{ marginLeft: dropdownStyles.left, maxWidth: dropdownStyles.width }}
              // data-lbl={`keyword:${searchValueTemp}:suggest:${searchValueTemp}`}
              // data-trackas="header:search"
              href="#"
            >
              {searchValueTemp}
            </a>
          </li>
        )}
        {/* For Auto Suggestions */}
        {autoSuggestions.data.map((val, i) => {
          if (i <= 2) {
            return <AutoSuggestLink dropdownStyles={dropdownStyles} key={i} val={val} searchValue={searchValueTemp} />;
          }
          return false;
        })}
        {/* For Auto Complete */}
        {autoCompleteData.map((val, i) => (
          <AutoCompleteLink
            handleSearch={handleSearch}
            dropdownStyles={dropdownStyles}
            key={i}
            val={val}
            searchValue={searchValueTemp}
          />
        ))}
      </ul>
    </div>
  );
};
export default AutoSuggestions;
