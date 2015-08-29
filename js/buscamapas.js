var id_feature_map = new Array();
var xmin, ymin, xmax, ymax;

function getLang(){
	 var lang = "en";
	 if(navigator
		 && navigator.userAgent
	     && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
	        lang = lang[1];
	 }

	 if (!lang && navigator) {
	        if (navigator.language) {
	            lang = navigator.language;
	        } else if (navigator.browserLanguage) {
	            lang = navigator.browserLanguage;
	        } else if (navigator.systemLanguage) {
	            lang = navigator.systemLanguage;
	        } else if (navigator.userLanguage) {
	            lang = navigator.userLanguage;
	        }
	        lang = lang.substr(0, 2);
	 }
	 return lang;
}

var language = getLang();

/*mobile detection*/
//var uaparser = new UAParser();
//var device = uaparser.getDevice();
/*
var isTabletOrMobile = false;
if(device.type){
	if(device.type == "mobile" || device.type == "tablet"){
		isTabletOrMobile = true;
	}
}
*/
//para apps
var isTabletOrMobile = true;

/*app logic*/

var ajaxRequest;

var data;

var _storage;

if(typeof(Storage)!=="undefined") {
  _storage =  localStorage;  
};

var imgs = [
			"./img/hiking_1_g.jpg",
			"./img/hiking_2_g.jpg",
			"./img/hiking_3_g.jpg"
];

var appTitle = "";
var seeMoreTxt = "";
var noSearchString = "";
var noResultsFound = "";

var wehavefound = "";
var mapsandtrails = "";
var forthesearch = "";
var nearcoordinates = "";
var takemethere = "";

var functionNotSupported = "";
var nofavs = "";
var delfav = "";

var downloading = "";
var already_exists = "";
var download_finished = "";

var takeAlookAt = "";
var downloadHikingTrailsAt = "";
var onlyWhatsApp = "";
var distance = "";
var routeLength = "";

var dureza = "";
var desnivel = "";

var moreAboutHardIndex = "";
var difficulty_index_description_1 = "";
var difficulty_index_description_2 = "";
var difficulty_index_description_3 = "";

var no_filters_applied = "";
var default_order_txt = "";
var order_by_proximity = "";
var order_by_length = "";
var order_by_difficulty = "";
var order_by_ramp = "";
var asc_direction = "";
var desc_direction = "";



var txtInitialized = false;

var mapsArray = [];

var lastStart = 0;

var map;

var currentLayer =  null;

var jqPlot = null;

var maxProfileLength = -10000;

var pointMinH;
var pointMaxH;

var dh;
var meanH;
var meanAspect;
var minAspect;
var maxAspect;
var hardIndex;

var MAX_LENGTH = 40000;
var MAX_DESNIVEL = 1200;
var MAX_HARD_INDEX = 110;

var DEFAULT_SORT_FIELD = "Square_Dist";
var DEFAULT_SORT_DIRECTION = "ASC";
/**
 * Filter object
 */
function Filter(){
	this.min_length = 0;
	this.max_length = MAX_LENGTH;
	
	this.min_desnivel = 0;
	this.max_desnivel = MAX_DESNIVEL;
	
	this.min_hard_index = 0;
	this.max_hard_index = MAX_HARD_INDEX;
	
	this.sort_field = DEFAULT_SORT_FIELD;
	this.sort_direction = DEFAULT_SORT_DIRECTION;
}

Filter.prototype.setSortField = function(sortField){
	this.sort_field = sortField;
};

Filter.prototype.getSortField = function(){
	return this.sort_field;
};

Filter.prototype.setSortDirection = function(sortDirection){
	this.sort_direction = sortDirection;
};

Filter.prototype.getSortDirection = function(){
	return this.sort_direction;
};

Filter.prototype.isEmptyFilter = function(){
	return (this.min_length == 0) && (this.max_length == MAX_LENGTH) && 
			(this.min_desnivel == 0) && (this.max_desnivel == MAX_DESNIVEL) &&
			(this.min_hard_index == 0) && (this.max_hard_index == MAX_HARD_INDEX) &&
			(this.sort_field == DEFAULT_SORT_FIELD) && (this.sort_direction == DEFAULT_SORT_DIRECTION);
};

Filter.prototype.equals = function(aFilter){
	return this.min_length == aFilter.min_length &&
			this.max_length == aFilter.max_length &&
			this.min_desnivel == aFilter.min_desnivel &&
			this.max_desnivel == aFilter.max_desnivel &&
			this.min_hard_index == aFilter.min_hard_index &&
			this.max_hard_index == aFilter.max_hard_index &&
			this.sort_field == aFilter.sort_field &&
			this.sort_direction == aFilter.sort_direction;
};

Filter.prototype.setMinLength = function(min_length){
	this.min_length = min_length;
};

Filter.prototype.getMinLength = function(){
	return (this.min_length * 1000);
};

Filter.prototype.setMaxLength = function(max_length){
	this.max_length = max_length;
};

Filter.prototype.getMaxLength = function(){
	return (this.max_length * 1000);
};

Filter.prototype.setMinDesnivel = function(min_desnivel){
	this.min_desnivel = min_desnivel;
};

Filter.prototype.getMinDesnivel = function(){
	return this.min_desnivel;
};

Filter.prototype.setMaxDesnivel = function(max_desnivel){
	this.max_desnivel = max_desnivel;
};

