function pagebeforecreate(){
	if(txtInitialized)
		return;

   	$("#whatsapp").on('vclick',function(){
	   shareOnWhatsapp();
    });

   	$("#whatsapp2").on('vclick',function(){  
	    gaPlugin.trackEvent( sucessHandler, errorHandler, "Button", "Click", "whatsapp_resto_app", 1);
	    var msg = downloadHikingTrailsAt+" http://www.buscamapas.com/"+appTitle;
	    var msgurl = encodeURIComponent(msg);
	    try{
	    	window.location = "whatsapp://send?text="+msgurl;
	    }catch(e){
	    	alert(e.message);
	    }
     });
   
   	 $("#whatsapp_button").on('vclick',function(){
	   shareOnWhatsapp();
     });
   
	 function errorHandler(e) {
	   var msg = '';
	   switch (e.code) {
	     case FileError.QUOTA_EXCEEDED_ERR:
	       msg = 'QUOTA_EXCEEDED_ERR';
	       break;
	     case FileError.NOT_FOUND_ERR:
	       msg = 'NOT_FOUND_ERR';
	       break;
	     case FileError.SECURITY_ERR:
	       msg = 'SECURITY_ERR';
	       break;
	     case FileError.INVALID_MODIFICATION_ERR:
	       msg = 'INVALID_MODIFICATION_ERR';
	       break;
	     case FileError.INVALID_STATE_ERR:
	       msg = 'INVALID_STATE_ERR';
	       break;
	     default:
	       msg = 'Unknown Error';
	       break;
	   };
	   alert(e.source+" "+e.target+" "+msg);
	   $.mobile.loading( 'hide' );
	 }


   $("#download").on('vclick',function(){ 
	   gaPlugin.trackEvent( sucessHandler, errorHandler, "Button", "Click", "download_map", 1);
	   
	   var fileTransfer = new FileTransfer();
	   var uri = encodeURI(BACK_END_SERVER+"/mapas_api/getkml/"+GEO_TABLE+"/"+data.friendly_url);
	   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			    function onFileSystemSuccess(fileSystem) {
				   $.mobile.loading( 'show', {
						text: downloading+" "+data.friendly_url,
						textVisible: true,
						theme: 'b',
						html: ''
					});
				
				   //store = cordova.file.externalDataDirectory + "/kml/";
				   store = "cdvfile://localhost/persistent/kml/";
				   window.resolveLocalFileSystemURL(store + data.friendly_url, function(){
					   alert(data.friendly_url+" "+already_exists);
					   $.mobile.loading( 'hide' );
				   }, function(){
					   var fileTransfer = new FileTransfer();
				       fileTransfer.download(uri,store + data.friendly_url + ".kml",//añadir .".kml"
	                			function(theFile) {
	                    			alert(theFile.toURI()+": "+download_finished);
	                    			$.mobile.loading( 'hide' );
	                    			cordova.plugins.fileOpener2.open(
	                    				    theFile.toURI(), // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
	                    				    'application/vnd.google-earth.kml+xml', 
	                    				    { 
	                    				        error : function(e) { 
	                    				            //alert('Error status: ' + e.status + ' - Error message: ' + e.message);
	                    				        },
	                    				        success : function () {
	                    				            //alert('file opened successfully');                
	                    				        }
	                    				    }
	                    		    );
	                			},
	                			errorHandler
	            		);
				   });					  
		}, errorHandler);//requestFileSystem
		
   });
   
   $("#profile_button").on('vclick',function(){
	   muestraLoading(true);
	   var friendly_url = "gid";
	   var pk_id = -1;
		//primeramente  intentamos acceder a los datos del perfil cacheados
	   if(!data){
		  if(_storage && _storage.lastMap){
			data = jQuery.parseJSON( _storage.lastMap );
		  }//storage
	   }

	   if(data){
		  if(data.friendly_url != 'gid')
		 	friendly_url = data.friendly_url;

		  if(data.pk_id != -1)
			  pk_id = data.pk_id;	
	   }else{
			alert("no se ha podido cargar el mapa");
			return;
	   }

	   //primero intentamos cargar los datos cacheados en buscamapas.com
	 var elevationUrl = BACK_END_SERVER+"/mapas_api/getelevationprofile/"+GEO_TABLE+"/"+friendly_url+"/"+pk_id;
	 ajaxRequest = $.ajax({
			url:elevationUrl 
	 });
		
	 ajaxRequest.then( function (response) {
		 if(response == null || response.length == 0 || response[0]["ELEVATION_PROFILE"] == null){
			 getElevationProfile(currentLayer,function(jsonresponse){
					if(jsonresponse == null){
						alert("No tenemos datos de altitud");
					}else{
						 if(jsonresponse.info.statuscode == 601)
						 {
							alert("No tenemos datos de altitud para esta ruta");
							return;
						 }
						  pointList = jsonresponse.elevationProfile;

						  profileStatistics = computeElevationProfile(pointList);

						  
						  var min_h = profileStatistics.minElevationPoint.height;
						  var max_h = profileStatistics.maxElevationPoint.height;
						  var avg_h = profileStatistics.computeMeanHeight();
						  var avg_slope_up = profileStatistics.computeMeanAspectUp();
						  var avg_slope_down = profileStatistics.computeMeanAspectDown();
						  var hardIndex = profileStatistics.difficultyIndex_topofusion();
						  

						  var post_url = BACK_END_SERVER+"/mapas_api/update_elevation_profile/"+
						  			GEO_TABLE + "/"+ min_h.toFixed(2) + "/"+ max_h.toFixed(2) + "/" + avg_h.toFixed(2) + "/"+
						  			avg_slope_up.toFixed(2) + "/"+ avg_slope_down.toFixed(2) + "/" + hardIndex.toFixed(2) + "/" + friendly_url+"/"+pk_id;							

						  			
						  $.ajax({
							  type: "POST",
							  url: 	post_url,
							  data:{
								  elevation_profile: '{"elevationProfile":'+JSON.stringify(pointList)+"}"
							  }
						   });
						   
					      $.mobile.changePage('#elevation_profile', {transition:'pop'});
					      muestraLoading(false);
					}
				});
		  }else{
				  //pointList = response.elevationProfile;
				  pointList = JSON.parse(response[0]["ELEVATION_PROFILE"]).elevationProfile;
				  $profileStatistics = computeElevationProfile(pointList);

			      $.mobile.changePage('#elevation_profile', {transition:'pop'});
			      muestraLoading(false);
		   }
	  });	   
    });


   $("#gps").on('vclick',function(){
	   
	   gaPlugin.trackEvent( sucessHandler, errorHandler, "Button", "Click", "gps", 1);
	   
	   muestraLoading(true);
		  
	   if(navigator.geolocation) {
		 navigator.geolocation.getCurrentPosition(
				 function(position) {
					if(map){
						var currPos = L.latLng(position.coords.latitude, position.coords.longitude);
						L.marker(currPos).addTo(map);
						map.invalidateSize();
						var bounds = map.getBounds();
						var zoomLevel = map.getBoundsZoom(bounds);
						map.setView(currPos, zoomLevel, true);
						map.invalidateSize();
					};
			      }, 
		    	 //error
		    	 function() {
			    	 alert("gps error");
					return;
		    	 }, 
		    	 { 
		    	   maximumAge: 15000, 
		    	   timeout: 10000, 
		    	   enableHighAccuracy:true
		    	 } 
		 );
	   } else {
			//navigator.geolocation not supported
			alert("gps error");
			
	   };	
	   muestraLoading(false);	
   });

   $("#fav").on('vclick',function(){
	 var tag = "fav_button" + "?q="+ data.friendly_url;
	 gaPlugin.trackEvent( sucessHandler, errorHandler, "Button", "Click", tag , 1);
	 setFav($(this));
   });

   $("#fav2").on('vclick',function(){
	    gaPlugin.trackEvent( sucessHandler, errorHandler, "Button", "Click", "fav2_button", 1);
		setFav(null);
    });

   //solo permite buscar pulsando el boton (deshabilita enter)
   $("#geographic_form").submit(function() {
		  return false;
   });

	$("body>[data-role='panel']").panel();

		txtInitialized = true;
}//pagebeforecreate

