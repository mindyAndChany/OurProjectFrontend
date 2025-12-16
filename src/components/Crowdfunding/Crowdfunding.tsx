/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  className: any;
  crowdfunding: string;
}

export const Crowdfunding = ({
  className,
  crowdfunding = "/img/crowdfunding-2.png",
}: Props): JSX.Element => {
  return (
    <img
      className={`crowdfunding ${className}`}
      alt="Crowdfunding"
      src={crowdfunding}
    />
  );
};

Crowdfunding.propTypes = {
  crowdfunding: PropTypes.string,
};
