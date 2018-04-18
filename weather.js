(d => {

	// Set initial values
	let input = d.getElementById("input");
	const urlBase = "http://interview.toumetisanalytics.com/";

	let clicked = (e) => {
		// Get city from user input and set initial variables
		let city = input.value;
		let url = urlBase + "location/" + city;

		// Get data from API at /location, turn into json and retrieve city id
		fetch(url).then((response) => response.json())
			.then(( response ) => {
			let id = response[0].woeid;

			// Get weather from API for the city id
			fetch(urlBase + "weather/" + id).then((response) => response.json()) 
				.then((response) => {

					// Use moment library to handle nice display of dates and times
					// Set data for current display boxes where today is the first element in the response data array
					d.getElementById("current-temp").textContent = response.consolidated_weather[0].the_temp.toFixed(3);
					d.getElementById("current-weather").textContent = response.consolidated_weather[0].weather_state_name;
					d.getElementById("current-sundown").textContent = moment(response.sun_set).fromNow();
					
					// Set up arrays for graph data
					let days = response.consolidated_weather.map(date => moment(date.applicable_date).format("Do MMM"));
					let maxTemp = response.consolidated_weather.map(date => date.max_temp);
					let minTemp = response.consolidated_weather.map(date => date.min_temp);

					// Assume average temperature is calculated from high and low forecast temps
					let avgTemp = response.consolidated_weather.map(date => (date.max_temp + date.min_temp) / 2);

					// Use Highcharts to display data in graph
				    var myChart = Highcharts.chart('graph', {
				        chart: {
				            type: 'column'
				        },
				        title: {
				            text: 'Six Day Forecast'
				        },
				        xAxis: {
				            categories: days
				        },
				        yAxis: {
				            title: {
				                text: 'Values'
				            }
				        },
				        series: [{
				            name: 'Max temp',
				            data: maxTemp
				        }, {
				        	name: 'Avg temp',
				        	data: avgTemp
				        }, {
				            name: 'Min temp',
				            data: minTemp
				        }]
				    });
				});
			})

		// Error handling for a failure returning data from the API
		.catch(function(error) {
	    	console.log(JSON.stringify(error));
	  	});
	}

	// Event handling on submit button
	d.getElementById("submit").addEventListener("click", clicked);

})(document);