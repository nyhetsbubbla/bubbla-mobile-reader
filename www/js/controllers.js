angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('BubbelCtrl', function($scope, $stateParams, $window, FeedService) {
  var pageId = $stateParams.pageId;
  $scope.title = ""
  $scope.items = [];
  var bubblaUrl = "http://bubb.la/rss/" + pageId;
  console.log("Loading " + bubblaUrl);
  FeedService.loadJson(bubblaUrl)
    .success(function (response) {
      console.log("loadJson response: " + JSON.stringify(response));
      var feed = response.responseData.feed;
      $scope.title = feed.title;
      $scope.entries = feed.entries;
    })
    .error(function (error) {
      console.log("loadJson error: " + error);
      alert("Failed to load feed for " + pageId);
    });

  $scope.showPage = function (link) {
    console.log("loading page: " + link);
    $window.open(link, "_blank");
  }
})

.factory('FeedService', ["$http", function ($http) {
  return {
    loadJson: function (url) {
      var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?' +
        'v=1.0&num=100&callback=JSON_CALLBACK&q=';
      var fullUrl = googleUrl + encodeURIComponent(url);
      console.log("loading: " + fullUrl);
      return $http.jsonp(fullUrl);
    }
  }
}])

.filter('decode', function(angular) {
    return function(html) {
        var e = angular.element('<div>' + html + '</div>');
        var text = e.text();
        console.log("RES: " + JSON.stringify(text));
        return text;
    };
})