Filter.prototype.getMaxDesnivel = function(){
	return this.max_desnivel;
};

Filter.prototype.setMinHardIndex = function(min_hard_index){
	this.min_hard_index = min_hard_index;
};

Filter.prototype.getMinHardIndex = function(){
	return this.min_hard_index;
};

Filter.prototype.setMaxHardIndex = function(max_hard_index){
	this.max_hard_index = max_hard_index;
};

Filter.prototype.getMaxHardIndex = function(){
	return this.max_hard_index;
};

Filter.prototype.toString = function(){
	var solution = "";
	if(	this.min_length == 0 && 
		this.max_length == MAX_LENGTH &&
		this.min_desnivel == 0 &&
		this.max_desnivel == MAX_DESNIVEL &&
		this.min_hard_index == 0 &&
		this.max_hard_index == MAX_HARD_INDEX &&
		this.sort_field == DEFAULT_SORT_FIELD &&
		this.sort_direction == DEFAULT_SORT_DIRECTION){
		
		solution = no_filters_applied;
		solution += default_order_txt;
		return solution;
	}else{
	
		if(this.min_length > 0){
			//solution += "Distancia > "+this.min_length + " km.<br>";
			solution += distance + " > "+this.min_length + " km.<br>";
		}
		
		if(this.max_length != MAX_LENGTH){
			//solution += "Distancia < "+this.max_length + " km.<br>";
			solution += distance + " < "+this.max_length + " km.<br>";
		}
		
		if(this.min_desnivel > 0){
			//solution += "Desnivel > "+this.min_desnivel + " m.<br>";
			solution += desnivel + " > "+this.min_desnivel + " m.<br>";
		}
		
		if(this.max_desnivel != MAX_DESNIVEL){
			//solution += "Desnivel < "+this.max_desnivel + " m.<br>";
			solution += desnivel  + " < "+this.max_desnivel + " m.<br>";
		}
		
		if(this.min_hard_index > 0){
			//solution += "Dureza > "+this.min_hard_index + " .<br>";
			solution += dureza + " > "+this.min_hard_index + " .<br>";
		}
		
		if(this.max_hard_index != MAX_HARD_INDEX){
			//solution += "Dureza < "+this.max_hard_index + " .<br>";
			solution += dureza + "< "+this.max_hard_index + " .<br>";
		}
		if(this.sort_field == "Square_Dist"){
			solution += order_by_proximity;
		}else if(this.sort_field == "LINE_LENGTH"){
			solution += order_by_length;
		}else if(this.sort_field == "HARD_INDEX"){
			solution += order_by_difficulty;
		}else if(this.sort_field == "DESNIVEL"){
			solution += order_by_ramp;
		}
		
		if(this.sort_direction == "ASC"){
			solution += asc_direction;
		}else{
			solution += desc_direction;
		}
		
		return solution;
	}
}

var filter = new Filter();


/**
Last search cache
*/
function LastSearch(){
	this.lastStart = 0;
	this.lastListView = "";
	this.numRows = 0;
	this.mapsArray = null;
	this.txt = "";
	
	this.filter = null;
}

LastSearch.prototype.setLastStart = function(lastStart){
	this.lastStart = lastStart;
};

LastSearch.prototype.setFilter = function(filter){
	this.filter = filter;
};

LastSearch.prototype.setLastListView = function(lastListView){
	this.lastListView = lastListView;	
};

LastSearch.prototype.setNumRows = function(numRows){
	this.numRows = numRows;	
};

LastSearch.prototype.setMapsArray = function(mapsArray){
	this.mapsArray = mapsArray;	
};

LastSearch.prototype.setTxt = function(txt){
	this.txt = txt;	
};

LastSearch.prototype.toString = function(txt){
};

var lastTextSearch = new LastSearch();

/*
Disqus functions
*/
var params;
var disqus_url;
var disqus_title;
var disqus_shortname;
var disqus_identifier;

var disqus_config = function () {
	if(language == "es")
		this.language = "es_ES";
	else
		this.language = language;
};


function onDeviceReady(){
	
	$(document).on("pagebeforecreate", function () {	
		pagebeforecreate();
	});//on("pagebeforecreate"
			
	$(document).on( "pageinit", "#search-maps", function() {
		initSearchMaps();
	});//on( "pageinit", "#search-maps"
	
	$(document).on( "pagebeforeshow", "#search-maps", function(e,data) {
		showFiltersText();
	});
			
	$(document).on( "pagebeforeshow", "#search-maps-results", function(e,data) {
		initSearchMapsResults();
	});//on( "pagebeforeshow", "#search-maps-results"
			
	$(document).on( "pagebeforeshow", "#fav-results", function(e,data) {
		favResults();
	});//on( "pagebeforeshow", "#fav-results"
			
	$(document).on( "pagebeforeshow", "#maps-around-results", function(e,data) {
		mapsAroundResults();
	});//on( "pagebeforeshow", "#maps-around-results"


	prepareMapPageShow();  


	
	$(document).on( "pagebeforeshow", "#description", function(e,_data) {
		showMapDescription();	  
	});

	$(document).on( "pageshow", "#elevation_profile", function(e,_data) {
		showElevationProfile();
	});
	
	$(document).on( "pageshow", "#filters", function(e,_data) {
		showFilters();
	});

	$(document).on( "pagebeforeshow", "#disqus", function(e,_data) {
		showDisqusPage();
	});
	
}//onDeviceReady

