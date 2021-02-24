/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* Name                 : U28V1 - OCOM Header with ASK Oracle
 * Type                 : Split Component
 * Child Components     : AutoSuggestions, RotatingSuggests, SearchResults
 * External Libraries   : DebounceInput(https://www.npmjs.com/package/react-debounce-input)
 * Generic Components   : NA
 * Generic Libraries    : PageContext, ClientRequestFactory, utils, globalConstants
 * Descriptions         : Creates OCOM header with navigation, profile links and ask oracle search integrated.
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/* Imports */
import React, { useEffect, useState, useRef, useContext } from 'react';
import { DebounceInput } from 'react-debounce-input';
//@Todo
import ClientRequestFactory from '../../service/ClientRequestFactory';

//@Todo
import Profile from './Profile';
import AutoSuggestions from '../AutoSuggestions';
import SearchResults from '../SearchResults';

const defaults = { menuContent: '', footerContent: '', oceIntegrator: '', isPreview: false, previewToken: null, locale: null, viewport: { width: 0, height: 0, isMobile: false, isTablet: false } };
export const PageContext = React.createContext({ ...defaults });


export const slideToggle = (target, duration = 500, slideUpDuration) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  }
  return slideUp(target, slideUpDuration || duration);
};


export const DATA_LABEL_SUFFIX = '-pn';
export const U28_DEBOUNCE_NUM = 600;
export const UNIVERSAL_MENU_LINK = 'https://www.oracle.com/universal-menu/';

