
//https://api.forecast.io/forecast/80c9f9b5c46264d76c609700652f59e9/LATITUDE,LONGITUDE,TIME
//http://maps.googleapis.com/maps/api/geocode/json?address=**CITY**&key=AIzaSyDNURENGhIDhMEzKFowaE7J8bfO2GDpdyw
var KEY='80c9f9b5c46264d76c609700652f59e9'
var BASE_URL = 'https://api.forecast.io/forecast/'

var GEOKEY='AIzaSyDNURENGhIDhMEzKFowaE7J8bfO2GDpdyw'
var GEO_URL='https://maps.googleapis.com/maps/api/geocode/'




var containerNode=document.querySelector('#container')
var weatherSummary=document.querySelector('#weatherSummary')
var buttons=document.querySelector('#buttons')
var renderHourlyView =function(apiResponse){

var summaryConditions = apiResponse.hourly.summary
weatherSummary.textContent = summaryConditions


}

var renderDailyView =function(apiResponse){

var summaryConditions = apiResponse.daily.summary
weatherSummary.textContent = summaryConditions


}

var renderCurrentView=function(apiResponse){

var summaryConditions = apiResponse.currently.summary
weatherSummary.textContent= summaryConditions


}

var getInputHash=function(eventObj){
	
	var updateView = eventObj.target.value
	var currentHash = location.hash.substr(1)
	var hashParts = currentHash.split(',')
	
		var updatedHash= '#' + hashParts[0]+','+hashParts[1]+','+updateView
		
		location.hash=updatedHash


}
buttons.addEventListener('click', getInputHash)


var renderLocalCity=function(apiResponse){
var object = apiResponse
var city = apiResponse.results[2].postcode_localities[0]
textInput.value=city


}

var localCity = function(){
	var currentHash = location.hash.substr(1)
	var hashParts = currentHash.split(',')
	
	var lati = hashParts[0]
		longi = hashParts[1]
var localPromise = $.getJSON(GEO_URL+'json?latlng='+lati+','+longi+'&key='+GEOKEY)
localPromise.then(renderLocalCity)


}


var controller=function(){
	

	
	var currentHash = location.hash.substr(1)




	var hashParts = currentHash.split(',')
	
		var lati = hashParts[0]
			longi = hashParts[1]
			viewType = hashParts[2]

			var url = BASE_URL+KEY+'/'+lati+','+longi
			var weatherPromise = $.getJSON(BASE_URL+KEY+'/'+lati+','+longi)

		if(viewType==='current'){
	weatherPromise.then(renderCurrentView)
		}
		else if(viewType==='daily'){
	weatherPromise.then(renderDailyView)
		}
		else if(viewType==='hourly'){
	weatherPromise.then(renderHourlyView)
		}
			
	
		}
		





var textBG=document.querySelector('#weatherSummaryBG')
var textInput=document.querySelector('#textInput')
var text=textInput.value

textInput.style.width=parseInt(text.length)*25+'px'

var sizeCheck=function(string){
	if(string.length>35){return 300}
	else{return string.length*10}


}


var textRefresh = function(){
var BG=textBG.style.width
var text=textInput.value
textBG.style.width=sizeCheck(weatherSummary.textContent)+'px'
textBG.style.height='50px'
textInput.style.width=parseInt(text.length)*25+'px'
}

var cityChange=function(cityInput){
    if(cityInput.keyCode === 13){
        var city = cityInput.target.value
        var URL = $.getJSON(GEO_URL+'json?address='+city+'&key='+GEOKEY)
        
        URL.then(cityChangeRender)
        
    }
    
}
var cityChangeRender = function (apiResponse){
console.log('AYYY')
console.log(apiResponse)
location.hash= '#' + apiResponse.results[0].geometry.location.lat + ',' + apiResponse.results[0].geometry.location.lng + ',' + 'current'

}
var hashhere 
var getLocalCoordinates = function(geoPos){
	position=geoPos
	
	location.hash='#' + position.coords.latitude + ',' + position.coords.longitude + ',' + 'current'
	hashhere=location.hash
	localCity()
}

var geoError = function(error) {

	console.log(error)
}

textInput.addEventListener('keydown', cityChange)
navigator.geolocation.getCurrentPosition(getLocalCoordinates, geoError);

controller()
window.addEventListener('hashchange',controller)

setInterval(textRefresh,100)