function initSearchMaps(){
	gaPlugin.trackPage( sucessHandler, errorHandler, "#search-maps");

	$("#search-criteria").on("keyup",function() {
		var $ul = $("#autocomplete-results");
		var $input = $(this);
		var value = $input.val();
		var html = "";
		$ul.show();
	    $ul.html( "" );
	    if (value && value.length > 0) {
		   if(ajaxRequest && ajaxRequest.readyState != 4)
				ajaxRequest.abort();
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			var aUrl = BACK_END_SERVER+"/mapas_api/autocomplete/"+value;
			ajaxRequest = $.ajax({
				url:aUrl 
			});
			
			ajaxRequest.then( function (response) {
				if(response.toponyms){
					if(response.toponyms.length > 0){
						for(var j = 0; j < response.toponyms.length; j++){
							var toponym = response.toponyms[j].name;
							var type = response.toponyms[j].type;
							var img = '';
							if(type == 'pais'){
								img = "img/map-icons/country.png";
							}else if(type == 'ciudad'){
								img = "img/map-icons/bigcity.png";
							}

							html += "<li onclick='$(\"#search-criteria\").val($(this).text());$(\"#autocomplete-results\").hide(true)' class=''><a href='#search-maps-results'><img src='"+img+"' class='ui-li-icon' />" + toponym + "</a></li>";

						}
						$ul.html( html );
						$ul.listview( "refresh" );
						$ul.trigger( "updatelayout");
					}//response toponyms
				}//response.toponyms.length	
			});
		}//if value > 0
	});	
}