function initTextsAndBgImages(){
	var randombg = Math.floor(Math.random()*3); // 0 to 2
	var url = "url("+imgs[randombg]+")";

	var menucontent = $("#menu-content.ui-content");
	menucontent.css('background-image', url);
	menucontent.css('background-repeat', 'no-repeat');
	menucontent.css('background-attachment', 'fixed');

	//Todo cambiar la imagen de fondo segun la pantalla
	var search = $("#search-maps-content.ui-content");
	search.css('background-image', url);
	search.css('background-repeat', 'no-repeat');
	search.css('background-attachment', 'fixed');
	search.css('background-size', 'cover');
	
	
	$.i18n.init({ lng: language, debug: false, resGetPath: localesPath , fallbackLng: 'en' }).done(function () {
	  	  	  	//main menu
        		$("#app_title").i18n();
        		$("#app_welcome").i18n();
        		$("#buscar-mapas").i18n();
        		$("#around-you").i18n();
        		$("#see-favs").i18n();
        		
        		$('#buscar-mapas').buttonMarkup({ icon: "search" });
        		$('#around-you').buttonMarkup({ icon: "location" });
        		$('#see-favs ').buttonMarkup({ icon: "star" });

				//search maps
        		$('#home-button').buttonMarkup({ icon: "home" }); 
        		$('#home-button').attr("href", "#main-menu"); 

        		$("#buscar-mapas-title").i18n();
        		$("#buscar-por-ciudad-title").i18n();
        		$('#search-criteria').attr("data-clear-btn", "true"); 
        		$("#search-button").i18n();

        		//search maps result
        		$("#buscar-mapas-result-title").i18n();
        		$('#back-button').buttonMarkup({ icon: "arrow-l" }); 
        		$('#back-button').attr("href", "#search-maps"); 

        		$("#home-button").i18n();

        		//maps around results
        		$("#maps-around-result").i18n();

        		//favs list
        		$('#home-button-3').i18n();
        		$("#favs-header").i18n();

        		//footer buttons
        		$('#menu-button').buttonMarkup({ icon: "bars" }); 
				$('#menu-button').i18n();
				$('#menu-button-2').i18n();
				$('#menu-button-3').i18n();
				$('#menu-button-4').i18n();
				$('#menu-button-5').i18n();

				//about us
				
				$('#about_us_header').i18n();
				$('#about_us_content').i18n();

				//map tools bar
				$('#map_info').css("height","2.5em");
				$('#map_info').css("width","2.5em");
				

				$('#map_disqus').css("height","2.5em");
				$('#map_disqus').css("width","2.5em");	

				$('#fav').css("height","2.5em");
				$('#fav').css("width","2.5em");	

				$('#download').css("height","2.5em");
				$('#download').css("width","2.5em");	

				$('.large_button').css("height","2em");
				$('.large_button').css("width","2em");

				//elevation profile dialog
				$('#elevation_profile_title').i18n();
				$('#str_trails_length').i18n();
				$('#str_difficulty_index').i18n();
				$('#str_ramp').i18n();
				$('#str_hmax').i18n();
				$('#str_hmin').i18n();
				$('#str_hmedia').i18n();
				$('#str_maxaspect').i18n();
				$('#str_minaspect').i18n();
				$('#str_avgaspectup').i18n();
				$('#str_avgaspectdown').i18n();

				//more about difficulty index
				$('#more_about_hard_idx_title').i18n();

				difficulty_index_description_1 = i18n.t("app.difficulty_index_description_1");
				difficulty_index_description_2 = i18n.t("app.difficulty_index_description_2");
				difficulty_index_description_3 = i18n.t("app.difficulty_index_description_3");
				
				
				//filters dialog
				$('#filters-title').i18n();
				$('#filters-h3').i18n();
				$('#filter-distance-1').i18n();
				$('#filter-distance-2').i18n();
				$('#filter-desnivel-1').i18n();
				$('#filter-desnivel-2').i18n();
				$('#filter-dureza-1').i18n();
				$('#filter-dureza-2').i18n();
				$('#sort-h3').i18n();
				$('#sort-dist').i18n();
				$('#sort-length').i18n();
				$('#sort-hard').i18n();
				$('#sort-desnivel').i18n();
				$('#sort-asc').i18n();
				$('#sort-desc').i18n();
				$('#filter-ok').i18n();
				$('#filter-delete').i18n();
				
				//menus
				$('#map_panel_general_title').i18n();
				
				$('#home-button-menu').i18n();
				$('#home-button-menu').buttonMarkup({icon:"home"});
				$('#about-button-menu').i18n();
				$('#about-button-menu').buttonMarkup({icon:"mail"});

				
				$('#map_panel_tools_title').i18n();
				$('#whatsapp').i18n();
				$('#whatsapp').buttonMarkup({icon:"share-square"});
				$('#whatsapp').css("white-space", "normal"); 

			
				$('#gps').i18n();
				$('#gps').buttonMarkup({icon:"location-arrow"});


				$('#fav2').i18n();
				$('#fav2').buttonMarkup({icon:"star"});
				
				$('#close_map_panel').i18n();

				//panel 2
				$('#menu_panel_general_title').i18n();
				$('#home-button-menu2').i18n();
				$('#home-button-menu2').buttonMarkup({icon:"home"});
				$('#about-button-menu2').i18n();
				$('#about-button-menu2').buttonMarkup({icon:"mail"});

				$('#menu_panel_share_title').i18n();
				$('#whatsapp2').i18n();
				$('#whatsapp2').buttonMarkup({icon:"share-square"});
				$('#whatsapp2').css("white-space", "normal"); 
				$('#close_menu_panel').i18n();

				//disqus
				$("#comment-the-map").i18n();
				
				//refresh menus listviews
				//panel 1
				$('#map_panel_listview').attr("data-role", "listview").listview().trigger("updatelayout");
				$('#tools_listview').attr("data-role", "listview").listview().trigger("updatelayout");

				//panel 2
				$('#menu_panel_listview').attr("data-role", "listview").listview().trigger("updatelayout");
				$('#share_listview').attr("data-role", "listview").listview().trigger("updatelayout");
				
				//General texts (dynamic)
				appTitle = i18n.t("app.app_title_url_friendly");
        		seeMoreTxt = i18n.t("app.see-more");

        		noSearchString = i18n.t("app.no-search-string");

        		noResultsFound = i18n.t("app.no-results-found");

        		wehavefound = i18n.t("app.we-have-found");
        		mapsandtrails = i18n.t("app.maps-trails");
        		forthesearch = i18n.t("app.for-the-search");
        		nearcoordinates = i18n.t("app.near-coordinates");
        		takemethere = i18n.t("app.take-me-there");

        		functionNotSupported = i18n.t("app.function-not-supported");
        		nofavs = i18n.t("app.no-favorites");
        		delfav = i18n.t("app.del-fav");
        		
        		downloading = i18n.t("app.Downloading");
        		already_exists = i18n.t("app.Already_exists");
        		download_finished = i18n.t("app.download_finished");	

        		takeAlookAt = i18n.t("app.take_a_look_at");
        		downloadHikingTrailsAt = i18n.t("app.download_hiking_trails_at");
        		onlyWhatsApp = i18n.t("app.only_whatsapp_mobiles");
        		distance = i18n.t("app.distance");
        		routeLength = i18n.t("app.length");
        		dureza = i18n.t("app.difficulty");
        		desnivel = i18n.t("app.elevation_gain");
        		
        		no_filters_applied = i18n.t("app.no_filters_applied");
        		default_order_txt = i18n.t("app.default_order_txt");
        		order_by_proximity = i18n.t("app.order_by_proximity");
        		order_by_length = i18n.t("app.order_by_length");
        		order_by_difficulty = i18n.t("app.order_by_difficulty");
        		order_by_ramp = i18n.t("app.order_by_ramp");
        		asc_direction = i18n.t("app.asc_direction");
        		desc_direction = i18n.t("app.desc_direction");
        		
        		moreAboutHardIndex = i18n.t("app.more_about_difficulty_index"); 
        		$('#more_about_hard_idx_title_2').i18n();
    		});//i18n
}




