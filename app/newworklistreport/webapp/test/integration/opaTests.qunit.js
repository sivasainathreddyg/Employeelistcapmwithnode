sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'newworklistreport/test/integration/FirstJourney',
		'newworklistreport/test/integration/pages/Interactions_HeaderList',
		'newworklistreport/test/integration/pages/Interactions_HeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, Interactions_HeaderList, Interactions_HeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('newworklistreport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheInteractions_HeaderList: Interactions_HeaderList,
					onTheInteractions_HeaderObjectPage: Interactions_HeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);