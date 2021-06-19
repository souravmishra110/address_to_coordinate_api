const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const fetch = require("node-fetch");

const PORT = process.env.PORT;//remove 3000 when pushing into production

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
        return data;
    } catch (e) {
        console.log("SOMETHING WENT WRONG!!!", e)
        return "NOT FOUND";
    }
}

app.post('/', async (req, res) => {
    const addressList = req.body;
    var result = [];
    for(address of addressList){
        // console.log(address);
        const getCoordinates = await fetchGeocode(address);
        // console.log(getCoordinates.status);
        if(getCoordinates.status === "OK"){
            const {lat , lng} = getCoordinates.results[0].geometry.location;
            const data = {"add": address, "location": [lat , lng]}
            result.push(data);
        }
        else {
            const data = {"add": address, "location": ["NOT Found" , "NOT Found"]}
            result.push(data);
        }
    }
   
    res.send(result)
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})