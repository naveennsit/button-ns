/* Name                 : AutoSuggestLink
 * Type                 : Single Component
 * Child Components     : NA
 * External Libraries   : NA
 * Generic Components   : NA
 * Generic Libraries    : NA
 * Descriptions         : Accepts value and generates auto suggest link
 */

/* eslint-disable jsx-a11y/role-supports-aria-props */

/* Imports */
import React from 'react';

const AutoSuggestLink = ({ val, searchValue, dropdownStyles }) => {
  /* Declarations */
  const type = val.attributes.aoDestinationType;
  const title = val.attributes.Title;
  const url = val.attributes.aoDestinationURL[0];
  let typeclass = 'u28-globe';
  const titleTxt = title.toString();
  if (type) {
    if (type[0] === 'Video') {
      typeclass = 'icn-video';
    }
    if (type[0] === 'Coversation') {
      typeclass = 'icn-chat';
    }
  }
  let suggestb = titleTxt.replace(new RegExp(searchValue, 'gi'), (match) => `<b>${match}</b>`);
  suggestb += `<cite>${url}</cite>`;

  return (
    <li>
      <a
        href={url}
        className={['u28suggestlnk o-hf', typeclass].join(' ')}
        data-trackas="header:search:suggestlnk"
        data-lbl={`keyword:${searchValue}:suggest:${title}`}
        dangerouslySetInnerHTML={{ __html: suggestb }}
        tabIndex={'-1'}
        style={{ marginLeft: dropdownStyles.left, maxWidth: dropdownStyles.width }}
      />
      {/* </Link> */}
    </li>
  );
};
export default AutoSuggestLink;