function muestraLoading(activar){
	// Si la entrada es true, mostramos el icono de loading
	if(activar)
	{
		$.mobile.loading( 'show', {
			text: 'Buscando mapas',
			textVisible: true,
			theme: 'b',
			html: ''
		});
	}else
	{
		$.mobile.loading( 'hide' );
	}
}

function setFav(button){
  if(_storage){
	   var favs;
	   if(_storage.favs){
		   favs = jQuery.parseJSON( _storage.favs );
	   }else{
		   	favs = [];
	   }
	   var index = favs.indexOf(data.friendly_url);
	   if(index == -1){
	  	 favs.push(data.friendly_url);
	  	 if(button != null)
	  	 button.buttonMarkup({ icon: "check" , theme: "b"});
	
	   }else{
		  favs.splice(index, 1);
		  if(button != null)
		  button.buttonMarkup({ icon: "star", theme: "a" });
	   }
	   var favs_str = JSON.stringify(favs);
	   _storage.favs = favs_str;
    }
}

function loadMap(dataArray){
	data = dataArray;

	var type = data.map_type;
	var url = data.friendly_url;

	//dataUrlStr = "#map_page?type="+type+"&map="+url;

	var pageData = {'type':type, 'map':url};

	
	$.mobile.changePage("#map_page", 
			{ 
			reloadPage : false, 
			changeHash : true,
			//dataUrl: dataUrlStr,
			pageData: pageData
			}
	);
}

/*
favs functions
*/

