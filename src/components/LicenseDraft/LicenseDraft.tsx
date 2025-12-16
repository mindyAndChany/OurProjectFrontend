/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  className: any;
  licenseDraft: string;
}

export const LicenseDraft = ({
  className,
  licenseDraft = "/img/license-draft-2.png",
}: Props): JSX.Element => {
  return (
    <img
      className={`license-draft ${className}`}
      alt="License draft"
      src={licenseDraft}
    />
  );
};

LicenseDraft.propTypes = {
  licenseDraft: PropTypes.string,
};
