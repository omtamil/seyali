/*
 * tiene dependencias de jquery
 * */

function zoomToLyr(lyr, map){
	if(lyr ){
		if(! (lyr instanceof L.FeatureGroup) || ! (lyr instanceof L.LayerGroup))
			lyr.openPopup();
		if(lyr instanceof L.Marker || lyr instanceof L.Popup)
			map.setView(lyr.getLatLng(),18, true);
		else
			map.fitBounds(lyr.getBounds());
		//else if(lyr instanceof L.Polyline)
			//map.setView(lyr.getBounds().getCenter(),15);
	}
}

function goMapsAroundMe(city, countryCode, xmin, ymin, xmax, ymax){
	//window.location.href="maps-around.php?xmin="+xmin+"&xmax="+xmax+"&ymin="+ymin+"&ymax="+ymax;
	window.open("maps-around.php?xmin="+xmin+"&xmax="+xmax+"&ymin="+ymin+"&ymax="+ymax+"&ciudad="+city+"&pais="+countryCode,'Maps around '+xmin+","+ymin+","+xmax+","+ymax);
}

function prepareStreetViewDialog(placeName, latitude, longitude, width, height){
	//$("#modal-body" ).attr("width", 800);
	//$("#modal-body" ).attr("height", 550);
	
	$("#myModal").modal('show');
	
	$("#myModalLabel" ).text( placeName );

	var coord = new google.maps.LatLng(latitude, longitude);
	
	
	
	var panoramaOptions = {
	    position: coord,
	    pov: {
	      heading: 165,
	      pitch: 0
	    },
	    zoom: 1
	  };
	 
		
	
	var myPano = new google.maps.StreetViewPanorama(
		  document.getElementById("modal-body") , panoramaOptions);
  myPano.setVisible(true);
	

	/*
	if(width < 640)
		width = 640;
	if(height < 640)
		height = 640;
		
	var url = "http://maps.googleapis.com/maps/api/streetview?size="+width+"x"+height+"&location="+latitude+","+longitude+"&fov=90&heading=235&pitch=10&sensor=false";
	$("#streetview_img" ).attr("src", url);	
    */
	
	//$("#myModal").modal('show');
}


function addWikilocPoi(map, egeo, x, y, namePOI, th){
	
	var lyrs = [];
	
	

	var geometry = null;
	
	
	if(egeo){
		geometry = L.Polyline.fromEncoded(egeo);
		
		
		//var divNode = document.createElement('div');
		//divNode.innerHTML = "<h2>" + namePOI + "</h2><br><img src='"+th+"'>'";
		//geometry.bindPopup(divNode);
		
		//geometry.bindPopup("<h2>" + namePOI + "</h2>" + "<br><img src='"+th+"'>");
		geometry.bindPopup("<h2>" + namePOI + "</h2>");
		
		lyrs.push(geometry);
		
		//getLatLngs()
		var points = geometry.getLatLngs();

		var startPoint = points[0];
		var endPoint = points[points.length - 1];
		
		var startIcon = L.icon({
		    iconUrl: 'http://www.google.com/mapfiles/dd-start.png',
		    iconSize: [20, 34],
		    iconAnchor: [10, 18],
		});

		var startMarker = L.marker(startPoint, {icon:startIcon}).addTo(map);

		lyrs.push(startMarker);
		
        var dx= endPoint.lng - startPoint.lng;
        var dy = endPoint.lat - startPoint.lat;
        var q = 6378137 * Math.PI * Math.sqrt(dx*dx+dy*dy)/180;
        
        if(q>250){
        	var endIcon = L.icon({
			    iconUrl: 'http://www.google.com/mapfiles/dd-end.png',
			    iconSize: [20, 34],
			    iconAnchor: [10, 18],
			});

			var endMarker = L.marker(endPoint, {icon:endIcon}).addTo(map);
			
			lyrs.push(endMarker);
        }
		
	}else{
		
		var point = L.latLng(y, x);

		
		var wayPointIcon = L.icon({
		    iconUrl: 'http://maps.google.com/mapfiles/kml/pal5/icon6.png',
		    iconSize: [32, 32],
		    iconAnchor: [16, 16],
		});

		var wayPointMarker = L.marker(point, {icon:wayPointIcon}).addTo(map);
		wayPointMarker.bindPopup("<h2>" + namePOI + "</h2>" + "<br><img src='"+th+"'>");
		lyrs.push(wayPointMarker);
	}
	
	var layerGroup = L.featureGroup(lyrs);
	map.invalidateSize();
	map.fitBounds(layerGroup.getBounds()); 
	
	layerGroup.on("loaded", function(e) {
		layerGroup.eachLayer(function (layer) { 
			layer._leaflet_id ='kml'+pm_index+''; 
			pm_index++; 
			id_feature_map[pm_index] = layer; 
		});
	}); 
	
	currentLayer = layerGroup;
	layerGroup.addTo(map);
}//for