function showFiltersText(){
	if(filter != null){
		var html = "<p>" + filter.toString() + "</p>";
		//$("#filters-text").html(filter.toString());
		$("#filters_text").html(html);
	}	
}

function resetFilters(){
	$("#range-distance-min").val(0).slider("refresh");
	$("#range-distance-max").val(40).slider("refresh");
	
	$("#range-desnivel-min").val(0).slider("refresh");
	$("#range-desnivel-max").val(1200).slider("refresh");
	
	$("#range-dureza-min").val(0).slider("refresh");
	$("#range-dureza-max").val(110).slider("refresh");
	
	$('#length_sort').prop("checked",false).checkboxradio("refresh");
	$('#dist_sort').prop("checked",true).checkboxradio("refresh");
	$('#hard_sort').prop("checked",false).checkboxradio("refresh");
	$('#desnivel_sort').prop("checked",false).checkboxradio("refresh");
	
	$('#asc').prop("checked",true).checkboxradio("refresh");
	$('#desc').prop("checked",false).checkboxradio("refresh");	
	
	filter = new Filter();
	
}


function initSearchMapsResults(){
	var value  =  $('#search-criteria').val();
	
	//var page = "#search-maps-results" + "?q=" + value;
	//gaPlugin.trackPage( sucessHandler, errorHandler, page);
	
	if(filter != null && ! filter.isEmptyFilter()){
		var filterButton = 	$("#filter_button");
		filterButton.css("background","red");
	}else{
		var filterButton = 	$("#filter_button");
		filterButton.css("background","green");
	}


	if(value == ""  && _storage){
		if(_storage.lastSearch){
			value = _storage.lastSearch;
		}//storage.favs
	}//if value == ""
	
	if(ajaxRequest && ajaxRequest.readyState != 4)
			ajaxRequest.abort();
		
	muestraLoading(true);
	 
	//var value = $('#search-criteria').val();
	var resultsListView = $('#maps-results');

	if(value == ""){
		resultsListView.html("<li>"+noSearchString+"</li>").listview("refresh").trigger("updatelayout");
		return;
	}else{
		_storage.lastSearch = value;
	}

	var list = '';
	var numrows;
	
	if(lastTextSearch.txt == value && lastTextSearch.filter.equals(filter)){
		//Repetimos la ultima busqueda, luego podemos mostrar los mismos resultados y salir
		muestraLoading(false);
		
		mapsArray = lastTextSearch.mapsArray;
		numrows = lastTextSearch.numRows;
		lastStart = lastTextSearch.lastStart;
		list = lastTextSearch.lastListView;
		var newhtml = list;
		
		var html = "<h2>"+wehavefound + " " + numrows + " " + mapsandtrails+" "+forthesearch+" '<b><i>"+value+"</i></b></h2>";
		
		if(filter != null){
			html += filter.toString();
		}
		$('#buscar-mapas-result-search').html(html); 

		if(mapsArray.length < numrows){
				newhtml += '<li  data-icon="false"><a style="height: 1.5em; font-size:1.5em;; text-align:center;" href="javascript:updateMapList()" data-role="button" data-theme="b">' +  seeMoreTxt + '('+ mapsArray.length+' / '+ numrows+')</a></li>';
        }
        resultsListView.html(newhtml).listview("refresh");
        return;
	}

	lastStart = 0;
	var limit = 10;
	var aUrl = BACK_END_SERVER+"/mapas_api/mapasen/"+GEO_TABLE+"/es/"+value+"/"+lastStart+"/"+limit;
	
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
			numrows = response.numrows;

			var html = "<h2>"+wehavefound + " " + numrows + " " + mapsandtrails+" "+forthesearch+" '<b><i>"+value+"</i></b></h2>";
			
			if(filter != null){
				html += filter.toString();
			}
			//$('#buscar-mapas-result-search').html(wehavefound + " " + numrows + " " + mapsandtrails+" "+forthesearch+" '<b><i>"+decodeURIComponent(value)+"</i></b>'"); 
			$('#buscar-mapas-result-search').html(html);
			mapsArray = [];
			var index = 0;
			
            $.each(response.rows, function(index, val) {
				var friendlyUrl = val.FRIENDLY_URL;
				var area = val.AREA;
				var serviceUrl = val.SERVICE_URL;
				var bbox = val.wkt_bbox;
				var title = val.TITLE;
				var description = val.DESCRIPTION;
				var mapType = val.MAP_TYPE;
				
				var pk_id = val.PK_ID;
				var dist = Math.sqrt(val.Square_Dist) * 111.12;
				var line_length = val.LINE_LENGTH / 1000.0;
				var producer = val.PRODUCER;
				
				var min_h = val.MIN_H;
    			var max_h = val.MAX_H;
    			var avg_h = val.AVG_H;
    			var avg_aspect_up = val.AVG_ASPECT_UP;
    			var avg_aspect_down = val.AVG_ASPECT_DOWN;
    			var hard_index = val.HARD_INDEX;
				
    			var dataArr = {'map_type':mapType,
						 'service_url':serviceUrl,
						 'title':title,
						 'description':description,
						 'bbox':bbox,
						 'friendly_url':friendlyUrl,
							 'distance':dist,
							 'line_length': line_length,
							 'pk_id': pk_id,
							 'producer':producer,
		    				'pk_id':pk_id,
		    				'min_h':min_h,
		    				'max_h':max_h,
		    				'avg_h':avg_h,
		    				'avg_aspect_up':avg_aspect_up,
		    				'avg_aspect_down':avg_aspect_down,
		    				'hard_index':hard_index
    			};

				mapsArray.push(dataArr);

				var reloadPage = false;
				var changeHash = true;
				
				var descr = $(description).text();

            	list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km.<br>"+dureza+": "+hard_index+
				'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km. <br>'+desnivel+': '+(max_h - min_h)+' m.</strong></p></li>';  
            	list += '<li >' +
                 '<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+index+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
                 '</li>';
                index++;
            }); // end each 

            //_storage.prev_listview = list;
            lastStart += 10;

            var new_html = list;
            lastTextSearch.setLastStart(lastStart);
			lastTextSearch.setLastListView(new_html);
			lastTextSearch.setNumRows(numrows);
			lastTextSearch.setMapsArray(mapsArray);
			lastTextSearch.setTxt(value);
			
			var filterCopy = jQuery.extend({}, filter);
			lastTextSearch.setFilter(filterCopy);
            
            if(mapsArray.length < numrows){
				new_html += '<li  data-icon="false"><a style="height: 1.5em; font-size:1.5em;; text-align:center;background-color:#5cb85c;color:white" href="javascript:updateMapList(\''+value+'\')" data-role="button" data-theme="b">' +  seeMoreTxt + '('+ resultsListView.length+' / '+response.numrows+')</a></li>';

            }
            resultsListView.html(new_html).listview("refresh");
		}//if response end
		else{
			$('#buscar-mapas-result-search').html(wehavefound + " 0"  + mapsandtrails+" "+forthesearch+" '<b><i>"+decodeURIComponent(value)+"</i></b>'"); 
			resultsListView.html("<li style='white-space: normal'>"+noResultsFound+"</li>").listview("refresh").trigger("updatelayout");
		}
	});
	ajaxRequest.always( function () {
		muestraLoading(false);
	});	
}

