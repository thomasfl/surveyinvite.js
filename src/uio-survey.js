/* Invite users to take a survey at some of the pages at the University of Oslo's websites. */

ResearchContentSurvey = (function(options, href){

    var config = {
        visibleAt: [ /www.(hf|sv|mn|usit).uio.no\/.*\/forskning\/vi-forsker-pa\//,
                     /www.med.uio.no\/forskning\/vi-forsker-pa\/.*\.html$/,
                     /www.jus.uio.no\/forskning\/vi-forsker-pa\/[^\/]*/],
        frequencyPercent: 100,
        surveyUrl: 'https://nettskjema.uio.no/answer.html?fid=47808&lang=no&answersAsMap[229228].textAnswer=' + window.location.href,
        expireDays: 30,                             // Cookie expires after 30 days
        cookieDomain: '.uio.no',
        askAgainIn: [10,'minutes'],

        openDialog: function(){
            if($("html[lang=no]").length) {
                GB_showCenter("Sp\xf8rreunders\xf8kelse",
                              "/vrtx/decorating/resources/dist/survey/survey-dialog-no.html",180,320);
            } else {
                GB_showCenter("Survey", "/vrtx/decorating/resources/dist/survey/survey-dialog-en.html",180,320);
            }
            changeGBCloseLang();
        },

        closeDialog: function(){
            GB_hide();
        },

        openSurvey: function(){
            window.open(this.surveyUrl,'_newtab');
        }

    };

    var survey = new SurveyInvitations.Survey(config, href);

    return survey;
});


if(typeof $ !== 'undefined'){
    $(document).ready(function() {
        setTimeout(function(){
            survey = new ResearchContentSurvey();
            survey.run();
        }, 4000);
    });
}