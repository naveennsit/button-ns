/* eslint-disable max-len */
import ClientRequestFactory from '../service/ClientRequestFactory';

export const SEARCH_AUTOCOMPLETE_JSON_URL = 'https://www-stage.oracle.com/search/autosuggest.json/browse?Dy=1&contentPaths=%2Fcontent%2FWeb%2FShared%2FAuto-Suggest%20Panel&templateTypes=AutoSuggestPanel&Ntt=';
export const SEARCH_AUTOSUGGEST_JSON_URL = 'https://www-stage.oracle.com/search/askoraclesuggest/json?Ntx=all&Ntt=';
export const SEARCH_URL = 'https://www-stage.oracle.com/search/results-nodim';

export const msg = (...arg) =>{
  return arg.join('::')
}
function handleSearchAutoSuggestionSuccess(resp) {
  let autoSuggest = [];
  try {
    if (resp.contents[0].numResults > 0) {
      autoSuggest = [...resp.contents[0].records];
    }
  } catch (e) {
    console.warn(msg('HeaderComponent', 'error in search auto suggestions', e.stack));
  }
  return autoSuggest;
}

function handleSearchAutoCompleteSuccess(resp) {
  let autoCompleteDataTemp = [];
  try {
    if (resp.contents[0].autoSuggest[0].totalNumResults > 0) {
      autoCompleteDataTemp = resp.contents[0].autoSuggest[0].dimensionSearchGroups[0].dimensionSearchValues;
    }
  } catch (e) {
    console.warn(msg('HeaderComponent', 'error in search auto complete', e.stack));
  }
  return autoCompleteDataTemp;
}

function handleSearchResultsSuccess(data, details) {
  const {
    params,
  } = details;
  let results = [];
  let reccomendedresult;
  let siteLinks;
  if (data) {
    // Update Data Received status
    if (data.contents[0].mainContent[0].contents[0]['@type'] === 'ResultsList') {
      results = data.contents[0].mainContent[0].contents[0].records;
    }
    if (
      data.contents[0].mainContentTop[1].contents.length > 0 &&
      data.contents[0].mainContentTop[1].contents[0]['@type'] === 'TopHeaderContent'
    ) {
      reccomendedresult = data.contents[0].mainContentTop[1].contents[0].url;
    }
    if (results.length > 0) {
      // Read SiteLinks
      if (params.No === 0) {
        if (results[0].attributes.SiteLink) {
          siteLinks = {
            title: results[0].attributes.Title[0],
            description: results[0].attributes.Description[0],
            displayurl: results[0].attributes.DisplayURL[0],
            links: [],
          };
          results[0].attributes.SiteLink.forEach((val) => {
            const sitesplitString = val.split('~');
            let sitelinkcnt = 0;
            // data format: ["siteLinkTitles1=siteLinkTitles1", "siteLinkDescriptions2=siteLinkDescriptions2", "siteLinkDescriptions3=siteLinkDescriptions3", "siteLinkTitles3=siteLinkTitles3", "siteLinkTitles2=siteLinkTitles2", "siteLinkDescriptions1=siteLinkDescriptions1", "siteLinkDescriptions6=siteLinkDescriptions6", "siteLinkDescriptions4=siteLinkDescriptions4", "siteLinkDescriptions5=siteLinkDescriptions5", "siteLinkUrls4=siteLinkUrls4", "siteLinkUrls3=siteLinkUrls3", "siteLinkUrls2=siteLinkUrls2", "siteLinkUrls1=siteLinkUrls1", "siteLinkTitles5=siteLinkTitles5", "siteLinkTitles4=siteLinkTitles4", "siteLinkTitles6=siteLinkTitles6", "siteLinkUrls6=siteLinkUrls6", "siteLinkUrls5=siteLinkUrls5"];
            const titlearray = [0];
            const descrarray = [0];
            const urlarray = [0];
            for (let q = 0; q < sitesplitString.length; q += 1) {
              sitelinkcnt = parseInt(sitesplitString.length / 3, 10);
              const sitelinkdesc = sitesplitString[q].split('=')[0];
              const sitelinkdata = sitesplitString[q].substring(sitesplitString[q].indexOf('=') + 1);
              for (let t = 0; t <= sitelinkcnt; t += 1) {
                const siteLinkTitles = `siteLinkTitles${t}`;
                const siteLinkDescriptions = `siteLinkDescriptions${t}`;
                const siteLinkUrls = `siteLinkUrls${t}`;
                if (sitelinkdesc === siteLinkTitles) {
                  titlearray[t - 1] = sitelinkdata;
                }
                if (sitelinkdesc === siteLinkDescriptions) {
                  descrarray[t - 1] = sitelinkdata;
                }
                if (sitelinkdesc === siteLinkUrls) {
                  urlarray[t - 1] = sitelinkdata;
                }
              }
            }
            if (
              titlearray.length === sitelinkcnt &&
              descrarray.length === sitelinkcnt &&
              urlarray.length === sitelinkcnt
            ) {
              for (let y = 0; y < sitelinkcnt + 1; y += 1) {
                if (descrarray[y] && titlearray[y] && urlarray[y]) {
                  const tmp = {
                    scurl: urlarray[y],
                    scdescr: descrarray[y],
                    sctitle: titlearray[y],
                  };
                  siteLinks.links.push(tmp);
                }
              }
            }
          });
          results.shift();
        }
      }
    }
  }
  return {
    results,
    reccomendedresult,
    siteLinks,
  };
}

export const fetchSearchAutoSuggestions = (searchValueTemp) => {
  const url = SEARCH_AUTOSUGGEST_JSON_URL + searchValueTemp;
  return new Promise((resolve) => {
    ClientRequestFactory.get(url).then((resp) => {
      resolve(handleSearchAutoSuggestionSuccess(resp));
    });
  });
};

export const fetchSearchAutoComplete = (searchValueTemp) => {
  const url = `${SEARCH_AUTOCOMPLETE_JSON_URL + searchValueTemp}*`;
  return new Promise((resolve) => {
    ClientRequestFactory.get(url).then((resp) => {
      resolve(handleSearchAutoCompleteSuccess(resp));
    });
  });
};

export const fetchSearchResults = (details) => {
  const {
    params,
    city,
    lang,
    isFilterClear,
  } = details;
  const url = new URL(SEARCH_URL, window.location.origin);

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  // For country and language filters
  if (!isFilterClear && city && lang) {
    if (!(city === 'us' && lang === 'en')) {
      url.searchParams.append('cty', city);
      url.searchParams.append('lang', lang);
    }
  }

  return new Promise((resolve) => {
    ClientRequestFactory.get(url).then((resp) => {
      resolve(handleSearchResultsSuccess(resp, details));
    });
  });
};
