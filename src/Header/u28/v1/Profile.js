/* Name                 : Profile
 * Type                 : Single Component
 * Child Components     : NA
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : utils
 * Descriptions         : Handles user login/logout links
 */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

/* Imports */
import React, { useState, useEffect, useRef } from 'react';
// import { getUserInfo, ssoSignOut } from 'core/utils/userUtils';

// GET COOKIE DATA
const getCookieData = (label) => {
  const labelLen = label.length;
  const cLen = document.cookie.length;
  let i = 0;
  let cEnd;
  while (i < cLen) {
    let j = i + labelLen;
    if (document.cookie.substring(i, j) === label) {
      cEnd = document.cookie.indexOf(';', j);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      j += 1;
      const u = decodeURIComponent(document.cookie.substring(j, cEnd).replace(/\+/g, '%20'));
      return cleanCookieContent(u);
    }
    i += 1;
  }
  return '';
};

// Cleap cookie vlaue
const cleanCookieContent = (sContent) => {
  // eslint-disable-next-line eqeqeq
  let sMe = typeof sContent == 'undefined' ? 'NoData' : sContent;
  const badChar = '<>';
  if (sMe !== 'NoData') {
    const al = sMe.length;
    for (let i = 0; i < al; i += 1) {
      if (sMe.substr(i, 1) !== '.' && sMe.substr(i, 1) !== '?' && badChar.search(sMe.substr(i, 1)) > -1) {
        sMe = 'Invalid';
        i = al + 1;
      }
    }
  }
  return sMe;
};

// GET USERINFO
export const getUserInfo = () => {
  const USER = {};
  const valueEnc = getCookieData('ORA_UCM_INFO');
  const array = valueEnc.split('~');
  [USER.version, USER.guid, USER.firstname, USER.lastname, USER.username] = array;
  return USER;
};

// INVALIDATE AUTHCOOKIE
function invalidateAuthCookie() {
  const oraSSOauthHint = getCookieData('ORASSO_AUTH_HINT');
  if (oraSSOauthHint != null) {
    const cookieInvalidStr = 'ORASSO_AUTH_HINT=INVALID; Max-Age=0; domain=.oracle.com; path=/;';
    document.cookie = cookieInvalidStr;
  }
}

// SSO_SIGN_OUT
export const ssoSignOut = () => {
  let rUrl = escape(window.location.href.replace(/^http:/gi, 'https:'));
  if (rUrl.indexOf('/secure') !== -1) {
    // Added by Seth 11/7/19
    if (window.location.href.indexOf('/opn/') > -1) {
      rUrl = 'http://www.oracle.com/opn/';
    } else {
      rUrl = 'http://www.oracle.com/partners/';
    }
  }
  invalidateAuthCookie();
  // if (window.location.host.indexOf('-stage') > -1) {
  //   window.location = `https://login-stage.oracle.com/sso/logout?p_done_url=${rUrl}`;
  // } else {
  window.location = `https://login.oracle.com/sso/logout?p_done_url=${rUrl}`;
  // }
};

