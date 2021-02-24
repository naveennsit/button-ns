/* Name                 : NoResults
 * Type                 : Single Component
 * Child Components     : NA
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : NA
 * Descriptions         : This component will be loaded if no search results found
 */

/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/* Imports */
import React from 'react';

const NoResults = ({ updateSearch }) => {
  /* Declarations */
  const trendingQuestions = [
    'How are customers using Oracle Cloud apps and infrastructure?',
    'Analyst Reports',
    'College recruiting',
    'Working at Oracle',
    'Can I take advantage of the cloud in my own data center?',
    'HCM',
    'Oracle business transformation',
    'Try Oracle Cloud for free',
    'How can I create an agile supply chain?',
    'Blockchain applications',
    'Oracle vs AWS',
    'Financials',
  ];

  return (
    <div className="u28rw1">
      <div className="u28rw2">
        <h4>No results found</h4>
        <p>Your search did not match any results.</p>
        <p>We suggest you try the following to help find what you&apos;re looking for:</p>
        <ul className="u28w7a">
          <li>Check the spelling of your keyword search.</li>
          <li>Use synonyms for the keyword you typed, for example, try “application” instead of “software.”</li>
          <li>Try one of the popular searches shown below.</li>
          <li>Start a new search.</li>
        </ul>
        <p>&nbsp;</p>
        <p>
          <strong>Trending Questions</strong>
        </p>
        <ul className="u28w7">
          {trendingQuestions.map((val, i) => (
            <li key={i} onClick={() => updateSearch({ status: 'init', value: val }, val)}>
              {val}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default NoResults;
