import React, { Component } from "react";
import PropTypes from "prop-types";

import PowerBiWrapper from "./components/PowerBiWrapper";

class PowerBiEmbed extends Component {
  render() {
    // The variables names below can be modified by the user as per his convenience - they are just placeholders in the component props
    // However the props names of PowerBiWrapper should not be modified as that's what goes into the Powerbi APIs

    var {
      AuthenticationType,
      accessToken,
      embedTokenType,
      embedType,
      embedUrl,
      filterPaneEnabled,
      height,
      reportId,
      navContentPaneEnabled,
      width,
      groupId
    } = this.props.config;  // These variables are used by PowerBi APIs

    var {
      PbiFailErrorMessage, 
      invalidConfigErrorMessage,
      hideDefaultError
    } = this.props;   //These variables are for custom error handling

    return (
      <PowerBiWrapper
        AuthenticationType={AuthenticationType}
        accessToken={accessToken}
        embedTokenType={embedTokenType}
        embedType={embedType}
        embedUrl={embedUrl}
        filterPaneEnabled={filterPaneEnabled}
        height={height}
        id={reportId}
        groupId={groupId}
        navContentPaneEnabled={navContentPaneEnabled}
        width={width}
        PbiFailErrorMessage = {PbiFailErrorMessage}
        invalidConfigErrorMessage = {invalidConfigErrorMessage}
        hideDefaultError = {hideDefaultError}
      />
    );
  }
}


PowerBiEmbed.propTypes = {
  config: PropTypes.object.isRequired,
  hideDefaultError: PropTypes.bool.isRequired
};

export default PowerBiEmbed;
