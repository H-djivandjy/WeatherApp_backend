var express = require('express');
var router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');
const City = require('../models/cities');

const myApiKey = process.env.API_KEY;
//
router.post('/', (req, res) => {
	// Check if the city has not already been added
	City.findOne({ cityName: { $regex: new RegExp(req.body.cityName, 'i') } }).then(dbData => {
		if (dbData === null) {
			// Request OpenWeatherMap API for weather data
			fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&appid=${myApiKey}&units=metric`)
				.then(response => response.json())
				.then(apiData => {
					 // Capitalize the first letter of each word in the city name
					 const capitalizedCityName = req.body.cityName
					 .split(' ')
					 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					 .join(' ');
		 
				   // Creates new document with weather data
				   const newCity = new City({
					 cityName: capitalizedCityName, // Use the capitalized name
					 main: apiData.weather[0].main,
					 description: apiData.weather[0].description,
					 tempMin: apiData.main.temp_min,
					 tempMax: apiData.main.temp_max,
				   });

					// Finally save in database
					newCity.save().then(newDoc => {
						res.json({ result: true, weather: newDoc });
					});
				});
		} else {
			// City already exists in database
			res.json({ result: false, error: 'City already saved' });
		}
	});
});

router.get('/', (req, res) => {
	City.find().then(data => {
		res.json({ weather: data });
	});
});

router.get("/:cityName", (req, res) => {
  City.findOne({
    cityName: { $regex: new RegExp(req.params.cityName, "i") },
  }).then(data => {
    if (data) {
      res.json({ result: true, weather: data });
    } else {
      res.json({ result: false, error: "City not found" });
    }
  });
});

router.delete("/:cityName", (req, res) => {
  City.deleteOne({
    cityName: { $regex: new RegExp(req.params.cityName, "i") },
  }).then(deletedDoc => {
    if (deletedDoc.deletedCount > 0) {
      // document successfully deleted
      City.find().then(data => {
        res.json({ result: true, weather: data });
      });
    } else {
      res.json({ result: false, error: "City not found" });
    }
  });
});

module.exports = router;
