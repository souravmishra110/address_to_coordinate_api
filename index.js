const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const fetch = require("node-fetch");

const PORT = process.env.PORT || 3000;//remove 3000 when pushing into production

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ))

app.get('/', (req, res) => {
    res.json({user: 'testing'})
})


const fetchGeocode = async (key) => {
    const geo = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    const geoKey = '&key=AIzaSyA5bwbEsAOUMOI4RK2zXcIayG4vjuQSpcw'
    const coordinates = geo+key+geoKey;
    try {
        const res = await fetch(coordinates);
        const data = await res.json();
        // console.log(data.results[0].geometry.location)
        return data.results[0].geometry.location;
    } catch (e) {
        console.log("SOMETHING WENT WRONG!!!", e)
        return e;
    }
}

app.post('/', async (req, res) => {
    const addressList = req.body;
    console.log(addressList);
    var address = addressList[0];
    var getCoordinates = await fetchGeocode(address);
    var {lat , lng} = getCoordinates
    console.log(`${lat} ${lng}`)
    // fetchBitcoinPrice();
    res.send(getCoordinates)
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})