const Profile = ({ isProfActive, updateProfileState }) => {
  /* Declarations */
  const profileRef = useRef();
  const profileInnerRef = useRef();
  let location = '';
  if (process.browser) {
    location = window.location.href;
  }

  /* States */
  const [userInfo, setuserInfo] = useState({});
  const [isRTL, setRTLFix] = useState(false);
  const [ssoURL, setssoURL] = useState();

  /* Hooks */

  useEffect(() => {
    const sso = `https://www.oracle.com/webapps/redirect/signon?nexturl=${window.location.href}`;
    setssoURL(sso);
    handleResize();
    setuserInfo(getUserInfo());
    // add when mounted
    document.addEventListener('mousedown', handleProfileClickOutside);
    window.addEventListener('resize', handleResize);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleProfileClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* Functions */
  // on window/screen resize event
  const handleResize = () => {
    const u28profilebtn = profileRef.current.querySelector('.u28prof');
    const u28profiledropdown = profileRef.current.querySelector('.u28-profilew1');
    let u28profiledropdownWidth = u28profiledropdown.clientWidth;
    if (u28profiledropdown.offsetParent === null) {
      u28profiledropdownWidth = parseFloat(window.getComputedStyle(u28profiledropdown).getPropertyValue('width'));
    }
    const btnwidth = u28profilebtn.clientWidth;
    const u28profilebtnOffset = u28profilebtn.getBoundingClientRect();
    const profileright = window.innerWidth - (u28profilebtnOffset.left + btnwidth);
    // Fix for RTL
    if (profileright + btnwidth <= u28profiledropdownWidth - 20) {
      setRTLFix(true);
    }
    if (profileright + btnwidth > u28profiledropdownWidth - 20) {
      setRTLFix(false);
    }
  };

  // Hide/Show Profile links
  const toggleProfilePopup = (event) => {
    event.preventDefault();
    const newState = !isProfActive;
    updateProfileState(newState);
  };

  // Close profile popup when click outside
  const handleProfileClickOutside = (event) => {
    if (profileRef.current.contains(event.target)) {
      // inside click
      return;
    }
    // outside click
    closePopup();
  };

  // Hode Profile Popup
  const closePopup = () => {
    updateProfileState(false);
  };

  // Back Click Handler In Mobile View
  const onBackClick = (event) => {
    event.preventDefault();
    closePopup();
  };

  // Signout Handler
  const handleSignOut = (event) => {
    event.preventDefault();
    ssoSignOut();
  };

  const handleProfileA11y = (event) => {
    const profPopupFirstButton = profileRef.current.querySelector('.u28-profilew2 a:first-of-type');
    // Toggle profile popup and focus on first element
    if (event && event.keyCode === 13) {
      toggleProfilePopup(event);
      setTimeout(() => {
        profPopupFirstButton.focus();
      }, 10);
      return false;
    }
  };

  const handleProfileInnerA11y = (event) => {
    // When tabbing out of last item, focus on contact sales menu
    const profPopupFirstButton = profileRef.current.querySelector('.u28-profilew2 a:first-of-type');
    const viewAcctsButton = profileRef.current.querySelector('.u28prof');
    let profPopupLastButton = null;
    const signedInPanel = profileInnerRef.current.querySelector('.u28l-in');
    // Determine last element based on whether the user is signed in or not

    const state = getComputedStyle(signedInPanel);
    profPopupLastButton = profileInnerRef.current.querySelector('#u28pfile-sout');
    if (state.display === 'none') {
      profPopupLastButton = profileInnerRef.current.querySelector('.u28l-out .u28btn2');
    }
    if ((event && event.keyCode === 9 && event.target === profPopupLastButton) || (event && event.shiftKey && event.keyCode === 9 && event.target === profPopupFirstButton)) {
      toggleProfilePopup(event);
      setTimeout(() => {
        viewAcctsButton.focus();
      }, 10);
      return false;
    }
  };

  return (
    <>
      <div
        className={['u28-profile', userInfo && userInfo.guid ? 'loggedin' : ''].join(' ')}
        tabIndex="-1"
        ref={profileRef}
      >
        <a
          href="#"
          className="u28prof"
          tabIndex="0"
          onKeyDown={handleProfileA11y}
          onClick={toggleProfilePopup}
          aria-controls="u28-profilew1"
          aria-label="View Accounts, Sign In"
          aria-expanded={!!isProfActive}
          aria-haspopup="true"
          title="View Accounts"
          data-lbl="sign-in-account"
        >
          <div className="acttxt" tabIndex="-1">View Accounts</div>
          <span tabIndex="-1">Sign In</span>
        </a>
        <div
          className={['u28-profilew1', isProfActive ? 'u28fadeIn' : '', isRTL ? 'right' : ''].join(' ')}
          tabIndex={isProfActive ? '0' : '-1'}
          ref={profileInnerRef}
          onKeyDown={handleProfileInnerA11y}
        >
          <span className="u28actbck u28back" onClick={onBackClick}>
            Back
          </span>
          <div className="u28-profilew2">
            <span className="u28acttitle">Cloud Account</span>
            <a
              href="/cloud/sign-in.html"
              data-lbl="go-to-cloud-website"
              className="u28cloudbg"
              tabIndex={isProfActive ? '0' : '-1'}
              aria-label="Sign in to Cloud"
            >
              Sign in to <span> Cloud</span>
            </a>
            <a
              href="/cloud/free/?source=:ow:o:h:nav:OHP0625ViewAccountsButton&intcmp=:ow:o:h:nav:OHP0625ViewAccountsButton"
              className="u28btn2"
              data-lbl="cta-0625-nav-header-accounts-free-tier-oci"
              aria-label="Sign Up for Free Cloud Tier"
            >
              Sign Up for Cloud Free Tier
            </a>
          </div>
          <span className="u28acttitle">Oracle Account</span>
          <ul className="u28l-out">
            {userInfo && userInfo.guid ? null : (
              <li>
                <a
                  href={ssoURL}
                  data-lbl="profile:sign-in-account"
                  className="u28btn1"
                  tabIndex={isProfActive ? '0' : '-1'}
                >
                  Sign-In
                </a>
              </li>
            )}
            <li>
              <a
                href="https://profile.oracle.com/myprofile/account/create-account.jspx"
                data-lbl="profile:create-account"
                className="u28btn2"
                tabIndex={isProfActive ? '0' : '-1'}
              >
                Create an Account
              </a>
            </li>
          </ul>
          <ul className="u28l-in">
            {userInfo.firstname && userInfo.firstname !== 'NOT_FOUND' && (
              <li>
                <a
                  href={`https://profile.oracle.com/myprofile/account/secure/update-account.jspx?nexturl=${location}`}
                  data-lbl="profile:user-account"
                  tabIndex={isProfActive ? '0' : '-1'}
                >
                  {userInfo.firstname}
                  {userInfo.lastname && userInfo.lastname !== 'NOT_FOUND' ? ` ${userInfo.lastname}` : null}
                </a>
              </li>
            )}
            <li>
              <a href="/corporate/contact/help.html" data-lbl="help" tabIndex={isProfActive ? '0' : '-1'}>
                Help
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleSignOut}
                id="u28pfile-sout"
                data-lbl="signout"
                tabIndex={isProfActive ? '0' : '-1'}
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="u28-contact">
        <a href="/corporate/contact/" className="u28contact" title="Contact Sales" data-lbl="contact-sales"><span>Contact Sales</span></a>
      </div>
    </>
  );
};
export default Profile;
