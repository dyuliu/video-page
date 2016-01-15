'use strict';


angular.module('core').controller('ProjectSingleController', ['$scope', 'communicator', '$sce', '$location', '$http',
	function($scope, communicator, $sce, $location, $http) {

		var mainPath = window.location.pathname;

		var videoId = $location.search().id;
		// configuration of videogular
		$scope.config = {
			sources: [
				{src: $sce.trustAsResourceUrl("http://vis.cse.ust.hk/videos/group/1.mp4"), type: "video/mp4"},
				{src: $sce.trustAsResourceUrl("http://vis.cse.ust.hk/videos/group/1.mp4"), type: "video/webm"},
				{src: $sce.trustAsResourceUrl("http://vis.cse.ust.hk/videos/group/1.mp4"), type: "video/ogg"}
			],
			tracks: [
				{
					src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
					kind: "subtitles",
					srclang: "en",
					label: "English",
					default: ""
				}
			],
			theme: "lib/videogular-themes-default/videogular.css",
			plugins: {
                controls: {
                    autoHide: true,
                    autoHideTime: 2000
                }
            }
		};

		$scope.vgPlayerReady = function($API) {
			$scope.videoAPI = $API;
		};	

		// when select video
		// $scope.setSelected = function(video) {
		// 	if ($scope.videoAPI) $scope.videoAPI.stop();
		// 	$scope.selectedVideoId = video.id;
		// 	$http.get(mainPath + 'getQuestions?vid=' + video.id).success(function(data){
		// 		angular.forEach(data, function(d){
		// 			d.hasShown = false;
		// 			d.answerTimes = 0;
		// 		});
		// 		$scope.questions = data;
		// 		$scope.config.sources = [
	 //              {src: $sce.trustAsResourceUrl(video.url), type: "video/mp4"},
	 //              {src: $sce.trustAsResourceUrl(video.url), type: "video/webm"},
	 //              {src: $sce.trustAsResourceUrl(video.url), type: "video/ogg"}
	 //            ];
		// 	});
  //           $cookieStore.put('selectedVideo', video);
		// 	getComments();
		// };

		// when action[seeked, rateChanged, play, pause] take
		communicator.onActionMessage($scope, function(mes){
			mes.eventTimestamp = (new Date()).valueOf();
			mes.videoId = videoId;
			$http.post(mainPath + 'saveAction', {'item': mes});
		});

	}
]);