function favResults(){
	gaPlugin.trackPage( sucessHandler, errorHandler, "#fav-results");
	
	var favsListView = $('#favs-listview');
	if(_storage){
		var favs;
		if(_storage.favs){
			favs = jQuery.parseJSON( _storage.favs );
			if(favs.length > 0){
				 var list = '';
				 $.each(favs, function(index, val) {
					 list += '<li>' +
                     '<a data-role="button" data-theme="b"  href=\"#map_page\" onClick="loadFav(\''+val+'\');return false;">'+val+'</a><a data-icon="delete" data-role="button" data-iconpos="notext" onClick="deleteFav(\''+val+'\',$(this).parent());return false">'+delfav+'</a>'+
                     '</li>';
				 });	
				 favsListView.html(list).listview("refresh");				 
			}else{
				favsListView .html("<li>"+nofavs+"</li>").listview("refresh").trigger("updatelayout");
			}
		}
	}else{
		favsListView .html("<li>"+functionNotSupported+"</li>").listview("refresh").trigger("updatelayout");
	}
}


function mapsAroundResults(){
	if(filter != null && ! filter.isEmptyFilter()){
		var filterButton = 	$("#filter_button_xy");
		filterButton.css("background","red");
	}else{
		var filterButton = 	$("#filter_button_xy");
		filterButton.css("background","green");
	}
	
	gaPlugin.trackPage( sucessHandler, errorHandler, "#maps-around-results");
	
	muestraLoading(true);
	var limit = 10;
	var radius = 0.1;
		
	var resultsListView = $('#maps-around-results-listview');
	var num_items = resultsListView.children().length;

	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(
  			    function(position) {
		   			 var x = position.coords.longitude;
		    		 var y = position.coords.latitude;

		   			if(ajaxRequest && ajaxRequest.readyState != 4)
		   				ajaxRequest.abort();
		   			
			   		if(num_items != 0 && lastTextSearch){
			   		   lastTxt = lastTextSearch.txt;
			   		   if(lastTxt && lastTxt.indexOf("*") > -1){
							coords = lastTxt.split("*");

							ny = parseFloat(coords[0]).toFixed(2);
							nx = parseFloat(coords[1]).toFixed(2);
													
							dy = ny - parseFloat(y).toFixed(2);
							dx = nx - parseFloat(x).toFixed(2);

							if(dx == 0 && dy == 0){
  								return;
							}
				   		}
			   		}
			   		
			   		lastStart = 0;//reseteamos lastStart porque si el filtro ha cambiado no debe arrastrar el anterior
		   			
		   			var aUrl = BACK_END_SERVER+"/mapas_api/mapascerca/"+GEO_TABLE+"/es/"+x+"/"+y+"/"+radius+"/"+lastStart+"/"+limit;
		   			if(filter.getMinLength() > 0){
		   				aUrl += "/" + filter.getMinLength();
		   			}else{
		   				aUrl += "/nil";
		   			}
		   			
		   			if(filter.getMaxLength() != (MAX_LENGTH * 1000)){
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
		   			var list = '';
		   			    
		   			ajaxRequest = $.ajax({
		   					url:aUrl 
		   			});
		   			
		   			ajaxRequest.then( function (response) {
		   				if(response && response.numrows){
		   						var numrows = response.numrows;
		   						
		   						var html = "<h2>"+wehavefound + " " + numrows + " " + mapsandtrails+" "+nearcoordinates+" '<b><i>"+x.toFixed(5)+" "+y.toFixed(5)+"</i></b>'</h2>";
		   						if(filter != null){
		   							html += filter.toString();
		   						}
		   						$('#maps-around-result-search').html(html);
		   						
		   						
		   						$("#toponym").load(BACK_END_SERVER+"/mapas_api/geocode/"+x+"/"+y+"/"+language);	
		   						mapsArray = [];
		   					
		   	                	$.each(response.rows, function(index, val) {
		   							var friendlyUrl = val.FRIENDLY_URL;
		   							var area = val.AREA;
		   							var serviceUrl = val.SERVICE_URL;
		   							var bbox = val.wkt_bbox;
		   							var title = val.TITLE;
		   							var description = val.DESCRIPTION;
		   							
		   							
		   							var mapType = val.MAP_TYPE;
		   							var pk_id = val.PK_ID;
		   							var dist = Math.sqrt(val.Square_Dist) * 111.12;
		   							var line_length = val.LINE_LENGTH / 1000.0;
	   								var producer = val.PRODUCER;
	   								var min_h = val.MIN_H;
		   			    			var max_h = val.MAX_H;
		   			    			var avg_h = val.AVG_H;
		   			    			var avg_aspect_up = val.AVG_ASPECT_UP;
		   			    			var avg_aspect_down = val.AVG_ASPECT_DOWN;
		   			    			var hard_index = val.HARD_INDEX;

		   							var dataArr = {'map_type':mapType,
		   										 'service_url':serviceUrl,
		   										 'title':title,
		   										 'description':description,
		   										 'bbox':bbox,
		   										 'friendly_url':friendlyUrl,
		   										 'distance':dist,
		   										 'line_length': line_length,
		  	   								     'producer':producer,
	   			   			    				 'pk_id':pk_id,
	   			   			    				 'min_h':min_h,
	   			   			    				 'max_h':max_h,
	   			   			    				 'avg_h':avg_h,
	   			   			    				 'avg_aspect_up':avg_aspect_up,
	   			   			    				 'avg_aspect_down':avg_aspect_down,
	   			   			    				 'hard_index':hard_index
		   							};
		   							
		   							mapsArray.push(dataArr);
		   							var reloadPage = false;
		   							var changeHash = true;

		   							var descr = $(description).text();

		   							/*
		   							list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km."+
		   								'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km.</strong></p></li>';  
		   							list += '<li >' +
		   									'<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+index+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
		   									'</li>';
		   							*/
		   							list += "<li data-role=\"list-divider\" role=\"heading\"  >"+distance+": "+dist.toFixed(3)+" Km.<br>"+dureza+": "+hard_index+
	   								'<p  style="text-align:right"><strong>'+routeLength+": "+line_length.toFixed(2)+' km. <br>'+desnivel+': '+(max_h - min_h)+' m.</strong></p></li>';  
		   							list += '<li >' +
	   	                         	'<a data-role="button" data-theme="b" style="background-color:white" href=\"#map_page\" onClick="loadMap(mapsArray['+index+'])"><h2 style="white-space: normal">'+title+'</h2><p>'+descr+'</p></a>'+
	   	                         	'</li>';
		   							
		   							
		   	                    	index++;
		   	                	}); // end each 

		   	                	lastStart += 10;
		   	                	var new_html = list;

			   	                lastTextSearch.setLastStart(lastStart);
			   					lastTextSearch.setLastListView(new_html);
			   					lastTextSearch.setNumRows(numrows);
			   					lastTextSearch.setMapsArray(mapsArray);
			   					lastTextSearch.setTxt(y+"*"+x);
			   					
			   					var filterCopy = jQuery.extend({}, filter);
			   					lastTextSearch.setFilter(filterCopy);

		   	                	if(resultsListView.length < numrows){
		   							new_html += '<li  data-icon="false"><a style="height: 1.5em; font-size:1.5em;; text-align:center;background-color:#5cb85c;color:white" href="javascript:updateMapListAroundYou('+y+','+ x+')" data-role="button" data-theme="b">' +  seeMoreTxt + '('+ resultsListView.length+' / '+response.numrows+')</a></li>';
		   	                	}
		   	                	resultsListView.html(new_html).listview("refresh");
		   					}//if response end
		   					else{
		   						$('#maps-around-result-search').html(wehavefound + " 0"  + mapsandtrails); 
		   						resultsListView.html("<li style='white-space: normal'>"+noResultsFound+"</li>").listview("refresh").trigger("updatelayout");
		   					}
		   			});//ajax request then

			   		ajaxRequest.always( function () {
			   				muestraLoading(false);
			   		});	
	    		}, 
	    		function(error) {
	    			alert(error.code+" "+error.message);
			        return;
	             }, 
		    	 { 
			    	maximumAge: 15000, 
			    	timeout: 10000, 
			    	enableHighAccuracy:true
			      }
	     );//getCurrentPosition
	}else{
		alert(functionNotSupported);
	return;
	}//if navigator.geolocation;	
}

