sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/sbp/emplistfiori/test/integration/FirstJourney',
		'com/sbp/emplistfiori/test/integration/pages/Interactions_HeaderList',
		'com/sbp/emplistfiori/test/integration/pages/Interactions_HeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, Interactions_HeaderList, Interactions_HeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/sbp/emplistfiori') + '/index.html'
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