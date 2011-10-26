/* Example of how to create a class with
 *
 */

GreyboxSurvey = (function(options){

    var defaults = {
        openDialog: function(){
            if($("html[lang=no]").length) {
                GB_showCenter("Sp\xf8rreunders\xf8kelse",
                              "http://www.uio.no/vrtx/thomasfl_tmp/survey-dialog-no.html",180,320);
            } else {
                GB_showCenter("Survey", "http://www.uio.no/vrtx/thomasfl_tmp/survey-dialog-en.html",180,320);
            };
            changeGBCloseLang();
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


