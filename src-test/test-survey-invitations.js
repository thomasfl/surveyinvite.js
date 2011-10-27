
/* User surveys configuration used for testing: */
test_surveys_config = [
    { visibleAt : [/.*www.uio.no:\/path1\/path2.*/, /.*\/path1\/path2.*/ ],
      frequencyPercent: 100,
      percentageOf: 'page_request', /* 'visitors' or 'page_request' */
      cookieName: 'survey_one',

      openDialog: function(){
          // console.log("[open dialog box]");
      },
      closeDialog: function(){
          // console.log("[close dialog box]");
      },
      openSurvey: function(){
          // console.log("[open survey]");
      }
    },

    { visibleAt : /.*\/rare\/path.*/ ,
      frequencyPercent: 100,
      percentageOf: 'page_request', /* 'visitors' or 'page_request' */
      cookieName: 'survey_two',
      openDialog: function(){
          // console.log("[open dialog box]");
      },
      closeDialog: function(){
          // console.log("[close dialog box]");
      },
      openSurvey: function(){
          // console.log("[open survey]");
      }
    }
];

SurveyConfigTest = TestCase("SurveyConfigTest");

SurveyConfigTest.prototype.testAskAgain = function() {
    // Should not overwrite cookie if user has clicked 'Ask again later'
    var cookieName = 'ask_again_later';
    var config = {
        frequencyPercent: 100,
        percentageOf: 'visitors',
        cookieName: cookieName
    };

    testSurvey = new SurveyInvitations.Survey(config);
    testSurvey.clearCookie();
    assertTrue( SurveyInvitations.CookieUtils.read(cookieName) !== 'never' );


    testSurvey = new SurveyInvitations.Survey(config);
    testSurvey.run();
    assertTrue( SurveyInvitations.CookieUtils.read(cookieName) === 'never' );

    testSurvey.askAgainIn(10,'minutes')
    assertTrue( SurveyInvitations.CookieUtils.read(cookieName) !== 'never' );

    testSurvey = new SurveyInvitations.Survey(config);
    testSurvey.run();
    assertTrue( SurveyInvitations.CookieUtils.read(cookieName) !== 'never' );

    // assertTrue(false);
}

SurveyConfigTest.prototype.testRegexpMathcing = function() {
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/rare/path');
    testSurvey.clearCookie();

    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/rare/path');
    assertTrue(testSurvey.isVisible);
    assertEquals(100, testSurvey.config.frequencyPercent);
};

SurveyConfigTest.prototype.testDefaults = function() {
    /* Should be able to set basic config. */
    testSurvey = new SurveyInvitations.Survey({expireDays: 10});
    assertEquals(10, testSurvey.config.expireDays);
    assertEquals(2, testSurvey.config.askAgainIn[0]);

    /* Should have a set of default configurations. */
    var testSurvey = new SurveyInvitations.Survey();
    assertNotNull(testSurvey.config.startDate);
    assertNotNull(testSurvey.config.endDate);
    assertEquals(2,testSurvey.config.askAgainIn[0]);
    assertEquals(30, testSurvey.config.expireDays);
};

SurveyConfigTest.prototype.testRegexp = function() {
    testSurvey = new SurveyInvitations.Survey();
    testSurvey.clearCookie();

    testSurvey = new SurveyInvitations.Survey({visibleAt: /some\/path/}, 'http://example.com/some/path');
    assertTrue(testSurvey.isVisible);
    testSurvey.clearCookie();

    /* Should only display invitations where regexp patterns matches. */
    testSurvey = new SurveyInvitations.Survey({visibleAt: /some\/path/}, 'http://example.com/another/path');
    assertFalse(testSurvey.isVisible);
    testSurvey.clearCookie();

    /* Should be able to have a list of url matching regexps. */
    testSurvey = new SurveyInvitations.Survey({visibleAt: [/some\/path/,/another\/path/]}, 'http://example.com/some/path');
    assertTrue(testSurvey.isVisible);

};

SurveyConfigTest.prototype.testMultipleSurveyConfig = function() {
    /* Clear cookie for this survey first */
    var testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.uio.no/path1/path2');
    testSurvey.clearCookie();

    /* Should detect which url's the should have user surveys displayed. */
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);

    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);

    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path3/path4');
    assertFalse(testSurvey.isVisible);

    /* Should use current window href if no href is passed as parameter */
    testSurvey = new SurveyInvitations.Survey(test_surveys_config);
    assertFalse(testSurvey.isVisible);
};

SurveyConfigTest.prototype.testCookies = function() {
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    testSurvey.clearCookie();
    var cookieName = testSurvey.getCookieName();

    /* Should set a date if ask again button is clicked */
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);
    testSurvey.askAgainIn(7,'days');
    assertFalse( SurveyInvitations.CookieUtils.read(cookieName) === 'never' );

    /* Should not display dialogbox after user has clicked no and dialog box has been closed. */
    testSurvey.clearCookie();
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);
    testSurvey.closeDialog();
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertFalse(testSurvey.isVisible);
    assertTrue( SurveyInvitations.CookieUtils.read(cookieName) === 'never' );

    /* Should not display popup after survey has been displayed (in separate tab) */
    testSurvey.clearCookie();
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);
    testSurvey.openSurvey();
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertFalse(testSurvey.isVisible);

    /* Should show popup if display_uio_survey date has been passed */
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    testSurvey.askAgainIn(-1,'days');
    testSurvey = new SurveyInvitations.Survey(test_surveys_config, 'http://www.sv.uio.no/path1/path2');
    assertTrue(testSurvey.isVisible);
};

SurveyConfigTest.prototype.testFrequency = function() {
    // Should ony show popup between 30 and 75 times out of 100 requests when
    // percentageOf = 'page_request' and frequencyPercent = 50.
    var testSurvey = new SurveyInvitations.Survey();
    testSurvey.clearCookie();
    var popup_displayed_count = 0;
    for(var i=0;i<100;i++) {
        testSurvey = new SurveyInvitations.Survey({percentageOf: 'page_request', frequencyPercent: 50});
        if( testSurvey.isVisible === true){
            popup_displayed_count = popup_displayed_count + 1;
        }
    }
    assertTrue(popup_displayed_count > 30);
    assertTrue(popup_displayed_count < 75);
};


SurveyConfigTest.prototype.testFrequencyVisitors = function() {
    /* Should ony show popup 0 or 1 time. */
    var testSurvey = new SurveyInvitations.Survey();
    testSurvey.clearCookie();
    var popup_displayed_count = 0;
    for(var i=0;i<100;i++) {
        testSurvey = new SurveyInvitations.Survey({percentageOf: 'visitors', frequencyPercent: 100});
        if( testSurvey.isVisible === true){
            popup_displayed_count = popup_displayed_count + 1;
        }
    }
    assertTrue(popup_displayed_count < 2);
};

SurveyConfigTest.prototype.testStartDateSet = function() {
    // Survey doesn't start until tomorrow.
    var startDate = new Date(new Date().setDate( new Date().getDate() + 1));
    var testSurvey = new SurveyInvitations.Survey({startDate: startDate});
    testSurvey.clearCookie();
    assertFalse( testSurvey.isVisible );
};

SurveyConfigTest.prototype.testEndDateSet = function() {
    // Survey ended yesterday.
    var endDate = new Date(new Date().setDate( new Date().getDate() - 1));
    var testSurvey = new SurveyInvitations.Survey({endDate: endDate});
    testSurvey.clearCookie();
    assertFalse( testSurvey.isVisible );
};

