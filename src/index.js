import React, { Component } from "react";
import PropTypes from "prop-types";

import PowerBiWrapper from "./components/PowerBiWrapper";

class PowerBiEmbed extends Component {
  render() {
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
    } = this.props.config;

    var {
      PbiFailErrorMessage, 
      invalidConfigErrorMessage,
      hideDefaultError
    } = this.props;

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