function getMapInfo(friendlyurl, callBackFunction){
	var aUrl = BACK_END_SERVER +"/mapas_api/getmapinfo/"+GEO_TABLE+"/es/"+friendlyurl;
	ajaxRequest = $.ajax({
		url:aUrl 
	});
	ajaxRequest.then( function (response) {
		
		if(response.length > 0){
			var friendlyUrl = response[0].FRIENDLY_URL;
			var serviceUrl = response[0].SERVICE_URL;
			var bbox = response[0].wkt_bbox;
			var title = response[0].TITLE;
			var description = response[0].DESCRIPTION;
			var mapType = response[0].MAP_TYPE;
			
			var area = response[0].AREA;
			var producer = response[0].PRODUCER;
			var pk_id = response[0].PK_ID;
			var line_length = response[0].LINE_LENGTH / 1000.0;
			var min_h = response[0].MIN_H;
			var max_h = response[0].MAX_H;
			var avg_h = response[0].AVG_H;
			var avg_aspect_up = response[0].AVG_ASPECT_UP;
			var avg_aspect_down = response[0].AVG_ASPECT_DOWN;
			var hard_index = response[0].HARD_INDEX;
			
			
			//changePage params
			var dataArr = {
				'map_type':mapType,
				'service_url':serviceUrl,
				'title':title,
				'description':description,
				'bbox':bbox,
				'friendly_url':friendlyUrl,
				'producer':producer,
				'pk_id':pk_id,
				'area': area,
				'line_length':line_length,
				'min_h':min_h,
				'max_h':max_h,
				'avg_h':avg_h,
				'avg_aspect_up':avg_aspect_up,
				'avg_aspect_down':avg_aspect_down,
				'hard_index':hard_index
			};

			data = dataArr;

			

			if(callBackFunction !== null){
				callBackFunction(friendlyurl, mapType);	
			}
		}
	});

	ajaxRequest.always( function () {
		muestraLoading(false);
	});	
}

function loadFav(friendlyurl){
	muestraLoading(true);
	var aUrl = BACK_END_SERVER +"/mapas_api/getmapinfo/"+GEO_TABLE+"/es/"+friendlyurl;
	ajaxRequest = $.ajax({
		url:aUrl 
	});
	ajaxRequest.then( function (response) {
		if(response.length > 0){
		
			var friendlyUrl = response[0].FRIENDLY_URL;
			var serviceUrl = response[0].SERVICE_URL;
			var bbox = response[0].wkt_bbox;
			var title = response[0].TITLE;
			var description = response[0].DESCRIPTION;
			var mapType = response[0].MAP_TYPE;
			var pk_id = response[0].PK_ID;
			
			var area = response[0].AREA;
			var producer = response[0].PRODUCER;
			var pk_id = response[0].PK_ID;
			var line_length = response[0].LINE_LENGTH / 1000.0;
			var min_h = response[0].MIN_H;
			var max_h = response[0].MAX_H;
			var avg_h = response[0].AVG_H;
			var avg_aspect_up = response[0].AVG_ASPECT_UP;
			var avg_aspect_down = response[0].AVG_ASPECT_DOWN;
			var hard_index = response[0].HARD_INDEX;
			
			var dataArr = {
				'map_type':mapType,
				'service_url':serviceUrl,
				'title':title,
				'description':description,
				'bbox':bbox,
				'friendly_url':friendlyUrl,
				'producer':producer,
				'pk_id':pk_id,
				'area': area,
				'line_length':line_length,
				'min_h':min_h,
				'max_h':max_h,
				'avg_h':avg_h,
				'avg_aspect_up':avg_aspect_up,
				'avg_aspect_down':avg_aspect_down,
				'hard_index':hard_index
			};

			loadMap(dataArr);
		}
	});

	ajaxRequest.always( function () {
		muestraLoading(false);
	});	
	
}

function deleteFav(friendlyUrl, item){
	if(_storage){
		var favs;
		if(_storage.favs){
			favs = jQuery.parseJSON( _storage.favs );
			var index = favs.indexOf(friendlyUrl);
			if(index != -1){
				  favs.splice(index, 1);
				  var favs_str = JSON.stringify(favs);
				  _storage.favs = favs_str;
				 
				item.remove();
				var favsListView = $('#favs-listview');
				favsListView.listview("refresh").trigger("updatelayout");
			   
			}
		}
	}
}