const U28V1 = ({ pageReloaded }) => {
  /* Declarations */
  const defaultSearchData = { value: null, status: false };
  let lastScrollPos = 0;
  /* States */
  const [u28rtl, setU28rtl] = useState(false);
  const [searchFilters] = useState({
    city: null,
    lang: null,
    filterText: null,
    cityText: null,
  });
  const [megaMenu, setMegaMenu] = useState(false);
  const [rotatingSuggestions, setRotatingSuggestions] = useState([]);
  const [isProfActive, setProfileState] = useState(false);
  const [searchValue, updateSearchValue] = useState('');
  const [searchValueTemp, updateTempSearchValue] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState({ left: '0px', width: '0px' });
  const [isDropdownActive, setActiveDropdownState] = useState(false);
  const [resetSearchStatus, resetSearchResults] = useState(false);
  const [resetAutoSuggests, setAutoSuggests] = useState(false);
  const [searchData, updateSearchData] = useState({ ...defaultSearchData });
  const [scrollPast, setscrollPast] = useState('');
  const [isU28ShortNav, setU28ShortNav] = useState(false);
  const [showMegaMenu, toggleMenu] = useState(false);
  const [headerPosition, setheaderPosition] = useState('u28-top');
  const [activeSearch, setActiveSearch] = useState(false);
  const [isNavMobile, setMobileNavBreakpoint] = useState(false);
  const isInitialMount = useRef(false);
  const [u28Styles, setU28Styles] = useState({
    u28s2: { width: 'inherit', transform: 'inherit' },
    u28suggestw1: {},
    u28s2Class: '',
    u28suggest: '',
  });
  const [u28navactive, setU28navactive] = useState(false);

  /* Hooks */
  const isMounted = useRef(false);
  const u28Ref = useRef();
  const u28navRef = useRef();
  const u28RefProductLink = useRef();
  const pageContext = useContext(PageContext);
  //@Todo
  // const externalLabels = useContext(ExternalLabelContext);
  const externalLabels = {};


  useEffect(() => {
    isMounted.current = true;
    polyfills.load();
    getMegaMenuContent();
    const rtl = !!u28Ref.current.closest('.rtl');
    setU28rtl(rtl);
    window.addEventListener('scroll', handleScroll);

    // Fixes iPad Pro issue
    window.addEventListener('orientationchange', () => {
      if (u28Ref.current) {
        const u28nav = u28Ref.current.querySelector('#u28nav');
        if (u28nav.classList.contains('u28fadeIn')) {
          u28nav.classList.add('u29temphide');
          setTimeout(() => { u28nav.classList.remove('u29temphide'); }, 10);
        }
      }
    }, false);

    return () => {
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSearch]);

  useEffect(() => {
    if (activeSearch) {
      setActiveDropdownState(false);
    }
    if (!activeSearch && isInitialMount.current) {
    setTimeout(()=>{
      u28RefProductLink.current.focus();
    },300)
    } else {
      isInitialMount.current = true;
    }
  }, [activeSearch]);

  useEffect(() => {
    resetHeader();
  }, [pageReloaded]);

  useEffect(() => {
    if (megaMenu && document) {
      updateLinks(document.querySelector('.u28l-out'));
    }
  }, [megaMenu]);

  /* Functions */

  // Test if the site is mobile based on hamburger menu styles
  function u28mobileCheck() {
    // var windowwidth = $(window).width();
    const ele = document.querySelector('.u28ham');
    const state = getComputedStyle(ele);
    if (state.display === 'flex') {
      setMobileNavBreakpoint(true);
    }
    if (state.display === 'none') {
      setMobileNavBreakpoint(false);
    }
  }

  // Handle header on page scroll
  const handleScroll = () => {
    if (u28Ref.current) {
      const scrollPos = document.body.scrollTop || document.documentElement.scrollTop;
      const topClass = 'u28-top';
      const upClass = 'u28-up';
      const downClass = 'u28-down';
      const u28Past = 'u28-past';
      if (scrollPos < 0) {
        setheaderPosition(topClass);
        setscrollPast('');
        return;
      }

      const headerHeight = u28Ref.current.getBoundingClientRect().height;
      if (scrollPos <= 1) {
        setheaderPosition(topClass);
        setscrollPast('');
      }

      if (Math.abs(lastScrollPos - scrollPos) <= headerHeight) {
        return;
      }

      // Scroll Down - hide nav
      if (scrollPos > lastScrollPos && scrollPos > headerHeight) {
        setheaderPosition(upClass);
        setTimeout(() => {
          if (isMounted.current) {
            setscrollPast(u28Past);
          }
        }, 400);
      } else if (Math.abs(scrollPos) + window.innerHeight < document.body.scrollHeight) {
        // Scroll Up - show nav
        setheaderPosition(downClass);
      }
      lastScrollPos = scrollPos;
    }
  };

  const handleResize = () => {
    // const windowWidth = document.body.getBoundingClientRect().width || 0;
    const u28Ele = u28Ref.current;
    if (!u28Ele.querySelector('.u28navw2[data-type].active')) {
      closeHeader();
    }
    u28mobileCheck();
    u28v1equalHeight();
    adjustDropdown();
    setTimeout(() => {
      positionSearchBar();
    }, 200);
  };

  // Adjust menu according to search box width
  const adjustDropdown = () => {
    const u28Ele = u28Ref.current;
    if (u28Ele) {
      const u28w1Height = u28Ele.querySelector('.u28w1').clientHeight;
      const inputWrapOffset = u28Ele.querySelector('.u28w2').getBoundingClientRect();
      const u28s2Offset = u28Ele.querySelector('.u28s2').getBoundingClientRect();

      let { left } = inputWrapOffset;
      // For f11 template
      if (window.innerWidth <= 974 && document.body.classList.contains('f11')) {
        left = u28s2Offset.left;
      }
      const styles = { left: `${left}px`, width: `${u28s2Offset.width}px` };
      setDropdownStyles({ ...styles });

      const heightArray = [];
      u28Ele.querySelectorAll('.u28navw2').forEach((ele) => {
        heightArray.push(ele.clientHeight);
      });
      const maxHeight = Math.max(...heightArray);
      if (u28w1Height + maxHeight + 61 >= window.innerHeight) {
        setU28ShortNav(true);
      } else {
        setU28ShortNav(false);
      }
    }
  };

  // Generate Header
  const buildMengaMenu = (resp) => {
    // set menu conent in state
    const content = formatMenuContent(resp);
    // Update search suggestion values to state
    setRotatingSuggestions([...content.suggestions]);
    // Update menu content to state
    setMegaMenu(content.menu);
    adjustDropdown();
    // updateLinks(document.querySelector('.u28l-out'));
  };

  // Get universal menu content from API
  const getMegaMenuContent = () => {
    if (pageContext.globalMenu && !megaMenu) {
      buildMengaMenu(pageContext.globalMenu);
    } else {
      // ClientRequestFactory.getRequestHandler().get(UNIVERSAL_MENU_LINK, 'plain').then((resp) => {
      //   if (resp && isMounted.current) {
      //     // Update menu content to Context API to make use in Footer component
      //     pageContext.updateGlobalMenu(resp);
      //     buildMengaMenu(resp);
      //   }
      // });

      ClientRequestFactory.get(UNIVERSAL_MENU_LINK, 'plain').then((resp) => {
        if (resp && isMounted.current) {
          // Update menu content to Context API to make use in Footer component
          pageContext.updateGlobalMenu(resp);
          buildMengaMenu(resp);
        }
      });
    }
  };

  const updateLinks = (targetEle) => {
    if (targetEle) {
      const turl = encodeURI(window.location.href.replace(/^http:/gi, 'https:')).replace(
        /^https:\/\/www-content/gi,
        'http://www-content',
      );
      targetEle.querySelectorAll('a[href$="nexturl="]').forEach((ele) => {
        const href = ele.getAttribute('href').replace(/nexturl=/gi, `nexturl=${turl}`);
        ele.setAttribute('href', href);
      });
      // if page is in a frame target top
      if (window.frameElement) {
        u28Ref.querySelectorAll('a').forEach((ele) => {
          ele.setAttribute('target', '_top');
        });
      }
    }
  };

  // Read only Menu content and sugggestions from response, also do necessary cleanup and changes
  const formatMenuContent = (content) => {
    const tmpWrapEle = document.createElement('div');
    tmpWrapEle.innerHTML = content;
    // Read menu content
    const menu = tmpWrapEle.querySelector('.u28nav-r2');

    if (menu) {
      menu.querySelectorAll('.u28navw2 h3 > a').forEach((ele) => {
        ele.parentNode.classList.add('u28linked');
      });

      // Add a first and last class to elements
      menu.querySelectorAll('.u28navw2').forEach((ele) => {
        const nodes = ele.querySelectorAll('a');
        const firstMenuItem = nodes[0];
        firstMenuItem.classList.add('first');
        const lastMenuItem = nodes[nodes.length - 1];
        lastMenuItem.classList.add('last');
      });

      // clone link for mobile view
      if (u28Ref.current) {
        u28Ref.current.querySelectorAll('.u28s4 a[data-target]').forEach((ele) => {
          const { target } = ele.dataset;
          const clone = ele.cloneNode(true);
          clone.classList.add('u28mctrl');
          const targetNode = menu.querySelector(`.u28navw2[data-type="${target}"]`);
          if (targetNode) {
            targetNode.parentNode.insertBefore(clone, targetNode);
          }
        });
      }

      // Read Suggestion values from HTML content
      const suggests = [];
      tmpWrapEle.querySelectorAll('.u28w7 li').forEach((ele) => {
        suggests.push(`Ask "${ele.innerText}"`);
      });
      if (menu.querySelector('.u28w7')) {
        menu.querySelector('.u28w7').remove();
      }
      // menu.querySelectorAll('[data-u28bgsrc]').forEach((ele) => {
      //   ele.style.backgroundImage = `url("https://www.oracle.com${ele.getAttribute('data-u28bgsrc')}"`;
      // });

      return { menu: menu.innerHTML, suggestions: [...suggests] };
    }
    return { menu: false, suggestions: [] };
  };

  // Hide/Show Profile Popup
  const updateProfileState = (state) => {
    // Hide mega menu if profile is active
    if (isProfActive || state) {
      closeHeader();
      closeSearch();
    }
    setProfileState(state);
  };

  // Hide/Show menu sub links in mobile version
  const handleMenuLinks = (event) => {
    if (event.target.classList.contains('u28mctrl') && event.target.dataset && event.target.dataset.target) {
      event.preventDefault();
      const { target } = event;
      const dataTarget = target.dataset.target;
      const activeEle = u28Ref.current.querySelector('.u28navw2[data-type].active');
      const targetEle = u28Ref.current.querySelector(`.u28navw2[data-type="${dataTarget}"]`);
      if (!target.classList.contains('active')) {
        activateNavLink(dataTarget);
        if (activeEle) {
          slideToggle(activeEle, 200);
          setTimeout(() => {
            activeEle.style.removeProperty('display');
            activeEle.classList.remove('active');
          }, 200);
        }
        if (targetEle) {
          slideToggle(targetEle, 50);
          setTimeout(() => {
            targetEle.classList.add('active');
            targetEle.style.removeProperty('display');
          }, 50);
        }
      } else {
        removeHeaderActiveLinks();
        if (activeEle) {
          activeEle.classList.remove('active');
          setTimeout(() => {
            slideToggle(activeEle, 200);
            activeEle.style.removeProperty('display');
          }, 200);
        }
      }
    }
  };

  // Reset header to default/inital state
  const resetHeader = () => {
    setProfileState(false);
    closeHeader(false);
    closeSearch();
  };

  /* Handle Auto Suggests
   * If search value length is greater than 2 update state
   * -> which causes suto suggetions starts loading
   */
  const handleAutoSuggestions = () => {
    if (searchValue.length > 2 && searchData.status !== 'init' && searchData.status !== 'loading') {
      resetSearchResults((state) => !state);
      adjustDropdown();
      updateTempSearchValue(searchValue);
    }
  };

  // Hadnle serach value update from child components
  const handleSearch = (event) => {
    event.preventDefault();
    const value = event.nativeEvent.target.innerText;
    updateSearchValue(value);
    initSearch(value);
  };

  // Handler Dropdown active state
  const handleDropdownActiveSatate = (status) => {
    setActiveDropdownState(status);
  };

  const headerA11y = (event) => {
    u28mobileCheck();
    setTimeout(() => {
      const activeTopMenuItem = u28Ref.current.querySelector('.u28navitm.active');
      const hamburgerIcon = u28Ref.current.querySelector('.u28ham');
      const searchIcon = u28Ref.current.querySelector('.u28search');
      const mobileTopMenuItem = u28Ref.current.querySelectorAll('.u28navitm.u28mctrl:not(.active)');
      const lastClosedMobileMenuItem = mobileTopMenuItem[mobileTopMenuItem.length - 1];
      const firstMobileTopMenuItem = mobileTopMenuItem[0];

      // Desktop:
      if (!isNavMobile) {
        // If user tabs back on the first menu item, focus back to main parent menu

        if ((event && event.key === 'Escape') || (event && event.shiftKey && event.keyCode === 9 && event.target.classList.contains('first'))) {
          setTimeout(() => {
            closeHeader(true);
            if (!isNavMobile) {
              activeTopMenuItem.focus();
            } else {
              hamburgerIcon.focus();
            }
          }, 10);
          return false;
        }
        // If user tabs forward on last menu item, focus forward to next parent menu
        if (event && event.keyCode === 9 && event.target.classList.contains('last') && !event.shiftKey) {
          setTimeout(() => {
            closeHeader(true);

            if (activeTopMenuItem && activeTopMenuItem.nextSibling !== null) {
              const nextSiblingCSSDisplay = getComputedStyle(activeTopMenuItem.nextSibling);
              // If the next sibling is hidden, focus again on the parent manu.
              if (nextSiblingCSSDisplay !== 'block' && activeTopMenuItem.nextSibling.nextSibling !== null) {
                activeTopMenuItem.nextSibling.nextSibling.focus();
              }
              activeTopMenuItem.nextSibling.focus();
            } else {
              u28Ref.current.querySelector('.u28prof').focus();
            }
          }, 50);
        }
        // Mobile:
      } else if (((event && event.key === 'Escape') || (event && event.shiftKey && event.keyCode === 9)) && event.target === firstMobileTopMenuItem) {
        setTimeout(() => {
          hamburgerIcon.focus();
        }, 10);
      } else if ((event && event.keyCode === 9) && (event.target.classList.contains('last') || event.target === lastClosedMobileMenuItem)) {
        setTimeout(() => {
          toggleMobileMenu(event);
          searchIcon.focus();
        }, 50);
      }
      return false;
    }, 10);
  };

  // a11y focus on active menu item
  const focusOnOpenMenu = () => {
    u28mobileCheck();

    setTimeout(() => {
      const allInnerNavLinks = u28Ref.current.querySelectorAll('.u28navw2.active a');
      const allTopMenuItems = u28Ref.current.querySelectorAll('#u28nav .u28navitm');
      const firstMenuItem = allTopMenuItems[0];
      const firstInnerMenuItem = allInnerNavLinks[0];

      if (!isNavMobile) {
        setTimeout(() => {
          firstInnerMenuItem.focus();
        }, 50);
      } else {
        setTimeout(() => {
          firstMenuItem.focus();
        }, 50);
      }
    }, 50);

    return false;
  };

  // Handler autocomplete navigations for keyboard events
  const handleNavigation = (event) => {
    const autoCompleteWrp = u28Ref.current.querySelector('.u28suggest');
    const ariaSelectedEle = autoCompleteWrp
      ? autoCompleteWrp.querySelector('.u28suggest li[aria-selected="true"]')
      : false;
    const { keyCode } = event.nativeEvent;

    // For Escape
    if (event.key === 'Escape') {
      closeSearch();
      return false;
    }
    // For Enter
    if (keyCode === 13) {
      event.preventDefault();
      if (
        ariaSelectedEle
        && ariaSelectedEle.querySelector('a')
        && ariaSelectedEle.querySelector('a').classList.contains('u28suggestlnk')
      ) {
        // router.push('/[...slug]', ariaSelectedEle.querySelector('a').getAttribute('href'));
        window.location.href = ariaSelectedEle.querySelector('a').getAttribute('href');
      } else {
        event.target.blur();
        initSearch(searchValue);
      }
      return false;
    }

    if (
      !u28Ref.current.querySelector('.u28suggest') &&
      !u28Ref.current.querySelector('.u28suggest').children.length <= 1
    ) {
      return false;
    }

    // Tab
    if (keyCode === 9 && event.shiftKey === false) {
      event.preventDefault();
      const inputEle = u28Ref.current.querySelector('#askoracleinput');
      const clearSearch = u28Ref.current.querySelector('.u28clsSearch');
      if (inputEle.value) {
        setTimeout(() => {
          if (document.activeElement === clearSearch) {
            closeSearch();
          }
          clearSearch.blur();
          clearSearch.focus();
        }, 0);
      } else {
        closeSearch();
      }

      return false;
    }

    // Shift Tab
    if (keyCode === 9 && event.shiftKey === true) {
      event.preventDefault();
      const inputEle = u28Ref.current.querySelector('.u28-back');
      inputEle.focus();
      return false;
    }

    // If no search keywork allow default events;
    if (!searchValue || !ariaSelectedEle) {
      return true;
    }

    // Down Arrow
    if (keyCode === 40) {
      event.preventDefault();
      ariaSelectedEle.setAttribute('aria-selected', 'false');
      const next = ariaSelectedEle.nextSibling ? ariaSelectedEle.nextSibling : autoCompleteWrp.firstElementChild;
      if (next) {
        next.setAttribute('aria-selected', 'true');
        const clone = next.querySelector('a').cloneNode(true);
        if (clone.querySelector('cite')) {
          clone.querySelector('cite').remove();
        }
        const val = clone.innerText;
        updateSearchValue(val);
      }
      return false;
    }

    if (keyCode === 38 || (event.shiftKey && keyCode === 9)) {
      event.preventDefault();
      ariaSelectedEle.setAttribute('aria-selected', 'false');
      const prev = ariaSelectedEle.previousElementSibling
        ? ariaSelectedEle.previousElementSibling
        : autoCompleteWrp.lastElementChild;
      if (prev) {
        prev.setAttribute('aria-selected', 'true');
        const clone = prev.querySelector('a').cloneNode(true);
        if (clone.querySelector('cite')) {
          clone.querySelector('cite').remove();
        }
        const val = clone.innerText;
        updateSearchValue(val);
      }
      return false;
    }
    return true;
  };
  const clearSearchHandleNavigation = (event) => {
    const { keyCode } = event.nativeEvent;

    // Tab
    if (keyCode === 9 && event.shiftKey === false) {
      event.preventDefault();
      const inputEle = u28Ref.current.querySelector('#askoracleinput');
      const clearSearch = u28Ref.current.querySelector('.u28clsSearch');
      if (inputEle.value) {
        setTimeout(() => {
          if (document.activeElement === clearSearch) {
            closeSearch();
          }
        }, 0);
      }

      return false;
    }
    return true;
  };

  // Updates search Status to state
  const updateSearchStatus = (data, value = false) => {
    if (value) {
      updateSearchValue(data.value);
    }
    updateSearchData({ ...searchData, ...data });
  };

  // Initializes the ask oracle search
  const initSearch = (value) => {
    adjustDropdown();
    updateSearchData({ value, status: 'init' });
    updateTempSearchValue('');
    handleDropdownActiveSatate(true);
  };

  // Update closest autoComplete value
  const updateClosestSearchValue = (value) => {
    updateSearchValue(value);
    // updateTempSearchValue(value);
    const searchValueTempLength = searchValueTemp.length;
    const inputEle = u28Ref.current.querySelector('#askoracleinput');
    inputEle.setSelectionRange(searchValueTempLength, value.length);
    inputEle.focus();
  };

  // Show Search Menu
  const openSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    closeHeader();
    positionSearchBar('killtransition', true);
    setSearchFocus(true);
    updateSearchValue('');
    updateTempSearchValue('');
  };

  useEffect(() => {
    if (activeSearch) {
      positionSearchBar();
    }
  }, [activeSearch]);

  const focusSearch = () => {
    u28Ref.current.querySelector('#askoracleinput').focus();
  };

  useEffect(() => {
    focusSearch();
  }, [searchFocus]);

  // Close Search
  const closeSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    clearSearchData();
    positionSearchBar('', false, false);
    setSearchFocus(false);
  };

  // Clear Search Data
  const clearSearchData = (e) => {
    if (e) {
      e.preventDefault();
    }
    updateSearchData({ ...defaultSearchData });
    updateSearchValue('');
    updateTempSearchValue('');
    setActiveDropdownState(false);
    focusSearch();
    resetSearchResults();
    setAutoSuggests(true);
  };

  // Get Element width with margina, padding with content width
  const getOuterWidth = (ele) => {
    const { width } = ele.getBoundingClientRect();
    const cs = window.getComputedStyle ? getComputedStyle(ele) : ele.currentStyle;
    const margins = parseFloat(cs.getPropertyValue('margin-left')) + parseFloat(cs.getPropertyValue('margin-right'));
    return width + (margins || 0);
  };

  // Handler search bar size
  const positionSearchBar = (u28s2Class = '', searchState, newSearchState) => {
    let isSearchBoxShowing = activeSearch;
    if (typeof newSearchState === 'boolean') {
      isSearchBoxShowing = newSearchState;
    }
    const lSpace = 20;
    const u28Ele = u28Ref.current;
    const parentWidth = u28Ele.offsetWidth;
    const u28s1 = document.getElementById('u28s1');
    const u28s3 = document.getElementById('u28s3');
    const u28s4 = document.querySelector('.u28s4');
    const navWrapperoffset = u28Ele.querySelector('.u28w1 .cwidth').offsetLeft;
    let u28searchwidth = 0;
    let navwidth = 0;
    let offset = 0;
    let offset2 = 0;
    const windowWidth = document.body.getBoundingClientRect().width || 0;
    let firstNavItemOffsetLeft = document.querySelector('.u28navitm:first-child').offsetLeft;
    let firstItemOffsetLeft = u28s1.offsetLeft;
    let firstItemwidth = u28s1.offsetWidth;
    const mobileBtnsWidth = firstItemwidth;
    if (u28rtl) {
      firstNavItemOffsetLeft = document.querySelector('.u28navitm:last-child').offsetLeft - 10;
      firstItemOffsetLeft = u28s3.offsetLeft;
      firstItemwidth = u28s3.offsetWidth;
    }
    if (isNavMobile) {
      // Position Mobile
      offset2 = `${navWrapperoffset + firstItemwidth}px`;
      u28searchwidth = u28Ele.querySelector('.u28search').offsetWidth;
      offset = `${firstItemOffsetLeft + firstItemwidth}px`;
      navwidth = u28Ele.querySelector('.u28s4').offsetWidth;
      if (u28rtl) {
        firstNavItemOffsetLeft = -(firstItemOffsetLeft + mobileBtnsWidth);
      }
    } else {
      // Position Desktop
      if (u28Ele) {
        u28Ele.querySelectorAll('.u28s4 a').forEach((ele) => {
          u28searchwidth += getOuterWidth(ele) || 0;
        });
      }
      offset = `${firstItemOffsetLeft + firstItemwidth + lSpace}px`;
      offset2 = `${navWrapperoffset + firstItemwidth + lSpace}px`;
      if (u28rtl) {
        offset2 = `${navWrapperoffset + firstItemwidth + 5}px`;
      }
      navwidth = u28s4.offsetWidth - lSpace;
    }
    if (!isSearchBoxShowing) {
      // Position inactive
      const u28s2 = {
        width: `${u28searchwidth}px`,
        transform: `translate(${firstNavItemOffsetLeft}px, 0px)`,
      };
      setU28Styles({ ...u28Styles, u28s2: { ...u28s2 }, u28s2Class });
      if (typeof searchState === 'boolean') {
        setActiveSearch(searchState);
      }
    } else {
      // Position active
      if (u28rtl) {
        if (isNavMobile) {
          offset = parseFloat(offset);
          offset = offset - lSpace + mobileBtnsWidth + u28searchwidth;
          offset = `${-offset}px`;
        } else {
          offset = `${parseFloat(offset, 10) - lSpace}px`;
        }
      }
      const u28s2 = {
        width: `${navwidth}px`,
        transform: `translate(${offset}, 0px)`,
      };
      const u28suggestw1 = {
        transform: `translate(-${offset2}, 0px)`,
      };
      const u28suggest = document.body.classList.contains('f11') ? parentWidth : 'auto';
      setU28Styles({ ...u28Styles, u28s2, u28suggestw1, u28s2Class, u28suggest });
      if (typeof searchState === 'boolean') {
        setActiveSearch(searchState);
      }
    }
  };

  // V1 Equal Height
  const u28v1equalHeight = () => {
    const u28Ele = u28Ref.current;
    const u28v1dropdown = u28Ele.querySelector('.navw2');
    const windowWidth = document.body.getBoundingClientRect().width || 0;
    if (!isNavMobile) {
      if (u28v1dropdown) {
        u28v1dropdown.classList.remove('u28abs');
      }
      const heightArray = [];
      u28Ele.querySelectorAll('.u28navw1 .u28navw2').forEach((ele) => {
        heightArray.push(ele.offsetHeight);
      });
      const maxHeight = Math.max(...heightArray);
      u28Ele.querySelector('.u28nav').style.height = `${maxHeight}px`;
      if (u28v1dropdown) {
        u28v1dropdown.classList.add('u28abs');
      }
    } else if (u28v1dropdown) {
      u28v1dropdown.classList.add('u28abs');
    }
  };

  // Show Header
  const openHeader = () => {
    closeSearch();
    setU28navactive(true);
    toggleMenu(true);
    setheaderPosition('u28-down');
    u28v1equalHeight();
    u28Ref.current.querySelectorAll('[data-u28bgsrc]:not([style])').forEach((ele) => {
      const regex = RegExp(/^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:\/\/www\.)?([^:/?\n]+)/);
      let imgUrl = ele.getAttribute('data-u28bgsrc');
      if (!regex.test(imgUrl)) {
        imgUrl = `//www.oracle.com${imgUrl}`;
      }
      // eslint-disable-next-line no-param-reassign
      ele.style.backgroundImage = `url("${imgUrl}"`;
    });
  };

  // Links on Header panel
  const handleMenu = (e) => {
    e.preventDefault();
    const u28Ele = u28Ref.current;
    const ele = e.target;
    headerA11y();
    if (!u28navactive) {
      openHeader();
      focusOnOpenMenu();
    }
    if (ele.dataset && ele.dataset.target) {
      const u28btntrgt = ele.dataset.target;

      if (!ele.classList.contains('active')) {
        u28Ele.querySelector('.u28nav').scrollTop = 0;
        // Nav Links
        activateNavLink(u28btntrgt);
        // Nav Content
        if (u28Ele.querySelector('.u28navw2[data-type].active')) {
          u28Ele.querySelector('.u28navw2[data-type].active').classList.remove('active');
        }
        if (u28Ele.querySelector(`.u28navw2[data-type="${u28btntrgt}"]`)) {
          u28Ele.querySelector(`.u28navw2[data-type="${u28btntrgt}"]`).classList.add('active');
        }
      } else {
        if (u28Ele.querySelector('.u28navw2[data-type].active')) {
          u28Ele.querySelector('.u28navw2[data-type].active').classList.remove('active');
        }
        // Close Nav
        if (u28navactive) {
          removeHeaderActiveLinks();
        } else {
          setTimeout(removeHeaderActiveLinks, 401);
        }
        closeHeader();
      }
    }
    adjustDropdown();
  };

  const activateNavLink = (u28btntrgt) => {
    const u28Ele = u28Ref.current;
    if (u28Ele.querySelector('.u28s4 a[data-target].active')) {
      u28Ele.querySelector('.u28s4 a[data-target].active').classList.remove('active');
    }
    if (u28Ele.querySelector('.u28navw1 a[data-target].active')) {
      u28Ele.querySelector('.u28navw1 a[data-target].active').classList.remove('active');
    }
    if (u28Ele.querySelector(`.u28s4 a[data-target="${u28btntrgt}"]`)) {
      u28Ele.querySelector(`.u28s4 a[data-target="${u28btntrgt}"]`).classList.add('active');
    }
    if (u28Ele.querySelector(`.u28navw1 a[data-target="${u28btntrgt}"]`)) {
      u28Ele.querySelector(`.u28navw1 a[data-target="${u28btntrgt}"]`).classList.add('active');
    }
  };

  // Hide Header
  const closeHeader = () => {
    removeHeaderActiveLinks();
    setU28navactive(false);
    toggleMenu(false);
    setheaderPosition('u28-down');
  };

  const removeHeaderActiveLinks = () => {
    const u28Ele = u28Ref.current;
    if (u28Ele.querySelector('.u28s4 a[data-target].active')) {
      u28Ele.querySelector('.u28s4 a[data-target].active').classList.remove('active');
    }
    if (u28Ele.querySelector('.u28navw1 a[data-target].active')) {
      u28Ele.querySelector('.u28navw1 a[data-target].active').classList.remove('active');
    }
  };

  // Hide/Show header on mobile devices
  const toggleMobileMenu = (e) => {
    e.preventDefault();
    if (!u28navactive) {
      openHeader();
      focusOnOpenMenu();
    } else {
      closeHeader();
    }
  };

  const updateInputText = () => {
    const inputEle = u28Ref.current.querySelector('#askoracleinput');
    updateSearchValue('');
    clearSearchData();
    setTimeout(() => {
      inputEle.focus();
    }, 0);
  };

  const focusToCloseButton = () => {
    const clearSearch = u28Ref.current.querySelector('.u28clsSearch');
    setTimeout(() => {
      clearSearch.focus();
    }, 0);
  };


  return (
    <section
      id="u28"
      data-trackas={`header${DATA_LABEL_SUFFIX}`}
      ref={u28Ref}
      onKeyDown={headerA11y}
      className={[
        'u28 u28v1 u28adj',
        headerPosition,
        scrollPast,
        megaMenu ? 'dropdownloaded' : '',
        showMegaMenu ? 'u28navactive' : '',
        isProfActive ? 'profactive' : '',
        searchFocus ? 'u28focus' : '',
        isDropdownActive ? 'dropdownactive' : '',
        !isDropdownActive && (showMegaMenu || searchFocus) ? 'u28cover' : '',
        u28navactive ? 'u28navactive u28cover u28-open' : '',
      ].join(' ')}
    >
      <span className="u28bttop">&nbsp;</span>
      <span
        className="u28cover"
        onClick={(e) => {
          closeHeader(e);
          closeSearch(e);
        }}
      >
        &nbsp;
      </span>
      <div className="u28w1">
        <div className="cwidth">
          <div className="u28s1" id="u28s1">
            <a href="/" className="u28home rw-logo">
              Home
            </a>
            <a
              className="u28ham u28clickable u28animatedham"
              href={UNIVERSAL_MENU_LINK}
              onClick={toggleMobileMenu}
              data-trackas={`menu${DATA_LABEL_SUFFIX}`}
              data-lbl="menu"
              aria-controls="u28navw1"
              aria-expanded={!!showMegaMenu}
              aria-haspopup="true"
              role="button"
            >
              Menu
            <i /><i /><i />
            </a>
          </div>
          <div
            className={['u28s2', activeSearch ? 'active' : '', u28Styles.u28s2Class || ''].join(' ')}
            style={{ ...u28Styles.u28s2 }}
          >
            <div className="u28w2">
              <div className={['u28w3', searchValue ? 'u28typing' : ''].join(' ')}>
                <div className="u28logo rw-logo">
                  <span>Oracle</span>
                </div>
                <a className="u28-back rw-cv-left " href="#back" onClick={closeSearch} title="Close Search Field">
                  <span>{externalLabels.prodnav_back || 'Back'}</span>
                </a>
                <a
                  className="u28-searchicon o-hf"
                  tabIndex="-1"
                  href="#search"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchFocus(true);
                  }}
                >
                  <span>{externalLabels.hub_search || 'Search'}</span>
                </a>
                <span className="u28input">
                  <DebounceInput
                    id="askoracleinput"
                    name="Ntt"
                    minLength={0}
                    debounceTimeout={U28_DEBOUNCE_NUM}
                    value={searchValue}
                    forceNotifyByEnter={false}
                    onKeyDown={handleNavigation}
                    onKeyUp={(e) => updateSearchValue(e.nativeEvent.target.value)}
                    onChange={handleAutoSuggestions}
                    data-prefix="Ask"
                    autoComplete="off"
                    aria-label="Search Oracle.com"
                  />
                  <span className="u28-microphone rw-microphone">
                    <span>Search by voice</span>
                  </span>
                  <a href="#" onClick={clearSearchData} className="u28clsSearch" onKeyDown={clearSearchHandleNavigation} />
                </span>
              </div>
              {/*@Todo*/}
              <AutoSuggestions
                searchValueTemp={searchValueTemp}
                dropdownStyles={dropdownStyles}
                handleSearch={handleSearch}
                handleDropdownActiveSatate={handleDropdownActiveSatate}
                updateClosestSearchValue={updateClosestSearchValue}
                wrapperStyle={u28Styles.u28suggestw1}
                fallbackWidth={u28Styles.u28suggest}
                resetAutoSuggests={resetAutoSuggests}
                activeSearch={activeSearch}
              />
            </div>
          </div>
          <nav className={['u28s4 u28clickable', activeSearch ? 'hidden' : ''].join(' ')}>
            <a className="u28search u28navitm" id="u28search" href="#" aria-label="Open Search Field" data-lbl="o-search-menu" onClick={openSearch}>
              <span>{externalLabels.hub_search || 'Search'}</span>
            </a>
            <a href="#" ref={u28RefProductLink} data-lbl="o-products-menu" data-target="products" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_products || 'Products'}
            </a>
            <a href="#" data-lbl="o-industries-menu" data-target="industries" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_industries || 'Industries'}
            </a>
            <a href="#" data-lbl="o-resources-menu" data-target="resources" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_resources || 'Resources'}
            </a>
            <a href="#" data-lbl="o-support-menu" data-target="support" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_support || 'Support'}
            </a>
            <a href="#" data-lbl="o-events-menu" data-target="events" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_events || 'Events'}
            </a>
            <a href="#" data-lbl="o-developer-menu" data-target="developer" className="u28navitm" onClick={handleMenu}>
              {externalLabels.hub_developer || 'Developer'}
            </a>
          </nav>
          <div className="u28s3">
            {/*@Todo*/}
            <Profile updateProfileState={updateProfileState} isProfActive={isProfActive} />
          </div>
        </div>
      </div>
      {/*@Todo*/}
      <SearchResults
        dropdownStyles={dropdownStyles}
        dropdownActive={isDropdownActive}
        updateSearchStatus={updateSearchStatus}
        searchValue={searchData.value}
        resetSearchStatus={resetSearchStatus}
        searchFilters={searchFilters}
        updateInputText={updateInputText}
        focusToCloseButton={focusToCloseButton}
      />
      <nav
        id="u28nav"
        className={['u28nav bgload', showMegaMenu ? 'u28fadeIn' : '', isU28ShortNav ? 'u28shortnav' : ''].join(' ')}
        data-trackas={`menu${DATA_LABEL_SUFFIX}`}
        role="menu"
        tabIndex={!showMegaMenu ? '0' : '-1'}
      >
        <span className="mnavback u28back icn-close" onClick={closeHeader}>
          Close
        </span>
        <div
          className="u28navw1 cwidth u28nav-r2"
          dangerouslySetInnerHTML={{ __html: megaMenu }}
          onClick={handleMenuLinks}
          ref={u28navRef}
        >
          {/* Menu content Place holder  */}
        </div>
      </nav>
    </section>
  );
};
export default U28V1;

const polyfills = (() => {
  const init = () => {
    NodeListforEach();
    closestNode();
    removeElement();
  };

  // NodeList.forEach
  const NodeListforEach = () => {
    /* missing forEach on NodeList for IE11 */
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  };

  // element.closest()
  const closestNode = () => {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function (s) {
        let el = this;
        do {
          if (Element.prototype.matches.call(el, s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  };

  // elemet.remove()
  const removeElement = () => {
    // Node.remove() polyfil
    [Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach((item) => {
      if ('remove' in item) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this && this.parentNode) {
            this.parentNode.removeChild(this);
          }
        },
      });
    });
  };
  return {
    load: () => init(),
  };
})();
