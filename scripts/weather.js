var moment 					= require('moment');  require('moment-range');
var weather = {};

weather.getWeatherForSchedule = getWeatherForSchedule;

module.exports = weather;


// Method to build weather information for a given schedule

function getWeatherForSchedule(schedule){

	var newSchedule = [];
	var i = 1;

	schedule.forEach(function(sch){
		//weather api to get climate details

		var dayRange = moment.range(sch.startDate, sch.endDate);
		dayRange.toArray('days').forEach(function(d){
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
			var request = new XMLHttpRequest();
			request.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + sch.location + "&units=metric&date="+ d + "&APPID=73136fa514890c15bc4534e7b8a1c0c4", false);
			request.send();
			request = JSON.parse(request.responseText);

			var icon = "/public/assets/m/img/ic/"+ request.weather[0].icon +".png";
			var schedule = {
				day : i,
				date : d,
				location: sch.location,
				climate:{
					daylike:request.weather[0].main,
					temperature:request.main.temp,
					minTemp:request.main.temp_min,
					maxTemp:request.main.temp_max,
					icon: icon
				}
			}; // end of schedule object
			i++;
			newSchedule.push(schedule);
		}); // end of day loop
	}); // end of schedule loop

	return newSchedule;
}