function loadComments(shortname, url, title, identifier) {
	disqus_url = url;
	disqus_title = title;
	disqus_shortname = shortname;
	if (identifier != undefined)
		disqus_identifier = identifier;
	else
		disqus_identifier = "";
	(function() {
		var dsq = document.createElement('script');
		dsq.type = 'text/javascript';
		dsq.async = false;
		dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document
				.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
}


/*
map lists functions
*/
/**
updates <b>mapsArray</b> content with rest service.
counter of range date to request is <b>lastStart</b>
*/
function updateMapListAroundYou(y, x){
	if(filter != null && ! filter.isEmptyFilter()){
		var filterButton = 	$("#filter_button_xy");
		filterButton.css("background","red");
	}else{
		var filterButton = 	$("#filter_button_xy");
		filterButton.css("background","green");
	}
	
	muestraLoading(true);
	if(ajaxRequest && ajaxRequest.readyState != 4)
			ajaxRequest.abort();
	
	var limit = 10;
	var radius = 0.1;
	var resultsListView = $('#maps-around-results-listview');

	var start = lastStart;
	
	var value = y+"*"+x;
	var list = '';
	
	
	
	if(lastTextSearch.txt == value && lastTextSearch.filter.equals(filter)){
		mapsArray = lastTextSearch.mapsArray;
		var numResults = lastTextSearch.numRows;//hay que guardarla en cache???
		lastStart = lastTextSearch.lastStart;
		list = lastTextSearch.lastListView;
	}
	

	var aUrl = BACK_END_SERVER+"/mapas_api/mapascerca/"+GEO_TABLE+"/es/"+x+"/"+y+"/"+radius+"/"+start+"/"+limit;

	if(filter.getMinLength() > 0){
		aUrl += "/" + filter.getMinLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxLength() != MAX_LENGTH){
		aUrl += "/" + filter.getMaxLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMinHardIndex() > 0){
		aUrl += "/" + filter.getMinHardIndex();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxHardIndex() != MAX_HARD_INDEX){
		aUrl += "/" + filter.getMaxLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMinDesnivel() > 0){
		aUrl += "/" + filter.getMinDesnivel();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxDesnivel() != MAX_DESNIVEL){
		aUrl += "/" + filter.getMaxDesnivel();
	}else{
		aUrl += "/nil";
	}
	
	//if(filter.getSortField() != DEFAULT_SORT_FIELD){
	aUrl += "/" + filter.getSortField();
//}

//if(filter.getSortDirection() != DEFAULT_SORT_DIRECTION){
	aUrl += "/" + filter.getSortDirection();
//}
	
		
	    
	ajaxRequest = $.ajax({
		url:aUrl 
	});
			
	ajaxRequest.then( function (response) {
		if(response && response.numrows){
			var numrows = response.numrows;	
			$('#maps-around-result-search').html(wehavefound + " " + numrows + " " + mapsandtrails+" "+nearcoordinates+" '<b><i>"+x.toFixed(5)+" "+y.toFixed(5)+"</i></b>'"); 

			var newindex = 0;
			if(mapsArray)
				newindex = mapsArray.length -1;
					
	         $.each(response.rows, function(index, val) {
		        newindex++;
				var friendlyUrl = val.FRIENDLY_URL;
				var serviceUrl = val.SERVICE_URL;
				var bbox = val.wkt_bbox;
				var title = val.TITLE;
				var description = val.DESCRIPTION;
				var mapType = val.MAP_TYPE;
				
				var dist = Math.sqrt(val.Square_Dist) * 111.12;
				var line_length = val.LINE_LENGTH / 1000.0;
				
				
				var area = val.AREA;
				var producer = val.PRODUCER;
				var pk_id = val.PK_ID;
				var min_h = val.MIN_H;
				var max_h = val.MAX_H;
				var avg_h = val.AVG_H;
				var avg_aspect_up = val.AVG_ASPECT_UP;
				var avg_aspect_down = val.AVG_ASPECT_DOWN;
				var hard_index = val.HARD_INDEX;
				
				
				//changePage params
				var dataArr = {
					'map_type':mapType,
					'service_url':serviceUrl,
					'title':title,
					'description':description,
					'bbox':bbox,
					'friendly_url':friendlyUrl,
					'distance':dist,
					'line_length': line_length,
					'producer':producer,
					'pk_id':pk_id,
					'line_length':line_length,
					'min_h':min_h,
					'max_h':max_h,
					'avg_h':avg_h,
					'avg_aspect_up':avg_aspect_up,
					'avg_aspect_down':avg_aspect_down,
					'hard_index':hard_index
				};
				
				mapsArray.push(dataArr);

				var descr = $(description).text();
				/*
				list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km."+
						'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km.</strong></p></li>';  
                list += '<li >' +
                        '<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+newindex+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
                     	'</li>';
                */
				list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km.<br>"+dureza+": "+hard_index+
					'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km. <br>'+desnivel+': '+(max_h - min_h)+' m.</strong></p></li>';  
               	list += '<li >' +
                    '<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+index+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
                    '</li>';
                
                
	           }); // end each 

	          lastStart += limit;

	          var new_html = list;
	          if(mapsArray.length < response.numrows){
			  	new_html += '<li  data-icon="false">'+
			  				'<a  style="height: 1.5em; font-size:1.5em; text-align:center;background-color:#5cb85c;color:white" href="javascript:updateMapListAroundYou('+y+','+x+')" data-role="button" data-theme="b">' +  seeMoreTxt + '('+ lastStart+' / '+response.numrows+')</a></li>';

	          }//if mapsArray

	          lastTextSearch.txt = value;
              lastTextSearch.mapsArray = mapsArray;
              lastTextSearch.lastListView = list;
              lastTextSearch.lastStart = lastStart;
              lastTextSearch.numRows = response.numrows;
              
              var filterCopy = jQuery.extend({}, filter);
			  lastTextSearch.setFilter(filterCopy);


	          resultsListView.html(new_html).listview("refresh");
			}//if response end
			else{
				resultsListView.html("<li>"+noResultsFound+"</li>").listview("refresh").trigger("updatelayout");
			}
		
	});//if ajaxrequest.then 

	ajaxRequest.always( function () {
		muestraLoading(false);
	});		
}



function updateMapList(){
	
	if(filter != null && ! filter.isEmptyFilter()){
		var filterButton = 	$("#filter_button");
		filterButton.css("background","red");
	}else{
		var filterButton = 	$("#filter_button");
		filterButton.css("background","green");
	}
	
	if(ajaxRequest && ajaxRequest.readyState != 4)
		ajaxRequest.abort();

	
	muestraLoading(true);
	
	var listView = $('#maps-results');
	var value = $('#search-criteria').val();
	if(value == ""  && _storage){
		if(_storage.lastSearch){
			value = _storage.lastSearch;
		}//storage.favs
	}//if value == ""
	

	var list = '';
	
	if(lastTextSearch.txt == value && lastTextSearch.filter.equals(filter)){
		mapsArray = lastTextSearch.mapsArray;
		var numResults = lastTextSearch.numRows;//hay que guardarla en cache???
//Duda: lastStart tiene que ser variable global, o solo a nivel de lastTextSearch??
		lastStart = lastTextSearch.lastStart;
		list = lastTextSearch.lastListView;
	}


	var start = lastStart;
	var limit = 10;
	var aUrl = BACK_END_SERVER+"/mapas_api/mapasen/"+GEO_TABLE+"/es/"+value+"/"+start+"/"+limit;
	
	if(filter.getMinLength() > 0){
		aUrl += "/" + filter.getMinLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxLength() != MAX_LENGTH){
		aUrl += "/" + filter.getMaxLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMinHardIndex() > 0){
		aUrl += "/" + filter.getMinHardIndex();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxHardIndex() != MAX_HARD_INDEX){
		aUrl += "/" + filter.getMaxLength();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMinDesnivel() > 0){
		aUrl += "/" + filter.getMinDesnivel();
	}else{
		aUrl += "/nil";
	}
	
	if(filter.getMaxDesnivel() != MAX_DESNIVEL){
		aUrl += "/" + filter.getMaxDesnivel();
	}else{
		aUrl += "/nil";
	}
	
	//if(filter.getSortField() != DEFAULT_SORT_FIELD){
	aUrl += "/" + filter.getSortField();
//}

//if(filter.getSortDirection() != DEFAULT_SORT_DIRECTION){
	aUrl += "/" + filter.getSortDirection();
//}
	
	
	
	ajaxRequest = $.ajax({
		url:aUrl 
	});
	ajaxRequest.then( function (response) {
		if(response && response.numrows){
			var newindex = 0;
			if(mapsArray)
				newindex = mapsArray.length -1;
			
            $.each(response.rows, function(index, val) {
                    newindex++;
                    
					var friendlyUrl = val.FRIENDLY_URL;
					var serviceUrl = val.SERVICE_URL;
					var bbox = val.wkt_bbox;
					var title = val.TITLE;
					var description = val.DESCRIPTION;
					var mapType = val.MAP_TYPE;
					
					var dist = Math.sqrt(val.Square_Dist) * 111.12;
					var line_length = val.LINE_LENGTH / 1000.0;
					
					var descr = $(description).text();
					
					var area = val.AREA;
	    			var producer = val.PRODUCER;
	    			var pk_id = val.PK_ID;
	    			var min_h = val.MIN_H;
	    			var max_h = val.MAX_H;
	    			var avg_h = val.AVG_H;
	    			var avg_aspect_up = val.AVG_ASPECT_UP;
	    			var avg_aspect_down = val.AVG_ASPECT_DOWN;
	    			var hard_index = val.HARD_INDEX;
					
					
/*
					list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km."+
							'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km.</strong></p></li>';  
	                list += '<li >' +
	                        '<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+newindex+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
	                     	'</li>';
*/	                
	                list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km.<br>"+dureza+": "+hard_index+
					'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km. <br>'+desnivel+': '+(max_h - min_h)+' m.</strong></p></li>';  
	                list += '<li >' +
                     '<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+index+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
                     '</li>';
	                
	                	
	    			//changePage params
	    			var dataArr = {
	    				'map_type':mapType,
	    				'service_url':serviceUrl,
	    				'title':title,
	    				'description':description,
	    				'area':area,
	    				'bbox':bbox,
	    				'friendly_url':friendlyUrl,
	    				'producer':producer,
	    				 'distance':dist,
						 'line_length': line_length,
	    				'pk_id':pk_id,
	    				'line_length':line_length,
	    				'min_h':min_h,
	    				'max_h':max_h,
	    				'avg_h':avg_h,
	    				'avg_aspect_up':avg_aspect_up,
	    				'avg_aspect_down':avg_aspect_down,
	    				'hard_index':hard_index
	    			};
             
					mapsArray.push(dataArr);
	
            }); // end each 

        	lastStart += limit;
			/*
        	if(_storage.prev_listview)
            	list = _storage.prev_listview + list;

        	 _storage.prev_listview = list;
			*/
    		var new_html = list;
            if(mapsArray.length < response.numrows){
    			new_html += '<li  data-icon="false"><a  style="height: 1.5em; font-size:1.5em;; text-align:center;background-color:#5cb85c;color:white" href="javascript:updateMapList(\''+value+'\')" data-role="button" data-theme="b">' +  seeMoreTxt + '('+ lastStart +' / '+response.numrows+')</a></li>';

            }

            lastTextSearch.txt = value;
            lastTextSearch.mapsArray = mapsArray;
            lastTextSearch.lastListView = list;
            lastTextSearch.lastStart = lastStart;
            lastTextSearch.numRows = response.numrows;
            var filterCopy = jQuery.extend({}, filter);
			lastTextSearch.setFilter(filterCopy);
			
            listView.html(new_html).listview("refresh");

       
		}//if response end
	});

	ajaxRequest.always( function () {
		muestraLoading(false);
	});		
}//updateMapList

function showMap(url, type){
	var bboxAsText = data.bbox;

	//hay que sacar las xmin, ymin, xmax, ymax del poligono
	var title = data.title;
	$('#map-title').html(title);
	var description = data.description;
	var xmin, ymin, xmax, ymax;
	if(bboxAsText){
		var wkt = new Wkt.Wkt();
		try{
			wkt.read(bboxAsText);

			var leafletGeom = wkt.toObject();

			var bounds = leafletGeom.getBounds();
			var northEast = bounds.getNorthEast();
			var southWest = bounds.getSouthWest();

			xmin = southWest.lng;
			xmax = northEast.lng;
			ymin = southWest.lat;
			ymax = northEast.lat;
		}catch(e){}
	}//bboxastext

	
	options = {
		'url':url,
		'name':title,
		'description':description,
		"takemethere":takemethere,
		"ismobile":isTabletOrMobile
	};

	if(! map){
		map = L.map('map_container');
		L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		}).addTo(map);
		map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text. Attribution overload
		map.invalidateSize();
		//map.addControl( new L.Control.Gps() );
	}
   getLeafletMap(type, url, xmin, ymin, xmax, ymax, options);  

}//showMap

