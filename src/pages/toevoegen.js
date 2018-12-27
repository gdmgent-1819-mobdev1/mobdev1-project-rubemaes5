// Only import the compile function from handlebars instead of the entire library
import {
    compile
} from 'handlebars';
import update from '../helpers/update';
import mapboxgl from 'mapbox-gl';
const mapTemplate = require('../templates/page-with-map.handlebars');
const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const toevoegenTemplate = require('../templates/toevoegen.handlebars');

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(toevoegenTemplate)({

    }));
    let username;
    let useremail = localStorage.getItem("useremail");

    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            console.log(username)
            if (data.type === "student") {

                document.querySelector('.navigationstudent').style.display = "block";

            } else {

                document.querySelector('.navigationkotbaas').style.display = "block";
            }
        });

    })
    let prijs = document.querySelector('.price');
    let borg = document.querySelector('.borg');
    let soort = document.querySelector('.type');
    let oppervlakte = document.querySelector('.area');
    let verdieping = document.querySelector('.floor');
    let aantalPersonen = document.querySelector('.amount');
    let aantalKoten = document.querySelector('.amount_rooms');
    let toilet = document.querySelector('.bathroom');
    let douche = document.querySelector('.shower');
    let bad = document.querySelector('.bath');
    let keuken = document.querySelector('.kitchen');
    let meubels = document.querySelector('.furniture');
    let stad = document.querySelector('.city');
    let straat = document.querySelector('.street');
    let huisnummer = document.querySelector('.number');
    let postcode = document.querySelector('.postal');
    let beschrijving = document.querySelector('.description');
    let fileName;
    let lat;
    let long;
    if (firebase) {
        const fileUpload = document.getElementById('image');

        fileUpload.addEventListener('change', (evt) => {
            if (fileUpload.value !== '') {
                fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
                const storageRef = firebase.storage().ref(`images/${fileName}`);

                storageRef.put(evt.target.files[0]);
            }
        });
    }

    document.querySelector('.verstuurtoevoegen').addEventListener('click', function (e) {
        e.preventDefault();
        let fulladdress = huisnummer.value + ' ' + straat.value + ' ' + stad.value + ' ' + postcode.value;
        let regex = / /gi;
        let address = fulladdress.replace(regex, "%20");
        let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?types=address&access_token=pk.eyJ1IjoiYnJlYWtpbmcyNjIiLCJhIjoiY2puOWF4d2huMDRtMTNycDg5eTBkaWw2aSJ9.L5hwBhfK_8aFPp6nTCruwQ";
        console.log(url);
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                long = data.features[0].center[0];
                lat = data.features[0].center[1];
                firebase.database().ref('/koten').push({
                    huurbaas: username,
                    prijs: prijs.value,
                    borg: borg.value,
                    soort: soort.value,
                    oppervlakte: oppervlakte.value,
                    verdieping: verdieping.value,
                    aantalpersonen: aantalPersonen.value,
                    aantalkoten: aantalKoten.value,
                    toilet: toilet.value,
                    douche: douche.value,
                    bad: bad.value,
                    keuken: keuken.value,
                    meubels: meubels.value,
                    stad: stad.value,
                    straat: straat.value,
                    huisnummer: huisnummer.value,
                    postcode: postcode.value,
                    beschrijving: beschrijving.value,
                    foto: fileName,
                    lat: lat,
                    long: long
                });
            location.reload();
            });



    })
};
