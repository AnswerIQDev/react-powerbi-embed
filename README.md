![](https://www.answeriq.com/hubfs/assets/Answeriq%20Logo.svg)
# react-powerbi-embed

## Getting started

Install

```bash
npm install react-powerbi-embed
```
Include in your component by:

```javascript
import PowerBiEmbed from "react-powerbi-embed";
```

In order to render the reports, create a json config as shown below:-
```jsx

renderPowerbiReport(){
  var config = {
          AuthenticationType: "MasterUser",
          reportId: "95daaaa-5691-aaaa-aab6-e32aaaaa63",
          groupId: "aaaaaa-aaaa-44aa-aaaa-aaaaaaa",
          embedUrl: "https://app.powerbi.com/reportEmbed?reportId=95daaaa-5691-aaaa&autoAuth=true&ctid=aaaabaaa  		    		de310ca&config=0cHM6Ly93YWJ",
          accessToken:"ey24i26234bjjfeeudjkh23e32743743",
          embedTokenType: "reports",
          embedType: "report",
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
          height: "100vh",
          width: "100%"
  };

   var PbiFailErrorMessage = (
          <div className="App-link">
            Oops! Looks like something went wrong!
          </div>
        );

  var invalidConfigErrorMessage =  (
          <div className="App-link">
            Oops! Looks like something went wrong, <br /> Please contact{" "}
            <a href="mailto:support@answeriq.com?Subject=Error 500">
            support@yoursupport.com
            </a>
          </div>
          );

return (
        <div className="powerbi-wrapper">
          <PowerBiEmbed 
            config={config} 
            PbiFailErrorMessage={PbiFailErrorMessage}
            invalidConfigErrorMessage = {invalidConfigErrorMessage}
            hideDefaultError = {false}
             />
        </div>
        );
```


### Understanding the variables and properties:

**config**: This consists of the essentials needed to render your report.

**AuthenticationType**: This will be "MasterUser" unless all you have is an app-only access token, and no Powerbi Pro license.

**reportId**: This is the id of the powerbi report that you prepared in Powerbi. This can be easily taken from the tool itself.

**groupId**: This is the group id of the group into which you published your report. Make sure this group has dedicated capacity and Powerbi Pro license.

**accessToken**: This access token is used to generate an embed token so as to authenticate the user and successfully get the reports from Powerbi backend.

**embedTokenType**: This type has to be "reports" and is used along with accessToken and reportId to authenticate you and fetch the reports. It indicates that you need to generate an embed token for getting reports (unless you are planning to download "dashboards" which is rarely the case).

**embedUrl** : This is the url of the report that you published, also available in your Powerbi dashboard. Make sure it has reportId and autoAuth query parameters inside it, otherwise it would not actually be secure.


**embedType** : This property is utilised by the Powerbi API internally used to fetch the required report.

**filterPaneEnabled** : Set this property to true if you want to enable the filter panel on the side of your report, else set it as false.

**navContentPaneEnabled** : Set this property to true if your report has a number of pages that the user might want to switch between in your React App.

**height** :  This will determine the height of the rendered report.

**hideDefaultError**: Set this to true in case an error is encountered while fetching your PowerBi reports and you don't want to display the standard Powerbi error message.

**PbiFailErrorMessage** : This jsx comes handy when you have set hideDefaultError: true and want to display a custom error message whenever there is an error in fetching your PowerBi Reports.

**invalidConfigErrorMessage** : This jsx is useful when you there is an error in the config you passed and you don't want to see the standard PowerBi error message.

### How this component actually works?

If you need to render PowerBI reports in your React App by implement some kind of auto-auth without having your customers log in again and again, then you might want to embed your reports using "App Owns Data" scenario as described [here](https://docs.microsoft.com/en-us/power-bi/developer/embed-sample-for-customers).

Implementing this can get very complex - at one hand you need to do the configurations mentioned in your React App and Azure AD, and on the other hand you will need to generate an embed token to render your reports. 

Generating an embed token can be very complex, as you will need to first generate an access token from AAD, process it through a standard C# code provided by Microsoft to call one of their own APIs and then pass it to your React App  - everytime the user wants to see a report or even refresh an existing one!

**This component removes all that hassle by doing it for you in Javascript itself.** All that you need to do at your end is publish your powerBi reports with autoAuth, then generate an access token from your AAD and finally pass it to this component.

**Important to note:** You will need a PowerBi Embed and Pro license along with dedicated capacity assigned to the workspace which holds your reports in order to implement App Owns Data scenario.