function showMapPage(){ 
	 num_map_views++;
	 
	 if(num_map_views % 7 == 0)
	 	window.plugins.AdMob.createInterstitialView();
	 
	 if(map)
		map.invalidateSize(true);
 
	 var type, url;

	 if(data && data.map_type && data.friendly_url){
		 type = data.map_type;
		 url = data.friendly_url;
	 }else{

		 if(_storage){
			if(_storage.lastMap){
				data = jQuery.parseJSON( _storage.lastMap );
			}//lastMap
			
		 }//storage
		 
		 if(data && data.map_type && data.friendly_url){
				type = data.map_type;
				url = data.friendly_url;
			}else{
				alert("no se ha podido cargar el mapa");
				return;
			}
	 } //else
	 
		
	var page = "#map_page" + "?q=" + url;
	gaPlugin.trackPage( sucessHandler, errorHandler, page); 
	 
	 
 	if(map){
		if(currentLayer){
			if(currentLayer instanceof L.LayerGroup || currentLayer instanceof L.FeatureGroup)
				currentLayer.clearLayers();


			map.removeLayer(currentLayer);
			currentLayer = null;
		}
	}
	
	if(_storage){
		var favs;
		if(_storage.favs){
			favs = jQuery.parseJSON( _storage.favs );
			   
			if(favs.indexOf(url) != -1){
				$('#fav').buttonMarkup({ icon: "check", theme:"b" });
			}else{
				$('#fav').buttonMarkup({ icon: "star", theme:"a" });
			}
		}//storage.favs

		var lastMap_str = JSON.stringify(data);
		_storage.lastMap = lastMap_str;
	}

	showMap(url,type);	
}

