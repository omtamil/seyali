var application_key = 'Fmjtd%7Cluurn1u220%2Cb2%3Do5-9wy25y';
var mapquest_server = "http://open.mapquestapi.com/";

var profile_request = "elevation/v1/profile?key=" + application_key+"&shapeFormat=raw";
var chart_request = "elevation/v1/chart?key=" + application_key+"&shapeFormat=raw";

	
/**
 * currentLayer objeto del tipo L.featureGroup(lyrs);
 */	
function getElevationProfile(currentLayer, responseProcesser){
	var latLngCollection = getLatLngCollection(currentLayer);
	if(latLngCollection !== ""){
		request = mapquest_server + profile_request + "&" + "latLngCollection="+latLngCollection;
		
		ajaxRequest = $.ajax({
			url:request 
		});
		
		ajaxRequest.then( function (response) {
			responseProcesser(response);
		});
	
	} else{
		responseProcesser(null);
	}
}

function getLatLngCollection(currentLayer){
	var solution = "";
	
	var coordinates = null;
	currentLayer.eachLayer(function(layer){
		var geometry = layer;
		
		if(geometry instanceof L.Polyline){
			coordinates = geometry.getLatLngs();
		}	
	});
	
	if(coordinates != null){
		simplified_coordinates = simplify(coordinates, 0.001, false);
		for(var j = 0; j < simplified_coordinates.length -1; j++){
			lat = simplified_coordinates[j].lat;
			lng = simplified_coordinates[j].lng;
			
			solution += lat+","+lng+",";
		}
		solution += simplified_coordinates[simplified_coordinates.length -1].lat + ","+coordinates[simplified_coordinates.length-1].lng;
	}
	
	return solution;
}


function ProfileStatistics(){
	this.length = 0;
	
	this.minElevation = 999999999;
	this.maxElevation = -99999999;
	
	this.numPoints = 0;
	this.sumElevation = 0;

	this.minAspect = 99999999;
	this.maxAspect = -9999999;
	
	this.sumAspectUp = 0;
	this.countAspectUp = 0;
	
	this.sumAspectDown = 0;
	this.countAspectDown = 0;
	
	this.minElevationPoint = null;
	this.maxElevationPoint = null;
	
	this.changingAspectPoints = [];
	
	this.prevPoint = null;
	this.prevAspect = null;
	
	//difficulty index (rocky mountains)
	this.climbingElevation = 0;
	this.descendingElevation = 0;
	
	//difficulty index (topofusion)
	this.sum_fiff_s = 0;
}

ProfileStatistics.prototype.setDistance = function(length){
	this.length = length;
}

ProfileStatistics.prototype.processPoint = function(point){
	var distance = point.distance;
	
	if(distance > this.length)
		this.length = distance;
	
	
	var height = point.height;
	
	if(height > this.maxElevation){
		this.maxElevation = height;
		this.maxElevationPoint = point;
	}
	if(height < this.minElevation){
		this.minElevation = height;
		this.minElevationPoint = point;
	}
	
	this.numPoints++;
	this.sumElevation += height;
	
	if(this.prevPoint != null){
		
		var dh = height - this.prevPoint.height;
		if(dh > 0)
			this.climbingElevation += dh;
		else if(dh < 0)
			this.descendingElevation += dh;
		
		
		
		var dx = (distance - this.prevPoint.distance) * 1000;//in km
		
		var aspect = (dh / dx) * 100;
		if(aspect > this.maxAspect)
			this.maxAspect = aspect;
		if(aspect < this.minAspect)
			this.minAspect = aspect;
		
		if(aspect > 0){
			this.sumAspectUp += aspect;
			this.countAspectUp++;
		}else if(aspect < 0){
			this.sumAspectDown += aspect;
			this.countAspectDown++;
		}
		
		this.sumAspect += aspect;
		
		if(this.prevAspect !== null){
			if(this.prevAspect * aspect < 0){
				this.changingAspectPoints.push(point);
			}
		}
		
		//topofusion difficulty index
		var diff_s;
		if(aspect > 1){
			diff_s = dx * Math.pow((50 * aspect), 1.7);
			
		}else{
			diff_s = dx;
		}
		this.sum_fiff_s += diff_s;
		
		this.prevAspect = aspect;
	}
	this.prevPoint = point;
		
};



