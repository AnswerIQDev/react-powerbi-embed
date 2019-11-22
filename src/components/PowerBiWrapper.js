import React, { Component } from "react";
import * as pbi from "powerbi-client";
import PropTypes from "prop-types";
import axios from "axios";

const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
);

var COMPONENT = pbi.Embed;
var ROOTELEMENT = HTMLElement;

class PowerBiWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      failedRender: false,
      invalidConfig: false
    };
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentDidUpdate() {
    if (this.state.id !== this.props.id){
      this.updateState(this.props);
    }
    if (this.validateConfig()) {
      this.fetchReportFromPowerBI();
    } else if (!this.state.failedRender) {
      this.setState({
        failedRender: true,
        invalidConfig: true
      });
    }
  }

  componentWillUnmount() {
    powerbi.reset(ROOTELEMENT);
    COMPONENT = null;
  }

  fetchReportFromPowerBI() {
    if (this.state.failedRender) {
      return;
    }
    this.createEmbedToken().then(embedTokenDetails => {
      if (!embedTokenDetails) {
        this.setState({
          failedRender: true,
          hideDefaultError: true
        }); 
      } else {
        this.embedConfig(embedTokenDetails);
      }
    });
  }

  handleErrors() {
    COMPONENT.off("error");
    COMPONENT.on("error", ()=> {
      this.logRenderFailureInState();
      return COMPONENT;
    });
  }

  logRenderFailureInState() {
     this.setState({
        failedRender: true
      }); 
  }

  createEmbedToken() {
    var accessToken = "Bearer " + this.state.accessToken;
    var type = this.state.embedTokenType;
    var reportId = this.state.id;
    var groupId = this.state.groupId;
    return axios({
      method: "POST",
      url: `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/${type}/${reportId}/GenerateToken`,
      withCredentials: true,
      headers: {
        Authorization: accessToken,
        contentType: "application/json",
        "Cache-Control": "no-cache"
      },
      data: { accessLevel: "View" }
    })
      .then(res => {
        var embedTokenDetails = {
          embedToken: res.data.token,
          embedTokenExpiry: res.data.expiration
        };
        return embedTokenDetails;
      })
      .catch(res => {
        console.log("ERROR: Unable to generate embed token");
        return null;
      });
  }

  embedConfig(embedTokenDetails) {
    var reportUrl = this.state.embedUrl.split("&autoAuth")[0];
    var config = {
      type: this.state.embedType,
      tokenType: pbi.models.TokenType.Embed,
      accessToken: embedTokenDetails.embedToken,
      embedUrl: reportUrl,
      id: this.state.id,
      permissions: pbi.models.Permissions.All,
      settings: {
        filterPaneEnabled: this.state.filterPaneEnabled,
        navContentPaneEnabled: this.state.navContentPaneEnabled,
        hideErrors: true
      }
    };
    if (!this.state.failedRender) {
      COMPONENT = powerbi.embed(ROOTELEMENT, config);
      this.handleErrors();
    }
    if (this.state.retry == 1) {
      COMPONENT = powerbi.embed(ROOTELEMENT, config);
      this.handleErrors();
    }
    return COMPONENT;
  }

  updateState(props) {
    powerbi.reset(ROOTELEMENT);
    const nextState = Object.assign({}, this.state, props, {
      type: this.props.embedType ? this.props.embedType : "report"
    });
    this.setState(nextState);
  }

  validateConfig() {
    var config = this.state;
    const errors = pbi.models.validateReportLoad(config);
    if (!config.accessToken) {
      return false;
    }
    return errors === undefined;
  }

  renderErrorMessage() {
    var invalidConfigErrorMessage = this.props.invalidConfigErrorMessage || "Oops! Looks like you passed an invalid config for generating the report!";
    var PbiFailErrorMessage = this.props.PbiFailErrorMessage || "Oops! An error was encountererd while fetching the report!";
    return this.state.invalidConfig
      ? invalidConfigErrorMessage
      : PbiFailErrorMessage;
  }

  render() {
    const inlineStyles = {
      width: this.props.width,
      height: this.props.height,
      display: (this.state.failedRender && this.state.hideDefaultError )?"none": "block"
    };

    return (
      <React.Fragment>
        {this.state.failedRender && this.state.hideDefaultError && this.renderErrorMessage()}
        <div
          ref={el => {
            ROOTELEMENT = el;
          }}
          style={inlineStyles}
        /> 
      </React.Fragment>
    );
  }
}

PowerBiWrapper.propTypes = {
  accessToken: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
  embedType: PropTypes.string.isRequired,
  AuthenticationType: PropTypes.string.isRequired,
  hideDefaultError: PropTypes.bool.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  filterPaneEnabled: PropTypes.bool,
  navContentPaneEnabled: PropTypes.bool
};

export default PowerBiWrapper;