function showMapDescription(){
	gaPlugin.trackPage( sucessHandler, errorHandler, "#description");
	  
	$("#map-description").i18n();
	var description = $('#description-body'); 
	description.html(data.description);
}

function showElevationProfile(){
	  paintGraph();
	  
	  var minh = Number(data.min_h).toFixed(2);
	  var maxh = Number(data.max_h).toFixed(2);
	  var desnivel = maxh - minh;
	  var line_length = Number(data.line_length).toFixed(2);
	  var avgh = Number(data.avg_h).toFixed(2);
	  var avg_aspectup = Number(data.avg_aspect_up).toFixed(2);
	  var avg_aspectdown = Number(data.avg_aspect_down).toFixed(2);
	  var hardIndex_str = Number(data.hard_index).toFixed(2);
	  
	  $('#length').html(line_length + " Km.");
	  $('#ramp').html(desnivel.toFixed(2)+" m.");
	  $('#hmax').html(maxh + " m.");
	  $('#hmin').html(minh + " m.");
	  $('#hmedia').html(avgh +" m.");
	  $('#max_aspect').html(maxAspect.toFixed(2) + "%");
	  $('#min_aspect').html(minAspect.toFixed(2) + "%");
	  $('#avg_aspect_up').html(avg_aspectup + "%");
	  $('#avg_aspect_down').html(avg_aspectdown + "%");
	  $('#hard_index').html(hardIndex_str );
	  
	  $('#more_about_hard_idx_title_2').html("<br><a href='#hard_index'>"+moreAboutHardIndex+"...</a>");
	  
	  $('#difficulty_index_description_1').html(difficulty_index_description_1);
	  $('#difficulty_index_description_2').html(difficulty_index_description_2);
	  $('#difficulty_index_description_3').html(difficulty_index_description_3); 
}


