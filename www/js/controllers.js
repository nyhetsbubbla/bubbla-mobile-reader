angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, FeedService) {
  $scope.categories = FeedService.getCategories();
})

.controller('BubbelCtrl', function($scope, $stateParams, $window, FeedService) {
  var pageId = $stateParams.pageId;
  $scope.title = (pageId === "nyheter") ? "Senaste" : pageId;
  $scope.entries = FeedService.getEntries(pageId);

  var openUrl = function (prefix, relativeUrl) {
    var url = prefix + relativeUrl;
    console.log("loading page: " + url);
    // $window.open(link, "_blank", "location=no");
    // $window.open("googlechrome" + relative, "_system", "location=no");
    return $window.open(url, "_system");
  }

  $scope.showPage = function (link) {
    var relative = link.replace(/.*\/\//, "//");
    var ref = openUrl("", link);
    ref.addEventListener("loaderror", function (event) {
      console.log("Failed to load link " + JSON.stringify(event));
      alert("Failed to load link " + "googlechrome:" + relative);
    });
    ref.addEventListener("loadstart", function (event) {
      console.log("starting load " + JSON.stringify(event));
    });
    ref.addEventListener("loadstop", function (event) {
      console.log("stopping load " + JSON.stringify(event));
    });
  }
})

.factory('FeedServiceResolver', ["FeedService", function (FeedService) {
  return FeedService.init();
}])

.factory('FeedService', ["$http", function ($http) {
  var loadJson = function (url) {
    var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?' +
      'v=1.0&num=100&callback=JSON_CALLBACK&q=';
    var fullUrl = googleUrl + encodeURIComponent(url);
    console.log("loading: " + fullUrl);
    return $http.jsonp(fullUrl);
  };
  var responseData = {};
  var feed = {};
  var categories = {};

  var initCategories = function (entries) {
    var el = entries.length;
    for (var e=0; e<el; e++) {
      var entry = entries[e];
      var cl = entry.categories.length;
      for (var c=0; c<cl; c++) {
        var entryCat = entry.categories[c];
        var cat = categories[entryCat];
        if (!cat) {
          cat = [];
          categories[entryCat] = cat;
        }
        cat.push(entry);
      }
    }
    console.log("Found categories: " + JSON.stringify(categories));
  };

  var me = {};
  me.init = function () {
    var bubblaUrl = "http://bubb.la/rss/nyheter";
    console.log("Loading " + bubblaUrl);
    return loadJson(bubblaUrl)
      .then(function (response) {
        console.log("loadJson response: " + JSON.stringify(response));
        responseData = response.data.responseData;
        feed = responseData.feed;
        if (feed.entries) {
          initCategories(feed.entries);
        }
        return me;
      }, function (reason) {
        console.log("loadJson error: " + reason);
        alert("Failed to load feed from " + bubblaUrl);
      }, function (update) {
        console.log("loadJson notification: " + update);
      });
  };

  me.getEntries = function (pageId) {
    if (pageId && pageId !== "nyheter") {
      return categories[pageId];
    } else {
      return feed.entries;
    }
  };

  me.getCategories = function () {
      return Object.keys(categories);
  };

  return me;
}])

.filter('decode', function(angular) {
    return function(html) {
        var e = angular.element('<div>' + html + '</div>');
        var text = e.text();
        console.log("RES: " + JSON.stringify(text));
        return text;
    };
})
