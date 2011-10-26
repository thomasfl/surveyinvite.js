SurveyInvitation.js
===================

Use surveyinvitations.js to keep track of when, where and how often visitors to your site should be asked if the want to take a short survey. This javascript library can be used with any javascript library, like jquery, and any widget library or lightbox alternative.

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
            survey = new surveyInvitations.Survey({
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
            survey = new surveyInvitations.Survey({
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

 * surveyUrl: string with url to redirect users who answers yes
 * visibleAt: regexp with patterns
 * frequencyPercent: 0 - 100
 * percentageOf: 'visitors' or 'page_request'
 * cookieName: string that must be set if multiple surveys across a site
 * openDialog: function used to open lightbox or other widgets
 * closeDialog: function called when dialog window should be closed
 * openSurvey: function called to open survey
 * cookieDomain: string set if survey should be able to be displayed across more subdomains
 * startDate: datetime
 * endDate: datetime

Options can be a list of options, but then the visibleAt option must be set for every set of options.

Running tests
=============

To run the tests download Google's JsTestDriver.jar file. Start JsTestdriver server:

```
  $ java -jar JsTestDriver.jar --port 9876
```

Run tests:

```
  $ java -jar JsTestDriver.jar --tests all
```

For more documentation on JsTestdriver http://code.google.com/p/js-test-driver


