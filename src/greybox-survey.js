/*
 *  GreyboxSurvey.js - extends SurveyInvitations.js with defaults for
 *                     use with modal windows created with greybox
 *                     (http://orangoo.com/labs/GreyBox/)
 */

GreyboxSurvey = (function(options){

    var defaults = {
        openDialog: function(){
            GB_showCenter("Survey", "http://www.example.com/survey-dialog.html",180,320);
        },

        closeDialog: function(){
            GB_hide();
        },

        openSurvey: function(){
            window.open(this.surveyUrl,'_newtab');
        }

    }

    // Let options be either an associative array with properties or array of properties
    if(!(options.length > 0)){
        options = [options];
    }

    // Set defaults if not set
    for(i=0;i<options.length;i++) {
        for (var key in defaults) {
            if(typeof options[i][key] === 'undefined'){
                options[i][key] = defaults[key];
            }
        }
    }

    var survey = new surveyInvitations.Survey(options);
    return survey;
});


