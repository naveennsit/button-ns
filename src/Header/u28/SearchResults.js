/* eslint-disable max-len */
/* Name                 : SearchResults
 * Type                 : Split Component
 * Child Components     : NoResults
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : ClientRequestFactory, globalConstants
 * Descriptions         : Show search results for the entered keyword and display NoResults if not found
 */

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

/* Imports */
import React, { useEffect, useState, useRef } from 'react';
import { msg } from '../actions/headerActions';
import { fetchSearchResults } from '../actions/headerActions';
import NoResults from './NoResults';

export const U28_DEBOUNCE_NUM = 600;

const SearchResult = ({
  resetSearchStatus,
  searchValue,
  dropdownStyles,
  updateSearchStatus,
  dropdownActive,
  searchFilters,
  updateInputText,
  focusToCloseButton
}) => {
  /* Declarations */
  const params = { Dy: '1', Nty: '1', Ntk: 'SI-ALL5', format: 'json', No: 0, Ntt: '' };
  const { city, lang, filterText, cityText } = searchFilters;

  /* States */
  const resultRef = useRef();
  const u28w4Ref = useRef();
  const u28CloseResult = useRef();
  const [searchResults, updateResults] = useState([]);
  const [siteinks, setSitelinksState] = useState(false);
  const [recomendedresult, setRecomendedResultState] = useState('');
  const [requestStatus, updateStatus] = useState('init');
  const [resultsCount, updateResultsCount] = useState(0);
  const [isFilterClear, clearFilter] = useState(false);

  /* hooks */
  useEffect(() => {
    if (dropdownActive) {
      resetResults();
      getSearchResults();
    }
  }, [searchValue]);

  useEffect(() => {
    resetResults();
  }, [resetSearchStatus]);

  useEffect(() => {
    if (requestStatus === 'loaded' && searchResults.length < 5) {
      setTimeout(() => {
        u28CloseResult.current
          .focus();
      }, 150);
    }
  }, [requestStatus, searchResults]);

  /* Functions */
  // Reset search results
  const resetResults = () => {
    updateStatus('init');
    setSitelinksState(false);
    setRecomendedResultState('');
    updateResults([]);
    updateResultsCount(0);
    u28w4Ref.current.scrollTop = 0;
  };

  // Get data for search term
  const getSearchResults = () => {
    // Update Data Requesting status
    updateSearchStatus({ status: 'loading' });
    updateStatus('loading');

    params.Ntt = searchValue;
    params.No = resultsCount;

    const details = { params, city, lang, isFilterClear };
    fetchSearchResults(details).then((resp) => {
      const { reccomendedresult, results, siteLinks } = resp;
      console.debug(msg('u28SearchResultsComponent', siteLinks));
      if (resp) {
        setTimeout(() => {
          updateSearchStatus({ status: 'loaded' });
          updateStatus('loaded');
        }, U28_DEBOUNCE_NUM + 300);
        updateStatus('loaded');
      }
      if (Array.isArray(results) && results.length > 0) {
        setRecomendedResultState(reccomendedresult);
        if (params.No === 0) {
          if (siteLinks) {
            setSitelinksState({ ...siteLinks });
          }
          updateResults([...results]);
        } else {
          updateResults([...searchResults, ...results]);
        }
        fixcb19v2();
        initBrightcoveVideos();
      }
      if (resp) {
        try {
          if (results.length > 0) {
            window.s.prop3 = `${window.s.pageName}:Search>${searchValue}`;
            window.s.prop4 = `Search>${searchValue}`;
            window.s.prop5 = '';
            window.s.prop6 = '';
          } else {
            window.s.prop6 = '0';
            window.s.prop3 = '';
            window.s.prop4 = '';
            window.s.prop5 = `Search>${searchValue}`;
          }

          window.s.prop8 = window.s.pageName;
          window.s.eVar26 = 'search:askoracle';
          window.s.prop26 = window.s.eVar26;
          window.s.channel = 'askoraclesearch';
          // window.s.eVar52 = url.href;
          window.s.pageName = `${window.s_account[1]}:${window.s_account[2]}:askoraclesearch`;
          window.s_Ping(true);
          window.s.pageName = window.s.prop8;
        } catch (e) {
          console.debug(msg('u28SearchResultsComponent', 'analytics var fail'));
        }
      }
    });
  };

  // ALignment fix for VB19V2(for image)
  const fixcb19v2 = () => {
    const target = resultRef.current;
    target.querySelectorAll('.cb19v2').forEach((ele) => {
      if (ele.querySelector('img') || ele.querySelector('.bcthumbnail')) {
        ele.classList.add('u28proimg');
      }
    });
  };

  const renderVideo = () =>{
    try {
      resultRef.current.querySelectorAll('.u28w8 .bcembed').forEach((ele) => {
        if (window.bc_loadplayer) {
          window.bc_loadplayer(ele);
        }
      });
    } catch (err) {

    }
  }

  // Init Video Results
  const initBrightcoveVideos = () => {
    if (document.querySelector('div.bcembed') || document.querySelector('div.ytembed') || document.querySelector('div.ytvideo')) {
      // will discuss with team
      // import(`../../../lib/core-video.min`).then((s) => {
      //   renderVideo();
      // })
    }
  };

  useEffect(() => {
    if (isFilterClear) {
      resetResults();
      getSearchResults();
    }
  }, [isFilterClear]);

  // Get more seach results on scroll
  const handleScroll = (event) => {
    const ele = event.target;
    if (
      searchResults.length > 0 &&
      requestStatus === 'loaded' &&
      ele.scrollHeight - ele.scrollTop <= ele.clientHeight * 2
    ) {
      updateResultsCount(resultsCount + 10);
      getSearchResults();
    }
  };

  const closeClickHandle = (e) => {
    e.preventDefault();
    updateInputText();
  };

  const clearSearchHandleNavigation = (event) => {
    const { keyCode } = event.nativeEvent;

    // Tab
    if (keyCode === 9 && event.shiftKey === true) {
      event.preventDefault();
      focusToCloseButton();
      return false;
    }
    return true;
  };

  return (
    <div
      className={['u28w4', dropdownActive ? 'u28dropfadeIn dropdownopen' : ''].join(' ')}
      ref={u28w4Ref}
      onScroll={handleScroll}
    >
      <div className="u28w1a u28w5 clstrgt">
        <div className="u28w6">
          <div
            style={{ width: dropdownStyles.width, left: dropdownStyles.left }}
            ref={resultRef}
            className={[
              'u28w8 u28trgt',
              resultsCount > 0 || requestStatus === 'loaded' || requestStatus === 'loading' || searchResults.length > 0
                ? 'u28fadeIn'
                : '',
              resultsCount > 0 || requestStatus === 'loaded' ? 'u28found u28loaded' : '',
              requestStatus === 'loading' && resultsCount === 0 ? 'loading u28fadeIn' : '',
            ].join(' ')}
          >
            <div className="u28resultsclose" ><a  href="#closeresults" onKeyDown={clearSearchHandleNavigation} onClick={closeClickHandle} ref={u28CloseResult}  aria-label="Back">Close</a></div>
            <ul className="u28skel">
              {new Array(10).fill(10).map((_val, i) => (
                <li key={i} />
              ))}
            </ul>
            {searchResults.length > 0 && filterText && cityText && !isFilterClear && (
              <div className="ctryfilter filter0">
                <div className="ctryfilterw1">
                  <a className="filtertxt" href={filterText}>
                    {filterText}
                  </a>
                  <span className="ctytxt">{cityText}</span>
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter(true);
                    }}
                    className="clrctry"
                  />
                </div>
              </div>
            )}
            {searchResults.length === 0 && requestStatus === 'loaded' && (
              <div className="u28result u28noresults">
                <NoResults updateSearch={updateSearchStatus} />
              </div>
            )}

            {siteinks && (
              <div className="u28sitelinkw1" data-lbl={`sitelinks-${siteinks.title}`}>
                <div className="u28sitelinks u28result u28sitelinksp">
                  <h4>
                    <a href={siteinks.displayurl}>{siteinks.title}</a>
                  </h4>
                  <cite>
                    <a tabIndex="-1" href={siteinks.displayurl}>{siteinks.displayurl}</a>
                  </cite>
                  {siteinks.displayurl !== undefined && (
                    <p data-lbl={`sitelinks-${siteinks.title}`}>{siteinks.description}</p>
                  )}
                </div>
                {siteinks.links.map((link, i) => (
                  <div className="u28sitelinks u28result u28sitelinksc" key={i}>
                    <div className="u28rw1">
                      <div className="u28rw2">
                        <h4>
                          <a href={link.scurl} data-lbl={`sitelinks:${link.sctitle}`}>
                            {link.sctitle}
                          </a>
                        </h4>
                        <p data-lbl={`sitelinks:${link.sctitle}`}>{link.scdescr}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Results */}
            {recomendedresult ? <div dangerouslySetInnerHTML={{ __html: recomendedresult }} /> : null}

            {/* Display Regular Results */}
            {searchResults.map((result, i) => {
              const title = result.attributes.Title[0];
              const displayurl = result.attributes.DisplayURL[0];
              const description = result.attributes.Description ? result.attributes.Description[0] : false;
              if (title !== undefined && displayurl !== undefined) {
                let srctagfound = false;
                let videofound = false;
                let videosrc;
                let srctag;
                if (result.attributes.SourceTag != null) {
                  srctagfound = true;
                  srctag = result.attributes.SourceTag.toString().toLowerCase();
                  if (srctag === 'video') {
                    videofound = true;
                    // eslint-disable-next-line prefer-destructuring
                    videosrc = result.attributes.Id[0];
                  }
                }
                return (
                  <div
                    className={['u28result', videofound ? 'u28video' : ''].join(' ')}
                    data-lbl={`search-row:${i + 1}`}
                    key={i}
                  >
                    <div className="u28rw1">
                      <div className="u28rw2">
                        {videofound ? <div tabIndex="-1" className="bcembed bcthumbnail clickvideo" data-bcid={videosrc} /> : null}
                        <div className="u28rw3">
                          <h4>
                            <a href={displayurl}>{title}</a>
                          </h4>
                          {!srctagfound ? (
                            <cite>
                              <a tabIndex="-1" href={displayurl}>{displayurl}</a>
                            </cite>
                          ) : videofound ? (
                            <cite>
                              <a tabIndex="-1" href={displayurl}>{displayurl}</a>
                            </cite>
                          ) : (
                                <cite>
                                  <div className="u28type">
                                    <span>{result.attributes.SourceTag}</span>
                                    <a tabIndex="-1" href={displayurl}>{displayurl}</a>
                                  </div>
                                </cite>
                              )}
                          {description ? <p>{description}</p> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchResult;
