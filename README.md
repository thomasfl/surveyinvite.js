SurveyInvitation.js
===================


# Surveys without any library #

If you simply want to ask all visitors on your site to take a survey, it's fairly easy with javascript to just ask the visitor if a check is not set.

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

# Surveys with SurveyInvitation.js #

The JavaScript library survey-invitation.js wraps the code needed to display invitations to take surveys in to a configurable class. To ask only 10 percent of the visitors randomly, and set start and end dates:

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

SurveyInvitations can also take a list of options, making it possible to have one single configuration file for different survey invitations to on a site.


# Using lightbox, greybox, fancybox #

# Ask again later #

If you're optimistic, you mi

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

Start JsTestdriver server:

```
  $ java -jar JsTestDriver.jar --port 9876
```

Run tests:

```
  $ java -jar JsTestDriver.jar --tests all
```

For more documentation on JsTestdriver http://code.google.com/p/js-test-driver


