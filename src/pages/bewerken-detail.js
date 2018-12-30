// Only import the compile function from handlebars instead of the entire library
import {
    compile
} from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const bewerkenDetailTemplate = require('../templates/bewerken-detail.handlebars');
const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(bewerkenDetailTemplate)({}));
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
    let useremail = localStorage.getItem('useremail');
    let username;
    let currentKey = localStorage.getItem('keyedit');
    console.log(currentKey)
    document.querySelector('.navigationkotbaas').style.display = "block";
    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            document.getElementById('username').innerHTML = username;
        })

    })
    firebase.database().ref("/koten/" + currentKey).on("value", function (snap) {
        let data = snap.val();
        document.querySelector('.price').value = data.prijs;
        document.querySelector('.borg').value = data.borg;
        document.querySelector('.type').value = data.soort;
        document.querySelector('.area').value = data.oppervlakte;
        document.querySelector('.floor').value = data.verdieping;
        document.querySelector('.amount').value = data.aantalpersonen;
        document.querySelector('.amount_rooms').value = data.aantalkoten;
        document.querySelector('.bathroom').value = data.toilet;
        document.querySelector('.shower').value = data.douche;
        document.querySelector('.bath').value = data.bad;
        document.querySelector('.kitchen').value = data.keuken;
        document.querySelector('.furniture').value = data.meubels;
        document.querySelector('.city').value = data.stad;
        document.querySelector('.street').value = data.straat;
        document.querySelector('.number').value = data.huisnummer;
        document.querySelector('.postal').value = data.postcode;
        document.querySelector('.description').value = data.beschrijving;
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
                .then(function (datas) {
                    long = datas.features[0].center[0];
                    lat = datas.features[0].center[1];
                    if (document.getElementById('image').value === '') {
                        firebase.database().ref('/koten/' + currentKey).set({
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
                            foto: data.foto,
                            lat: lat,
                            long: long,
                            huurbaaskey: data.huurbaaskey
                            
                        });
                    } else {
                        firebase.database().ref('/koten/' + currentKey).set({
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
                            long: long,
                            huurbaaskey: data.huurbaaskey
                        });
                    }
                    location.reload();
                });

        })

    })

};
