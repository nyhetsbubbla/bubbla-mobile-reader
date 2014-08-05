'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  
  beforeEach(module('starter.controllers'));

  var $httpBackend;
  var $rootScope;
  var createController;
  var rssJsonRequestHandler;
  var categoriesRequestHandler;

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
	var url = 'http://bubb.la/rss/nyheter';
	var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?' +
      		'v=1.0&num=100&callback=JSON_CALLBACK&q=';
	var fullUrl = googleUrl + encodeURIComponent(url);
    rssJsonRequestHandler = 
    	$httpBackend.whenJSONP(fullUrl)
   			.respond({
   				"responseData": {
   					"feed":{
   						"feedUrl":"http://bubb.la/rss/nyheter",
   						"title":"bubb.la",
   						"link":"http://bubb.la/",
   						"author":"",
   						"description":"",
   						"type":"rss20",
   						"entries":[{
   							"title":"SVT: Transportstyrelsen stoppar brandsläckningshjälp från Frankrike, kräver särskild dokumentation",
   							"link":"http://www.svt.se/nyheter/live/storbrand-utom-kontroll?pid\u003d123165634",
   							"author":"Martin Eriksson",
   							"publishedDate":"Tue, 05 Aug 2014 17:10:00 -0700",
   							"contentSnippet":"",
   							"content":"",
   							"categories":["Sverige"]},
   							{
   								"title":"Israel uppmanar FN att ta över Gaza",
   								"link":"http://www.ft.com/intl/cms/s/0/4518a2f6-1bdf-11e4-adc7-00144feabdc0.html#axzz39WpdLWej",
   								"author":"Klas Hjort",
   								"publishedDate":"Tue, 05 Aug 2014 16:40:00 -0700",
   								"contentSnippet":"",
   								"content":"",
   								"categories":["Världen"]
   							}]
   						}
   					}
   				});
	categoriesRequestHandler =
		$httpBackend.whenGET('http://bubb.la/rss_feeds.json')
			.respond({"Senaste": "http://bubb.la/rss/nyheter"});

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('MyController', {'$scope' : $rootScope });
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('FeedService', function() {
    it('should return current version', inject(function(FeedService) {
      expect(FeedService.version()).toEqual('0.1');
    }));

  	it('should fetch the news page', inject(function(FeedService) {
  		var url = 'http://bubb.la/rss/nyheter';
  		var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?' +
      		'v=1.0&num=100&callback=JSON_CALLBACK&q=';
  		$httpBackend.expectJSONP(googleUrl + encodeURIComponent(url));
  		FeedService.init();
  		$httpBackend.flush();
	}));

  });
});
