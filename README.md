SurveyInvitation.js
===================

Use surveyinvitations.js to keep track of when, where and how often visitors to your site should be asked if the want to take a short survey. This javascript library can be used with any javascript library, like jquery, and any widget library that provides modal dialog windows like lightbox or greybox.

# How to ask users if they want to take a survey without SurveyInvitation.js #

If you simply want to ask all visitors on your site to take a survey, it's fairly easy with javascript to simply ask visitors to confirm if they want to take a survey of a cookie is not set.

```javascript
  var  = $.cookie('survey');
  if(typeof cookie !== 'undefined' && confirm("Do you want to take a short survey?")){
      window.open('http://www.surveymonkey.com/s/PZVWYLP','_newtab');
      $.cookie('survey','taken');
  }
```

This will ask all visitors. If you only wan't to ask a random 10% of the visitors, we can use a random number.

```javascript
  var  = $.cookie('survey');
  if(typeof cookie !== 'undefined' &&  ( Math.floor(Math.random()*100) > 90 )
      && confirm("Do you want to take a short survey?")){
      window.open('http://www.surveymonkey.com/s/PZVWYLP','_newtab');
      $.cookie('survey','taken');
  }
```

If your needs are not more advanced than this, you don't need SurveyInvitation.js. If you wan't to have different

# Surveys with SurveyInvitation.js #

The JavaScript library survey-invitation.js wraps the code needed to display invitations to take surveys in to a class that takes several options. If, for example, only 10 percent of the visitors to a page, beetwen two dates should be asked to take a survey:

```javascript
     $(document).ready(function() {
            survey = new SurveyInvitations.Survey({
                                    surveyUrl: 'http://www.surveymonkey.com/s/PZVWYLP',
                                    frequencyPercent: 10,
                                    startDate: new Date(2011,10,28),
                                    endDate: new Date(2011,11,1)});
            survey.run();
     });
```

If the javascript is inserted in to the html across all the pages on a site, but only some pages should display survey invitations then the visibleAt option takes a regexp to match the pattern of the url.


```javascript
     $(document).ready(function() {
            survey = new SurveyInvitations.Survey({
                                    surveyUrl: 'http://www.surveymonkey.com/s/PZVWYLP',
                                    frequencyPercent: 10,
                                    visibleAt: /\/some-urlpath\ });
            survey.run();
     });
```

SurveyInvitations can also take an array of options, making it possible to have one single configuration file for different survey invitations to on a site.


# Using lightbox, greybox, fancybox #

To customize the look and feel of the dialog, these options take code blocks used to open and close dialog window and redirect user to the survey:

 * openDialog: function used to open lightbox or other widgets
 * closeDialog: function called when dialog window should be closed
 * openSurvey: function called to open survey

# Ask again later #

If you're optimistic, you might want to add a "Ask me again later" button to the dialog that pops up. To do that, you can trigger this javascript when button is clicked:

```javascript
    survey.askAgainIn(10,'minutes');
```

Options
=======

 * surveyUrl: String with url to redirect users who answers yes. Mandatory.
 * visibleAt: undefined (default). A regexp, or a list of regexps, with pattern that should match the current url.
 * frequencyPercent: 100 (default). Specify the amount of visitors which should randomly be asked to take a survey.
 * percentageOf: 'visitors' (default) or 'page_request'
 * askAgainIn: [2,'days'] (default). Specify how long it should take before visitors is asked again to take a survey. Can be 'days', 'hours', 'minutes'.
 * cookieName: 'ask_again_for_survey' (default). A string that must be set if multiple surveys across a site
 * openDialog: function used to open lightbox or other widgets
 * closeDialog: function called when dialog window should be closed
 * openSurvey: function called to open survey
 * cookieDomain: undefined (default). A string set if survey should be able to be displayed across more subdomains.
 * startDate: undefined (default). Datetime.
 * endDate: undefined (default). Datetime.

Options can be a list of options, but then the visibleAt option must be set for every set of options.

## Full example ##

```javascript

     var survey_config = {
        visibleAt: /\/products\/,                   // Only display survey invitations at product pages.
        surveyUrl: 'http://www.surveymonkey.com/s/PZVWYLP', // The address to the actual survey
        frequencyPercent: 10,                       // Select a random 10% of all...
        percentageOf: 'visitors',                   // 'visitors'.
        cookieName: 'ask_again_for_survey',         //
        startDate: new Date(2011,10,28),            // Wait until 28th october to start displaying invitations, and ...
        endDate: new Date(2011,10,30),              // stop 2 days after.
        expireDays: 4,                              // Let the cookie expire after 4 days
        askAgainIn: [2,'hours'],                    // Amount to wait if users clicks a "Ask again later" button.

        openDialog: function(){                     // Use greybox to display a modal dialog window.
                                                    // this url contains html to be displayed inside the modal dialog.
            GB_showCenter("Survey", "http://www.example.com/survey-invitation-dialog.html",180,320);
        },

        closeDialog: function(){
            GB_hide();
        },

        openSurvey: function(){
            window.open(this.surveyUrl,'_newtab');   // Open survey in a new tab.
        }
     };

     $(document).ready(function() {
            survey = new SurveyInvitations.Survey(survey_config);
            survey.run();
     });
```

A html file named 'survey-invitation-dialog.html' must be in place for this to work.

```html
  <html>
  <body>
    <p>Please help us making our websites better.</p>
    <p><strong>Would you like to take a short survey?</strong></p>
    <form action="" method="get">

         <input name="submit" type="submit" value="Yes"
                onclick="javascript:parent.parent.survey.openSurvey();return false;"/>

         <input name="submit" type="submit" value="No"
                onclick="javascript:parent.parent.survey.closeDialog();return false;" />

         <input name="submit" type="submit" value="Ask me later"
                onclick="javascript:parent.parent.survey.askAgain();return false;" />

    </form>
  </body>
  </html>
```

## More options ##

SurveyInvitation also takes a list of options, making it possible to have one single configuration for many different surveys across a site.


```javascript

     var surveys _config = [{
        visibleAt: /\/products\/,                       // Only display survey invitations at product pages.
        surveyUrl: 'http://www.surveymonkey.com/s/1',   // The address to the actual survey
        cookieName: 'ask_again_for_survey_1'            // This must be set if we have different survey campaigns
      },
      {
        visibleAt: /\/positions\/,                      // Another regexp to match
        surveyUrl: 'http://www.surveymonkey.com/s/2',   // and another survey
        cookieName: 'ask_again_for_survey_2'            // This must be set if we have different survey campaigns
      }];

     $(document).ready(function() {
            survey = new SurveyInvitations.Survey(survey_config);
            survey.run();
     });
```

Running tests
=============

To run the tests simply download Google's JsTestDriver.jar file and start the JsTestDriver web server:

```
  $ java -jar JsTestDriver.jar --port 9876
```

Redirect one or more browser to http://localhost:9876 and click the capture link.
Run tests:

```
  $ java -jar JsTestDriver.jar --tests all
```

For more documentation on JsTestdriver http://code.google.com/p/js-test-driver

Author
======

*Thomas Flemming*

 + http://github.com/thomasfl
 + http://twitter.com/thomasfl


License
---------------------

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