function showDisqusPage(){
	gaPlugin.trackPage( sucessHandler, errorHandler, "#disqus");
	  
	title = "";
	friendly_url = "";

	if(!data){
	  if(_storage && _storage.lastMap){
		data = jQuery.parseJSON( _storage.lastMap );
	  }//storage
	}
 
	if(data && data.map_type && data.friendly_url){
		title = data.title;
		friendly_url = data.friendly_url;	
	}else{
		alert("no se ha podido cargar el mapa");
		return;
	}
  
   $("#map-to-disqus").html(title);
   
  	params = {};
  	params["shortname"] = "buscamapas";
  	params["url"] = "http://www.buscamapas.com/mapas/"+GEO_TABLE+"/"+data.friendly_url;
  	params["title"] = data.title;
 
  	if (params["shortname"] == undefined || params["url"] == undefined || params["title"] == undefined) {
		alert("no se han podido cargar los comentarios del mapa");
		return;
  	} else {
		loadComments(params["shortname"], params["url"],params["title"], params["identifier"]);	
  	}
}

function showFilters(){
	  //Reset event
	 	$("#filter-delete").on('vclick',function(){
			resetFilters();
	 	});
	
	
	   //Filters events
	   $('#range-distance-min').on("slidestop",function() {
		    var min = parseInt($(this).val());
		    var max = parseInt($('#range-distance-max').val());
		    if (min > max) {
		    	min = max;
		        $(this).val(max);
		        $(this).slider('refresh');
		    }
		    filter.setMinLength(min);
		});
		$('#range-distance-max').on("slidestop", function() {
		    var min = parseInt($('#range-distance-min').val());
		    var max = parseInt($(this).val());
		    if (min > max) {
		    	max = min;
		        $(this).val(min);
		        $(this).slider('refresh');
		    }
		    filter.setMaxLength(max);
		});
	   
		$('#range-desnivel-min').on("slidestop", function() {
			    var min = parseInt($(this).val());
			    var max = parseInt($('#range-desnivel-max').val());
			    if (min > max) {
			        $(this).val(max);
			        $(this).slider('refresh');
			    }
			    filter.setMinDesnivel(min);
		});
		$('#range-desnivel-max').on("slidestop", function() {
			    var min = parseInt($('#range-desnivel-min').val());
			    var max = parseInt($(this).val());
			    if (min > max) {
			        $(this).val(min);
			        $(this).slider('refresh');
			    }
			    filter.setMaxDesnivel(max);
		});
		
		$('#range-dureza-min').on("slidestop", function() {
			    var min = parseInt($(this).val());
			    var max = parseInt($('#range-dureza-max').val());
			    if (min > max) {
			        $(this).val(max);
			        $(this).slider('refresh');
			    }
			    filter.setMinHardIndex(min);
		});
		
		$('#range-dureza-max').on("slidestop", function() {
			    var min = parseInt($('#range-dureza-min').val());
			    var max = parseInt($(this).val());

			    if (min > max) {
			        $(this).val(min);
			        $(this).slider('refresh');
			    }
			    filter.setMaxHardIndex(max);
		});
		
		$('input[name="sorts"]').click(function() {
			filter.setSortField($(this).val());
		});
		
		$('input[name="direction"]').click(function() {
			filter.setSortDirection($(this).val());
		});
}