ProfileStatistics.prototype.computeMeanHeight = function(){
	return this.sumElevation / this.numPoints;
};

ProfileStatistics.prototype.computeMeanAspectUp = function(){
	return this.sumAspectUp / this.countAspectUp;
};

ProfileStatistics.prototype.computeMeanAspectDown = function(){
	return this.sumAspectDown / this.countAspectDown;
};

/**
 * Difficulty index rocky mountains
 * http://www.veiks.com/trails/help.php
 * 
 * In this index the more weighted factor es length, in km.
 * 
 * @returns {Number}
 */
ProfileStatistics.prototype.difficultyIndex_rm = function(){
	return (this.climbingElevation * 0.0015) + (this.descendingElevation * 0.0005) + this.length;
	
	//(One way hike) Difficulty Index = (C * 0.0015) + (D * 0.0005) + M
};

ProfileStatistics.prototype.difficultyIndex_topofusion = function(){
	return this.sum_fiff_s / 10000000;
};

/*
Thus, we loop through all the segments between GPS points in a track and compute: 

	Run - 2D distance traveled (meters)
	Grade - rise over run (dimensionless)

	If Grade > 1%, we consider it a climb, and multiply by a exponential: 

	Diff_S = Run * (50 * Grade) ^ 1.7 

	else (Flat and Downhill case) 

	Diff_S = Run 

	Where Diff_S is the difficulty of each segment (between two GPS points). 
	
	We then add all Diff_S values together, across the GPS track. 
	
	Then we divide by 10,000 in order to scale the numbers to a more user friendly range. 
	
	
	A hard mountain bike ride might be 50 on the difficulty index, 
	this way, and a REALLY hard one might hit 100. 
	
	This sum, Difficulty Index, is displayed in a column of the active file list 
	in TopoFusion. The numbers themselves don't "mean" anything, 
	but are intended as a comparision metric between tracks. 
*/

/*elevation profile rendering functions*/

function paintGraph() {
     var plot = $.jqplot('chart_id',  [jqPlot],{
    	      series:[{showMarker:false}],
    	      seriesDefaults: {
    	          showMarker:false,
    	          //pointLabels: { show:true },
    	          fill:true
    	      },
    	      axes:{
    	        xaxis:{
    	          label:'Distancia (m.)',
    	          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
    	          min:0
    	        },
    	        yaxis:{
    	          label:'Altitud (m.)',
    	          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
    	        }
    	      }
     }).replot();
  }

function computeElevationProfile(pointList){
	  var list_size = pointList.length;
	  jqPlot = [];

	  var profileStatistics = new ProfileStatistics();
	  for(var i = 0; i < list_size;i++){
		  var point = pointList[i];
		  
		  if(point.height === -32768)
			  continue;

		  profileStatistics.processPoint(point);

		  var pointPlot = [];
		  pointPlot[0] = point.distance;
		  pointPlot[1] = point.height;

		  jqPlot.push(pointPlot);
	  }

	  //profileStatistics.setDistance(maxProfileLength);
	  maxProfileLength = profileStatistics.length;
	  
	  pointMinH = profileStatistics.minElevationPoint.height;
	  pointMaxH = profileStatistics.maxElevationPoint.height;

	  dh = pointMaxH.height - pointMinH.height;
	  meanH = profileStatistics.computeMeanHeight();
	  meanAspectUp = profileStatistics.computeMeanAspectUp();
	  meanAspectDown = profileStatistics.computeMeanAspectDown();
	  minAspect = profileStatistics.minAspect;
	  maxAspect = profileStatistics.maxAspect;

	  relevantPoints = profileStatistics.changingAspectPoints;

	  hardIndex = profileStatistics.difficultyIndex_topofusion();
	  
	  return profileStatistics;
}

