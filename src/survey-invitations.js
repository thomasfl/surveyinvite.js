/* UserSurvey.js - Ask some of the visitors to take a survey. */

surveyInvitations = {};

surveyInvitations.Survey = (function (options, href ) {

    var survey = {};

    var defaults = {
        frequencyPercent: 100,                      // Display dialog on 100% of all..
        percentageOf: 'visitors',                   // 'visitors' or 'page_request'
        cookieName: 'ask_again_for_survey',
        startDate: undefined,                      // Start date for survey. Legal values is undefined new Date(2012,12,24)
        endDate: new Date(new Date().setDate(
                   new Date().getDate() + 30)),     // Survey expires after 30 days
        expireDays: 30,                             // Let cookie expire after 30 days
        askAgainAmount: 2,                          // Ask user again in 2...
        askAgainDatepart: 'days',                   // ...days
        cookieDomain: undefined                     // If not set, browser will assume it's the
                                                    // same as cookie is beeing set from

    };

    // The href parameter is only used by tests to simulate behaviour at different url's
    if(typeof href === 'undefined'){
        href = window.location.href;
    }

    // Return configuration
    survey.getSurveyConfig = function(href){
        var surveyConfig = undefined;

        options = options || {};
        if(options.length > 0){

            // If we have a list of options, find the set of options where the regexp patterns
            // match our current url
            for(i=0;i<options.length;i++) {
                regexps = options[i].visibleAt;
                if(regexps.length > 0){
                    for(j=0;j<regexps.length;j++) {
                        if(href.match(regexps[j]) ){
                            surveyConfig = options[i];
                        }
                    }
                } else {
                    // We have a single regexp
                    if(href.match(options[i].visibleAt)){
                        surveyConfig = options;
                    }
                }
            }

        } else {

            // Check if the visibleAt option match our url
            if(typeof options.visibleAt !== 'undefined'){
                if(options.visibleAt.length > 0){
                    // We have a list of regexps to check
                    regexps = options.visibleAt;
                    for(j=0;j<regexps.length;j++) {
                        if(href.match(regexps[j]) ){
                            surveyConfig = options;
                        }
                    }

                } else {
                    // We have a single regexp
                    if(href.match(options.visibleAt)){
                        surveyConfig = options;
                    }
                }
            } else {
                surveyConfig = options;
            }

        }

        // Set defaults
        if(typeof surveyConfig !== 'undefined'){
            for (var key in defaults) {
                if(typeof surveyConfig[key] === 'undefined'){
                    surveyConfig[key] = defaults[key];
                }
            }
        }
        return surveyConfig;
    };


    survey.getCookieName = function(){
        return survey.config.cookieName;
    };

    survey.clearCookie = function(){
        if(typeof survey.config !== 'undefined'){
            surveyInvitations.CookieUtils.erase(survey.config.cookieName, survey.config.cookieDomain);
        } else {
            surveyInvitations.CookieUtils.erase(defaults.cookieName, defaults.cookieDomain);
        }
    };

    /* Opens dialog window asking user to take the survey. */
    survey.openDialog = function(){
        if(survey.isVisible){
            survey.config.openDialog();
        }
    };

    survey.run = function(){
        if(survey.isVisible){
            survey.config.openDialog();
        }
    };

    survey.createCookie = function(name,value){
        surveyInvitations.CookieUtils.create(name, value, survey.config.expireDays, survey.config.cookieDomain);
    };

    /* Closes dialog window if user has said no to participate in survey. */
    survey.closeDialog = function(){
        // surveyInvitations.CookieUtils.create(survey.config.cookieName,'never', survey.config.expireDays);
        survey.createCookie(survey.config.cookieName,'never');
        survey.config.closeDialog();
    };

    /* Opens survey and closes dialog window */
    survey.openSurvey = function(){
        // surveyInvitations.CookieUtils.create(survey.config.cookieName,'never', survey.config.expireDays);
        survey.createCookie(survey.config.cookieName,'never');
        survey.config.openSurvey();
        survey.config.closeDialog();
    };

    /* Set cookie and close dialog window.
     * Example:
     *    askAgainIn(7,'days')
     * Defaults to 30 minutes.
     */
    survey.askAgainIn = function(amount, time_section ){
        if(typeof time_section === 'undefined'){
            time_section = survey.config.askAgainDatepart; // 'days'
        }
        if(typeof amount === 'undefined'){
            amount = survey.config.askAgainAmount;
        }

        var date = new Date();
        var askAgainDate = new Date();
        switch(time_section){
        case "minutes":
            askAgainDate.setTime(date.getTime()+(amount*60*1000));
            break;
        case "hours":
            askAgainDate.setTime(date.getTime()+(amount*60*60*1000));
            break;
        case "days":
            askAgainDate.setTime(date.getTime()+(amount*24*60*60*1000));
            break;
        }

        // surveyInvitations.CookieUtils.create(survey.config.cookieName, askAgainDate.toGMTString(), survey.config.expireDays);
        survey.createCookie(survey.config.cookieName, askAgainDate.toGMTString());
        if(typeof survey.config !== 'undefined'){
            survey.config.closeDialog();
        }
        return askAgainDate;
    };

    /* Set cookie, close dialog window and makes sure */
    survey.askAgain = function(amount, time_section ){
        return survey.askAgainIn();
    };

    /* Configure user survey for the current url, if any. */
    var survey_config = survey.getSurveyConfig(href);
    if( survey_config !== undefined) {
        survey.config = survey_config;
        survey.isVisible = true;

        /* Don't display if cookie is set to never or a date and time in the future. */
        var cookie_value = surveyInvitations.CookieUtils.read(survey.config.cookieName);
        if(cookie_value){
            if(cookie_value === 'never'){
                survey.isVisible = false;
            } else {
                var cookieDate = new Date();
                cookieDate.setTime(Date.parse(cookie_value));
                var browserDate = new Date();
                if(cookieDate.getTime() > browserDate.getTime()){
                    survey.isVisible = false;
                }
            }
        }

        /* Only display user surve to a percentage of the users */
        if(survey.config.frequencyPercent < 100){
            var randomnumber = Math.floor(Math.random()*100);
            if( randomnumber < (100 - survey.config.frequencyPercent)){
                survey.isVisible = false;
            }
        }

        /* Check start date */
        if(survey.config.startDate !== undefined){
            if(survey.config.startDate >= new Date()){
                survey.isVisible = false;
            }
        }

        /* Check start date */
        if(survey.config.endDate !== undefined){
            if(survey.config.endDate <= new Date()){
                survey.isVisible = false;
            }
        }

    } else {
        survey.isVisible = false;
    }

    /* Set cookie if survey is only visible to a percentage of all visitors */
    if(typeof survey.config !== 'undefined') {
        if(survey.config.percentageOf === 'visitors'){
            survey.createCookie(survey.config.cookieName,'never');
        }
    }
    return survey;
});

/* Cookie utilities from quirksmode.org and slightly extended. */
surveyInvitations.CookieUtils = {

    create: function(name,value,days,domain) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        } else {
            expires = "";
        }

        if(domain){
            expires = expires +  ";domain=" + domain
        }

        document.cookie = name+"="+value+expires+"; path=/";
    },

    read: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i = 0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },

    erase: function(name,domain) {
        surveyInvitations.CookieUtils.create(name,"",-1,domain);
    }
};
