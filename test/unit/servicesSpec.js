'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  
  beforeEach(module('starter.controllers'));

  var $httpBackend;
  var $rootScope;
  var createController;
  var rssJsonRequestHandler;
  var categoriesRequestHandler;
  var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?' +
        		'v=1.0&num=100&callback=JSON_CALLBACK&q=';
  var getRssFeedUrl = function (url) {
  	return googleUrl + encodeURIComponent(url);
  };
  var FEED_SENASTE = 'http://bubb.la/rss/nyheter';
  var FEED_VARLDEN = 'http://bubb.la/rss/varlden';
  var FEEDS_JSON_URL = 'http://bubb.la/rss_feeds.json';

  var categoryResponse = {
    "Senaste": "http://bubb.la/rss/nyheter",
    "Världen": "http://bubb.la/rss/varlden",
    "Sverige": "http://bubb.la/rss/sverige",
    "Blandat": "http://bubb.la/rss/blandat",
    "Europa": "http://bubb.la/rss/europa",
    "USA": "http://bubb.la/rss/usa",
    "Politik": "http://bubb.la/rss/politik",
    "Ekonomi": "http://bubb.la/rss/ekonomi",
    "Teknik": "http://bubb.la/rss/teknik",
    "Vetenskap": "http://bubb.la/rss/vetenskap"
  };

  var fakeRssJsonResponse = {
   				"responseData": {
   					"feed":{
   						"feedUrl": FEED_SENASTE,
   						"title":"bubb.la",
   						"link":"http://bubb.la/",
   						"author":"",
   						"description":"",
   						"type":"rss20",
   						"entries":[
   							{
	   							"title":"SVT: Transportstyrelsen stoppar brandsläckningshjälp från Frankrike, kräver särskild dokumentation",
	   							"link":"http://www.svt.se/nyheter/live/storbrand-utom-kontroll?pid\u003d123165634",
	   							"author":"Martin Eriksson",
	   							"publishedDate":"Tue, 05 Aug 2014 17:10:00 -0700",
	   							"contentSnippet":"",
	   							"content":"",
	   							"categories":["Sverige"]
	   						},
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
   				};

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    rssJsonRequestHandler = $httpBackend.whenJSONP(getRssFeedUrl(FEED_SENASTE));
    rssJsonRequestHandler.respond(fakeRssJsonResponse);	
	categoriesRequestHandler = $httpBackend.whenGET(FEEDS_JSON_URL);
	categoriesRequestHandler.respond(JSON.stringify(categoryResponse));
    $rootScope = $injector.get('$rootScope');
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
  		$httpBackend.expectGET(FEEDS_JSON_URL);
  		$httpBackend.expectJSONP(getRssFeedUrl(FEED_SENASTE));
  		FeedService.init();
  		$httpBackend.flush();
  		expect(FeedService.getCategories()).toContain("Senaste");
  		expect(FeedService.getCategories()).toContain("Världen");
	}));

  	it('should at least have the Senaste category', inject(function(FeedService) {
  		categoriesRequestHandler.respond("{}");
  		$httpBackend.expectGET(FEEDS_JSON_URL);
  		$httpBackend.expectJSONP(getRssFeedUrl(FEED_SENASTE));
  		FeedService.init();
  		$httpBackend.flush();
  		expect(FeedService.getCategories()).toEqual(["Senaste"]);
	}));

  	it('should at least have the Senaste category even when error', inject(function(FeedService) {
  		categoriesRequestHandler.respond(404, "");
  		$httpBackend.expectGET(FEEDS_JSON_URL);
  		$httpBackend.expectJSONP(getRssFeedUrl(FEED_SENASTE));
  		FeedService.init();
  		$httpBackend.flush();
  		expect(FeedService.getCategories()).toEqual(["Senaste"]);
	}));

  	it('should fetch the correct page', inject(function(FeedService) {
  		$httpBackend.expectGET(FEEDS_JSON_URL);
  		$httpBackend.expectJSONP(getRssFeedUrl(FEED_SENASTE));
  		FeedService.init();
  		$httpBackend.flush();
		FeedService.getEntries("Senaste").then(function (entries) {
	  		expect(entries.length).toBe(2);
  		});
  		$httpBackend.flush();
  		$httpBackend.expectJSONP(getRssFeedUrl(FEED_VARLDEN));
  		$httpBackend.whenJSONP(getRssFeedUrl(FEED_VARLDEN))
  			.respond(fakeRssJsonResponse);
  		FeedService.getEntries("Världen").then(function (entries) {
	  		expect(entries.length).toBe(2);
  		});
  		$httpBackend.flush();
	}));

  });
});
