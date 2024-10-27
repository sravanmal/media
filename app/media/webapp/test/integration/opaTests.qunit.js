sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'sravan/ust/media/test/integration/FirstJourney',
		'sravan/ust/media/test/integration/pages/mediaList',
		'sravan/ust/media/test/integration/pages/mediaObjectPage'
    ],
    function(JourneyRunner, opaJourney, mediaList, mediaObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('sravan/ust/media') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThemediaList: mediaList,
					onThemediaObjectPage: mediaObjectPage
                }
            },
            opaJourney.run
        );
    }
);