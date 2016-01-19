'use strict';


angular.module('core').controller('IndexController', ['$scope', '$http', '$sce','$timeout',
    function($scope, $http, $sce, $timeout) {
        $scope.testDataList = [];

        $http.get('data/videoList.json').success(function(data) {
            $scope.testDataList = data.slice(0, 12);
            $scope.teaserDataList = data.slice(0, 3);
            for (var i = 0; i < $scope.teaserDataList.length; i++) {
                $scope.teaserDataList[i].videoURL = $sce.trustAsResourceUrl("http://vis.cse.ust.hk/videos/vislab/" + $scope.teaserDataList[i].videoName);
                $scope.teaserDataList[i].imageURL = $sce.trustAsResourceUrl("http://vis.cse.ust.hk/videos/vislab/" + $scope.teaserDataList[i].imageName);
                $scope.teaserDataList[i].description = $scope.teaserDataList[i].description.split(" ").splice(0,40).join(" ") + "...";
            }
            $scope.firstTeaser = $scope.teaserDataList[0];
            $scope.secondTeaser = $scope.teaserDataList[1];
            $scope.thirdTeaser = $scope.teaserDataList[2];
        });

        $timeout(function(){
                    $("#showcase").awShowcase(
					{
						content_width:			920,
						content_height:			320,
						fit_to_parent:			false,
						auto:					true,
						interval:				8000,
						continuous:				false,
						loading:				true,
						tooltip_width:			200,
						tooltip_icon_width:		32,
						tooltip_icon_height:	32,
						tooltip_offsetx:		18,
						tooltip_offsety:		0,
						arrows:					true,
						buttons:				true,
						btn_numbers:			true,
						keybord_keys:			true,
						mousetrace:				false, /* Trace x and y coordinates for the mouse */
						pauseonover:			true,
						stoponclick:			true,
						transition:				'fade', /* hslide/vslide/fade */
						transition_delay:		0,
						transition_speed:		300,
						show_caption:			'onload', /* onload/onhover/show */
						thumbnails:				false,
						thumbnails_position:	'outside-last', /* outside-last/outside-first/inside-last/inside-first */
						thumbnails_direction:	'vertical', /* vertical/horizontal */
						thumbnails_slidex:		1, /* 0 = auto / 1 = slide one thumbnail / 2 = slide two thumbnails / etc. */
						dynamic_height:			false, /* For dynamic height to work in webkit you need to set the width and height of images in the source. Usually works to only set the dimension of the first slide in the showcase. */
						speed_change:			true, /* Set to true to prevent users from swithing more then one slide at once. */
						viewline:				false, /* If set to true content_width, thumbnails, transition and dynamic_height will be disabled. As for dynamic height you need to set the width and height of images in the source. */
						custom_function:		null /* Define a custom function that runs on content change */
					});}, 1000);


    }
]);
