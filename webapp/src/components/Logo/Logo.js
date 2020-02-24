import React from "react";

import siteLogo from "../../assets/images/logo.png";

const Logo = props => {
  return (
    <img
      src={siteLogo}
      style={{
        display: "block",
        width: "175px"
      }}
      alt={"logo"}
    />
  );
};

export default Logo;
