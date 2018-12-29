// Only import the compile function from handlebars instead of the entire library
import {
    compile
} from 'handlebars';
import update from '../helpers/update';

const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

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
    update(compile(homeTemplate)({

    }));
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
                document.querySelector('.visibleStudent').style.display = "block";
                document.querySelector('.navigationstudent').style.display = "block";
                firebase.database().ref('/koten').on('value', function (snaps) {
                    document.getElementById('tindergame').innerHTML = "";
                    snaps.forEach(function (childSnapshots) {
                        let datas = childSnapshots.val();
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
                        console.log(distance);
                        
                            let x = {
                                aantalkoten: datas.aantalkoten,
                                foto: datas.foto,
                                key: childSnapshots.key,
                                address: datas.straat + " " + datas.huisnummer + ", " + datas.postcode + " " + datas.stad,
                                prijs: datas.prijs,
                                lat: datas.lat,
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
                                oppervlakte: datas.oppervlakte,
                                toilet: datas.toilet,
                                verdieping: datas.verdieping,
                                afstand: distance,
                                huurbaaskey: datas.huurbaaskey
                            }
                        availableKots.push(x);
                        console.log(availableKots);
                    })
                    availableKots.sort((a, b) => a.afstand - b.afstand);
                    console.log(availableKots)

                    function displayShit() {
                        document.querySelector('#tindergame').innerHTML = "";
                        document.querySelector('#tindergame').innerHTML = "<div class='contentkot' id='" + availableKots[0].key + "'><div class='addreskot'><span>" + availableKots[0].address + "<br>"+availableKots[0].afstand+"</span>km van de campus</div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + availableKots[0].foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'></div><div>€"+availableKots[0].prijs+"<span>/maand</span></div>";
                    }
                    displayShit()
                    document.querySelector('.likeButton').addEventListener('click', function () {
                        firebase.database().ref("favorites/" + userkey + "/" + availableKots[0].key).set({
                            aantalkoten: availableKots[0].aantalkoten,
                            foto: availableKots[0].foto,
                            lat: availableKots[0].lat,
                            long: availableKots[0].long,
                            stad: availableKots[0].stad,
                            postcode: availableKots[0].postcode,
                            huisnummer: availableKots[0].huisnummer,
                            straat: availableKots[0].straat,
                            bad: availableKots[0].bad,
                            aantalpersonen: availableKots[0].aantalpersonen,
                            beschrijving: availableKots[0].beschrijving,
                            borg: availableKots[0].borg,
                            douche: availableKots[0].douche,
                            meubels: availableKots[0].meubels,
                            oppervlakte: availableKots[0].oppervlakte,
                            toilet: availableKots[0].toilet,
                            verdieping: availableKots[0].verdieping,
                            afstand: availableKots[0].afstand,
                            prijs: availableKots[0].prijs,
                            huurbaaskey: availableKots[0].huurbaaskey,
                        })
                        availableKots.shift();
                        console.log(availableKots);
                        displayShit();
                    })
                    document.querySelector('.dislikeButton').addEventListener('click', function () {
                        availableKots.shift();
                        displayShit();
                    })
                })

            } else {
                document.querySelector('.visibleKotbaas').style.display = "block";
                document.querySelector('.navigationkotbaas').style.display = "block";
                firebase.database().ref("/koten").orderByChild('huurbaas').equalTo(username).on("value", function (snaps) {
                    document.querySelector('.yourkoten').innerHTML = "";
                    snaps.forEach(function (childSnapshots) {
                        let datas = childSnapshots.val();
                        if (datas.foto) {
                            document.querySelector('.yourkoten').innerHTML +=  "<div class='contentkot' id='" + childSnapshots.key + "'><div class='addreskot'><span>" + datas.straat + " " + datas.huisnummer + ", </span><span>" + datas.postcode + " " + datas.stad + "</div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + datas.foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'><div>€"+datas.prijs+"<span>/maand</span></div></a></div>"
                        } else {
                            document.querySelector('.yourkoten').innerHTML += "<div class='contentkot'><p>" + datas.straat + " " + datas.huisnummer + "</p><p>" + datas.postcode + " " + datas.stad + "</p></div><div>€"+datas.prijs+"<span>/maand</span></div>";
                        }
                    })
                })
            }
        });

    })
    function deg2rad(deg) {
  return deg * (Math.PI/180)
}

}
