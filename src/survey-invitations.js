/* UserSurvey.js 0.4 - Display dialog to ask some of the visitors to take a survey.
 *
 * Author: Thomas Flemming 2011 thomas.flemming(at)gmail.com
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
 
SurveyInvitations = {};

SurveyInvitations.Survey = (function (options, href ) {

    var survey = {};

    var defaults = {
        visiableAt: undefined,                      // Can be a regexp that filters which pages to display survey invitations at.
        frequencyPercent: 100,                      // Display dialog on 100% of all..
        percentageOf: 'visitors',                   // 'visitors' or 'page_request'
        cookieName: 'ask_again_for_survey',         //
        startDate: undefined,                       // Start date for survey. Legal values is undefined new Date(2012,12,24)
        endDate: new Date(new Date().setDate(
                   new Date().getDate() + 30)),     // Survey expires after 30 days
        expireDays: 30,                             // Let cookie expire after 30 days
        askAgainIn: [2,'days'],
        cookieDomain: undefined,                    // If not set, browser will assume it's the
                                                    // same as cookie is beeing set from
        openDialog: function(){                     // Override this methods
        },
        closeDialog: function(){
        },
        openSurvey: function(){
        }

    };

    // The href parameter is only used by tests to simulate behaviour at different url's
    if(typeof href === 'undefined'){
        href = window.location.href;
    }

    survey.getHref = function(){
        return href;
    };

    // Return configuration based on matching options
    survey.getSurveyConfig = function(href){
        var surveyConfig;
        options = options || {};

        // Options can be both a single set of options and a list of options.
        // If options is not a list of options, make it a list.
        if(!(options.length)){
            options = [options];
        }

        // If we have a list of options, try to find the set of options where the visibleAt propertey
        // has a regexp that matches our current url.
        for(var i=0;i<options.length;i++) {

            regexps = options[i].visibleAt;
            if(typeof regexps === 'undefined'){
                surveyConfig = options[i];
            } else {
                if(!(regexps.length)){
                    regexps = [regexps];
                }

                for(var j=0;j<regexps.length;j++) {
                    if(href.match(regexps[j]) !== null ){
                        surveyConfig = options[i];
                    }
                }
            }

        }

        // If an option is not set, set it to default value
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
            SurveyInvitations.CookieUtils.erase(survey.config.cookieName, survey.config.cookieDomain);
        } else {
            SurveyInvitations.CookieUtils.erase(defaults.cookieName, defaults.cookieDomain);
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
        SurveyInvitations.CookieUtils.create(name, value, survey.config.expireDays, survey.config.cookieDomain);
    };

    /* Closes dialog window if user has said no to participate in survey. */
    survey.closeDialog = function(){
        survey.createCookie(survey.config.cookieName,'never');
        survey.config.closeDialog();
    };

    /* Opens survey and closes dialog window */
    survey.openSurvey = function(){
        survey.createCookie(survey.config.cookieName,'never');
        survey.config.openSurvey();
        survey.config.closeDialog();
    };

    survey.askAgain = function(){
        // var time_section = survey.config.askAgainDatepart;
        // var amount = survey.config.askAgainAmount;
        var amount = survey.config.askAgainIn[0];
        var time_section = survey.config.askAgainIn[1];
        return survey.askAgainIn(amount, time_section);
    };

    /* Set cookie and close dialog window.
     * Example:
     *    askAgainIn(7,'days')
     * Defaults to 30 minutes.
     */
    survey.askAgainIn = function(amount, time_section ){
        if(typeof time_section === 'undefined'){
            // time_section = survey.config.askAgainDatepart;
            time_section = survey.config.askAgainIn[1];
        }
        if(typeof amount === 'undefined'){
            // amount = survey.config.askAgainAmount;
            amount = survey.config.askAgainIn[0];
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
        var cookie_value = SurveyInvitations.CookieUtils.read(survey.config.cookieName);
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
            if(!SurveyInvitations.CookieUtils.read(survey.config.cookieName)) {
                survey.createCookie(survey.config.cookieName,'never');
            }
        }
    }
    return survey;
});

/* Cookie utilities from quirksmode.org and slightly extended. */
SurveyInvitations.CookieUtils = {

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
        SurveyInvitations.CookieUtils.create(name,"",-1,domain);
    }
};
