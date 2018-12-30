// Only import the compile function from handlebars instead of the entire library
import {
    compile
} from 'handlebars';
import update from '../helpers/update';
import mapboxgl from 'mapbox-gl';
import config from '../config';
const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const searchTemplate = require('../templates/search.handlebars');

export default () => {
    if (localStorage.getItem("useremail") !== null) {
        console.log('logged in');
    } else {
        console.log('not logged in')
        window.location.href = '/#/login';
    }
    // Data to be passed to the template
    const user = 'Test user';
    // Return the compiled template to the router
    update(compile(searchTemplate)({

    }));
     document.querySelector('.hamburger').addEventListener('click', function(){
        document.querySelector('.fullnav').style.left = "0%";
    })
    document.querySelector('.closenav').addEventListener('click', function(){
        document.querySelector('.fullnav').style.left = "100%";
    })
    document.getElementById('logout').addEventListener('click', function () {
        firebase.auth().signOut().then(function () {
            console.log("loggedout");
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserKey');
            localStorage.removeItem('useremail');

            location.reload();
        }, function (error) {
            // An error happened.
        });
    })
    document.getElementById('logout2').addEventListener('click', function () {
        firebase.auth().signOut().then(function () {
            console.log("loggedout");
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserKey');
            localStorage.removeItem('useremail');
            location.reload();
        }, function (error) {
            // An error happened.
        });
    })
    let latuser;
    let longuser;
    let latkot;
    let longkot;
    let distance;
    let username;
    let useremail = localStorage.getItem("useremail");
    let availableKots = [];
    let userkey;
    let soort;
    let oppervlakte;
    let minhuurprijs;
    let maxhuurprijs;
    let minafstand;
    let maxafstand;
    let map;
    
    if (config.mapBoxToken) {
        mapboxgl.accessToken = config.mapBoxToken;
        // eslint-disable-next-line no-unused-vars
        map = new mapboxgl.Map({
            container: 'map',
            center: [3.724336, 51.049692],
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 12,
        });
    } else {
        console.error('Mapbox will crash the page if no access token is given.');
    }
    firebase.database().ref('/koten').on('value', function (snap) {
        snap.forEach(function (childSnapshot) {
            let dat = childSnapshot.val();
            setTimeout(function(){
                map.addSource("geomarker" + childSnapshot.key, { //making a source for the radius
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [dat.long, dat.lat]
                            }
                        }]
                    }
                });
                map.addLayer({ //displaying the radius of the circle
                    "id": "geomarker" + childSnapshot.key,
                    "type": "circle",
                    "source": "geomarker" + childSnapshot.key,
                    "paint": {
                        "circle-radius": 10, //radius with the variable radius
                        "circle-color": "#FF0000", //color
                        "circle-opacity": 1, //opacity
                    }
                });
                }, 1000)
            
        })
    })
    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            userkey = childSnapshot.key;
            localStorage.setItem('userkey', userkey);
            latuser = data.lat;
            longuser = data.long;

            console.log(username)
            document.getElementById('username').innerHTML = username;
            if (data.type === "student") {
                document.querySelector('.navigationstudent').style.display = "block";
                firebase.database().ref("/koten").on('value', function (snaps) {
                    document.querySelector('.kotlist').innerHTML += ""

                    snaps.forEach(function (childsnapshots) {
                        let datas = childsnapshots.val();
                        latkot = datas.lat;
                        longkot = datas.long;
                        let R = 6371; // Radius of the earth in km
                        let dLat = deg2rad(latkot - latuser); // deg2rad below
                        let dLon = deg2rad(longkot - longuser);
                        let a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(deg2rad(latuser)) * Math.cos(deg2rad(latkot)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        let d = R * c; // Distance in km
                        let distance = d.toFixed(3);
                        let x = {
                            aantalkoten: datas.aantalkoten,
                            foto: datas.foto,
                            key: childsnapshots.key,
                            address: datas.straat + " " + datas.huisnummer + ", " + datas.postcode + " " + datas.stad,
                            prijs: parseInt(datas.prijs),
                            lat: datas.lat,
                            soort: datas.soort,
                            long: datas.long,
                            aantalpersonen: datas.aantalpersonen,
                            bad: datas.bad,
                            beschrijving: datas.beschrijving,
                            borg: datas.borg,
                            douche: datas.douche,
                            huisnummer: datas.huisnummer,
                            stad: datas.stad,
                            straat: datas.straat,
                            postcode: datas.postcode,
                            meubels: datas.meubels,
                            oppervlakte: parseInt(datas.oppervlakte),
                            toilet: datas.toilet,
                            verdieping: datas.verdieping,
                            afstand: distance,
                            huurbaaskey: datas.huurbaaskey
                        }
                        availableKots.push(x);
                        console.log(availableKots);

                    })
                    for (let i = 0; i < availableKots.length; i++) {
                        document.querySelector('.kotlist').innerHTML += "<div class='contentkot' id='" + availableKots[i].key + "'><div class='addreskot'><span>" + availableKots[i].straat + " " + availableKots[i].huisnummer + ", " + availableKots[i].postcode + " " + availableKots[i].stad + "<br>" + availableKots[i].afstand + "</span> km van de campus</div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + availableKots[i].foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'><div>€" + availableKots[i].prijs + "<span>/maand</span></div></div>";

                        let detailbuttons = document.querySelectorAll('.contentkot');
                        for (let i = 0; i < detailbuttons.length; i++) {
                            detailbuttons[i].addEventListener('click', function () {
                                let getkey = detailbuttons[i].id;
                                localStorage.setItem('currentKot', getkey)
                                window.location.href = '/#/kotdetail';
                            })
                        }
                    }
                    document.querySelector('.filterknop').addEventListener('click', function () {
                        
                        soort = document.querySelector('.type').value;
                        oppervlakte = document.querySelector('.oppervlakte').value;
                        minafstand = document.querySelector('.mindistance').value;
                        maxafstand = document.querySelector('.maxdistance').value;
                        minhuurprijs = document.querySelector('.minprice').value;
                        maxhuurprijs = document.querySelector('.maxprice').value;

                        if (soort !== "" && oppervlakte !== "" && minafstand !== "" && maxafstand !== "" && minhuurprijs !== "" && maxhuurprijs !== "") {
                            document.querySelector('.kotlist').innerHTML = "";
                            console.log('dit werkt')
                            for (let i = 0; i < availableKots.length; i++) {
                                let d = i;
                                if (soort === availableKots[d].soort && oppervlakte <= availableKots[d].oppervlakte && maxafstand >= availableKots[d].afstand && minafstand <= availableKots[d].afstand && minhuurprijs <= availableKots[d].prijs && maxhuurprijs >= availableKots[d].prijs) {
                                    console.log('werkt dit?')
                                    document.querySelector('.kotlist').innerHTML += "<div class='contentkot' id='" + availableKots[d].key + "'><div class='addreskot'><span>" + availableKots[d].straat + " " + availableKots[d].huisnummer + ", " + availableKots[d].postcode + " " + availableKots[d].stad + "<br>" + availableKots[d].afstand + "</span>km van de campus</div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + availableKots[d].foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'><div>€" + availableKots[d].prijs + "<span>/maand</span></div></div>";
                                    let detailbuttons = document.querySelectorAll('.contentkot');
                                    for (let i = 0; i < detailbuttons.length; i++) {
                                        detailbuttons[i].addEventListener('click', function () {
                                            let getkey = detailbuttons[i].id;
                                            localStorage.setItem('currentKot', getkey)
                                            window.location.href = '/#/kotdetail';
                                        })
                                    }
                                } else {
                                    continue;
                                }
                            }
                        }else{
                            document.querySelector('.error').style.transform = "scale(1)";
                        }
                    })
                })
            }
        })
    })

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

}