/*
 map functions
 * */
function getLeafletMap(mapType, friendlyUrl, xmin, ymin, xmax, ymax, options){
	if(mapType == "KML"){ 
		renderLeafletForKml(friendlyUrl, xmin, ymin,xmax, ymax, options); 
	}else if(mapType == "WMS"){
		renderLeafletForWms(friendlyUrl, xmin, ymin,xmax, ymax, options);
	}else if(mapType == "WIKILOC"){
		renderLeafletForWikiloc(friendlyUrl, xmin, ymin,xmax, ymax, options);
	}else if (mapType == "DBPEDIA_POI"){
		renderLeafletForDbpedia(friendlyUrl, xmin, ymin,xmax, ymax, options);
    }
	
	
}


function renderLeafletForDbpedia(friendlyUrl, xmin, ymin,xmax, ymax, options){
	var takemethere = options["takemethere"];
	category = options['category'];
	description = options['description'];
	
	var url = BACK_END_SERVER + "/mapas_api/getjson/" + GEO_TABLE + "/" + friendlyUrl;
	$.ajax(url).done(function(response) {
			geometry = response;
			coordinates = geometry.split(",");
			var marker = L.marker(coordinates);
			
			var popup;
			if(isIOS){
				popup = description + '<br><a href="http://maps.google.com/maps?ll='+coordinates[1]+","+coordinates[0]+'" class="btn btn-success">'+takemethere+'</a>';
			}else{
				popup = description + '<br><a href="geo:'+coordinates[1]+','+coordinates[0]+'?q='+coordinates[1]+','+coordinates[0]+'" class="btn btn-success">'+takemethere+'</a>';
			}				
			var divNode = document.createElement('div');
			divNode.innerHTML = popup;
			marker.bindPopup(divNode);
			
			var _layerGroup = L.featureGroup([marker]);
			currentLayer = _layerGroup;
			
			_layerGroup.addTo(map);
			var bounds = _layerGroup.getBounds();
			var center = bounds.getCenter();
			var zoomLevel = map.getBoundsZoom(bounds);
			
			map.setView(center, zoomLevel, true);
			//marker.openPopup();
	});//$.getJson
}


