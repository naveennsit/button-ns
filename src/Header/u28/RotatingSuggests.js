/* Name                 : RoratingSuggests
 * Type                 : Single Component
 * Child Components     : NA
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : NA
 * Descriptions         : This components display predefined suggeions in search bar by default
 */

/* Imports */
import React, { useState, useEffect } from 'react';

const RoratingSuggests = ({ suggestions, searchValue }) => {
  /* States */
  const [suggestText, setsuggestText] = useState('');
  const [fadeIn, setFadeInState] = useState(true);

  /* Hooks */
  useEffect(() => {
    // Start with first value
    setsuggestText(suggestions[0]);
  }, [suggestions]);

  useEffect(() => {
    // Rotating text fadein/fadeout effect
    let timer1;
    let timer2;
    if (suggestText) {
      timer1 = setTimeout(() => {
        setFadeInState(false);
        let index = suggestions.indexOf(suggestText);
        index = index === suggestions.length - 1 ? -1 : index;
        const text = suggestions[index + 1];
        timer2 = setTimeout(() => {
          setsuggestText(text);
          setFadeInState(true);
        }, 400);
      }, 2000);
    }
    // Required: Do Cleanup when component unmounted
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [suggestText]);

  return (
    <>
      <style jsx>
        {`
          .u28placeholderFadeIn {
            opacity: 1;
            animation: fadeIn 0.4s ease-in;
          }
          .u28placeholderFadeOut {
            opacity: 0;
            animation: fadeOut 0.4s ease-out;
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>

      {suggestions.length > 0 && !searchValue ? (
        <div className={['u28placeholder', searchValue ? 'u28hidden' : ''].join(' ')}>
          <span className={fadeIn ? 'u28placeholderFadeIn' : 'u28placeholderFadeOut'}>{suggestText}</span>
        </div>
      ) : null}
    </>
  );
};
export default RoratingSuggests;