function processWikilocData(data, takemethere, ismobile, lyrs){
	var pm_index = 1;
	$.each(data, function(key, val) {
		if(key = "spas"){
				var poiArray = val;
				var numPois = poiArray.length;

				for(var i = 0; i < numPois; i++){
    				var jsonPOI = poiArray[i];

    				var egeo = jsonPOI.egeo;
    				var x = jsonPOI.x;
    				var y = jsonPOI.y;
    				var elev = jsonPOI.elev;
    				var idPOI = jsonPOI.id;
    				var namePOI = (jsonPOI.name != null) ? jsonPOI.name : "";
    				var th = (jsonPOI.th != null) ? jsonPOI.th: "";

					var geometry = null;
					
					
    				if(egeo){
    					geometry = L.Polyline.fromEncoded(egeo);
    					//geometry.bindPopup("<h2>" + namePOI + "</h2>" + "<br><img src='"+th+"'>");
    					geometry.bindPopup("<h2>" + namePOI + "</h2>");
    					
    					geometry._leaflet_id ='kml'+pm_index+''; 
    					id_feature_map[pm_index] = geometry; 
    					pm_index++; 
    					
    					lyrs.push(geometry);
    					
    					
    					
    					//getLatLngs()
    					var points = geometry.getLatLngs();

    					var startPoint = points[0];
    					var endPoint = points[points.length - 1];
    					
    					var startIcon = L.icon({
    					    iconUrl: 'http://www.google.com/mapfiles/dd-start.png',
    					    iconSize: [20, 34],
    					    iconAnchor: [10, 18],
    					});

    					var startMarker = L.marker(startPoint, {icon:startIcon});
    					
    					
    					
    					var popup;
    					if(isIOS){
    						popup = '<a href="http://maps.google.com/maps?ll='+startPoint.lat+","+startPoint.lng+'" class="btn btn-success">'+takemethere+'</a>';
    					}else{
    						popup = '<a href="geo:'+startPoint.lat+','+startPoint.lng+'?q='+startPoint.lat+','+startPoint.lng+'" class="btn btn-success">'+takemethere+'</a>';
    					}
    					
    					startMarker.bindPopup(popup);
    					startMarker._leaflet_id ='kml'+pm_index+''; 
    					id_feature_map[pm_index] = startMarker; 
    					pm_index++;
    					lyrs.push(startMarker);
    					
				        var dx= endPoint.lng - startPoint.lng;
				        var dy = endPoint.lat - startPoint.lat;
				        var q = 6378137 * Math.PI * Math.sqrt(dx*dx+dy*dy)/180;
				        
				       // if(q>250){
			        	var endIcon = L.icon({
    					    iconUrl: 'http://www.google.com/mapfiles/dd-end.png',
    					    iconSize: [20, 34],
    					    iconAnchor: [10, 18],
    					});

    					var endMarker = L.marker(endPoint, {icon:endIcon});
    					endMarker._leaflet_id ='kml'+pm_index+''; 
    					
    					var popup2;
    					if(isIOS){
    						popup2 = '<a href="http://maps.google.com/maps?ll='+endPoint.lat+","+endPoint.lng+'" class="btn btn-success">'+takemethere+'</a>';
    					}else{
    						//popup2 = '<a href="geo:'+endPoint.lat+','+endPoint.lng+'" class="btn btn-success">'+takemethere+'</a>';
    						popup2 = '<a href="geo:'+endPoint.lat+','+endPoint.lng+'?q='+endPoint.lat+','+endPoint.lng+'" class="btn btn-success">'+takemethere+'</a>';

    					}
    					
    					endMarker.bindPopup(popup2);
    					
    					id_feature_map[pm_index] = endMarker; 
    					pm_index++;
    					lyrs.push(endMarker);
				        //}
    					
        			}else{
        				
        				var point = L.latLng(y, x);
        	
        				
        				var wayPointIcon = L.icon({
    					    iconUrl: 'http://maps.google.com/mapfiles/kml/pal5/icon6.png',
    					    iconSize: [32, 32],
    					    iconAnchor: [16, 16],
    					});

    					var wayPointMarker = L.marker(point, {icon:wayPointIcon});
    					
    					var popup3 = "<h2>" + namePOI + "</h2><img src='"+th+"'>";
    					var geoUrl;
    					if(isIOS){
    						geoUrl = '<br><a href="http://maps.google.com/maps?ll='+y+","+x+'" class="btn btn-success">'+takemethere+'</a>';
    					}else{
    						geoUrl = '<br><a href="geo:'+y+','+x+'?q='+y+','+x+'" class="btn btn-success">'+takemethere+'</a>';
    					

    					}
    					popup3 += geoUrl;
    					var divNode = document.createElement('div');
    					divNode.innerHTML = popup3;
    					wayPointMarker.bindPopup(divNode);
    					
    					//wayPointMarker.bindPopup(popup);
    					
    					wayPointMarker._leaflet_id ='kml'+pm_index+''; 
    					id_feature_map[pm_index] = wayPointMarker; 
    					pm_index++; 
    					
    					lyrs.push(wayPointMarker);
        			}
				}//for
			}//if
		});//each json element
}
	