function cacheMap(key, cachedMap){
	if(_storage){
		   var maps;
		   if(_storage.maps){
			   maps = jQuery.parseJSON( _storage.maps );
		   }else{
			   	maps = {};
		   }
		   
		   //we see if exceed the limit
		   var entryCount = Object.keys(maps).length;

		   if(entryCount > 10){//ten maps in cache
			   for(propt in maps){
				    delete maps.propt;//only delete first entry
				    break;
				}
		   }
		   
		   maps[key] = cachedMap;
		   var maps_str = JSON.stringify(maps);
		   _storage.maps = maps_str;   
	  }
}

function getCachedMap(key){
	var solution = "";
	if(_storage){
		   var maps;
		   if(_storage.maps){
			   maps = jQuery.parseJSON( _storage.maps );
			   
			   solution = maps[key];
		   }
	}
	return solution;
	
}
 

function renderLeafletForKml(friendlyUrl, xmin, ymin,xmax, ymax, options){	
	var tocache = true;
	var kml = getCachedMap(friendlyUrl);
	var track;
	if(! kml){
		var kmlUrl = BACK_END_SERVER +"/mapas_api/getkml/"+GEO_TABLE+"/"+friendlyUrl;
		track = new L.KML(kmlUrl, { isurl: true, async: true}); 
	}else{
		track = new L.KML(kml, { isurl: false, async: true}); 
		tocache = false;
	}
  	var pm_index = 0;
  	track.on("loaded", function(e) {
  		xml = track.getXML();
  		if(tocache)
  			cacheMap(friendlyUrl, xml);
  		
  		var lyrs = [];
		track.eachLayer(function (layer) { 
			layer._leaflet_id ='kml'+pm_index+''; 
			pm_index++; 
			if(layer instanceof L.LayerGroup){
				layer.eachLayer(function (newlayer) {
    				lyrs.push(newlayer);
				});
			}
			else
				lyrs.push(layer);
			
		});
		
		for(var i = 0; i < lyrs.length; i++){
			id_feature_map[i] = lyrs[i]; 
		}
		map.invalidateSize();
		map.fitBounds(e.target.getBounds()); 
	}); 
  	currentLayer = track;
  	track.addTo(map);
} 

function renderLeafletForWikiloc(friendlyUrl, xmin, ymin,xmax, ymax, options){	
	loadWikilocTrack(map, friendlyUrl, options);
}

function distance(x0,y0,x1,y1){
	return Math.sqrt( ((x1-x0)*(x1-x0)) + ((y1-y0)*(y1-y0)) );
}