function loadWikilocTrack(map, friendlyUrl, options){
		var takemethere = options["takemethere"];
		var ismobile = options["ismobile"];
		
		var lyrs = [];
		var json = getCachedMap(friendlyUrl);
		
		if(json){
			parsedJson = $.parseJSON(json);
			processWikilocData(parsedJson, takemethere, ismobile, lyrs);
			
			var _layerGroup = L.featureGroup(lyrs);
			currentLayer = _layerGroup;
			_layerGroup.addTo(map);
			
			//map.invalidateSize();
			
			var bounds = _layerGroup.getBounds();
			var center = bounds.getCenter();
			var zoomLevel = map.getBoundsZoom(bounds);
			map.setView(center, zoomLevel, true);
			
		}else{
			var url = BACK_END_SERVER + "/mapas_api/getjson/" + GEO_TABLE + "/" + friendlyUrl;
			$.getJSON(url, function(data, status, jqXhr) {
				json = jqXhr.responseText;
				cacheMap(friendlyUrl, json);
				processWikilocData(data, takemethere, ismobile, lyrs);
				
				var _layerGroup = L.featureGroup(lyrs);
				currentLayer = _layerGroup;
				_layerGroup.addTo(map);
				//map.invalidateSize();
				
				var bounds = _layerGroup.getBounds();
				var center = bounds.getCenter();
				var zoomLevel = map.getBoundsZoom(bounds);
				map.setView(center, zoomLevel, true);

			});//$.getJson
		}
}


function loadPanoramas(xmin, ymin, xmax, ymax){
	$.getJSON("http://www.panoramio.com/map/get_panoramas.php?order=popularity&set=full&from=0&to=30&minx="+xmin+"&miny="+ymin+"&maxx="+xmax+"&maxy="+ymax+"&size=square&callback=?",
   function(data) {
       if(data.photos.length === 0){
    	   $("#pics").html("No hay fotos disponibles / Not available photos");
       }else{
    	   var thePicsHTML = "";
	       $(data.photos).each(function(i, item) {
		         thePhoto = item;
		         thePicsHTML +="<a href='"+thePhoto.photo_url+"' target=_blank><img  src='" + thePhoto.photo_file_url + "' alt='"+thePhoto.photo_title+"' title='"+thePhoto.photo_title+"'></a>";
	       });
		   $("#pics").html(thePicsHTML);
       }
	});//getjson
}
   
