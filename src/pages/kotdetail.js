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
const kotdetailTemplate = require('../templates/kotdetail.handlebars');

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(kotdetailTemplate)({}));
    document.querySelector('.hamburger').addEventListener('click', function () {
        document.querySelector('.fullnav').style.left = "0%";
    })
    document.querySelector('.closenav').addEventListener('click', function () {
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
    let currentKot = localStorage.getItem('currentKot');
    let availableKots = [];
    let userkey;
    let userType;
    let kotbaaskey;
    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            userkey = childSnapshot.key;
            localStorage.setItem('userkey', userkey);
            latuser = data.lat;
            longuser = data.long;
            userType = data.type;
            localStorage.setItem('userType', userType);
            console.log(username)
            document.getElementById('username').innerHTML = username;
            if (data.type === "student") {
                document.querySelector('.navigationstudent').style.display = "block";
            } else {
                document.querySelector('.navigationkotbaas').style.display = "block"
            }
            firebase.database().ref('koten/' + currentKot).on('value', function (snaps) {

                let datas = snaps.val();
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
                let kotdetail = document.querySelector('.kotdetail');
                let content = "<img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + datas.foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0'><div class='info'><h1>" + datas.soort + " - €" + datas.prijs + "</h1><h2>" + datas.straat + " " + datas.huisnummer + ", " + datas.postcode + " " + datas.stad + "</h2><table><tr><td>bad</td><td>" + datas.bad + "</td></tr><tr><td>douche</td><td>" + datas.douche + "</td></tr><tr><td>toilet</td><td>" + datas.toilet + "</td></tr><tr><td>keuken</td><td>" + datas.keuken + "</td></tr><tr><td>meubels</td><td>" + datas.meubels + "</td></tr><tr><td>waarborg</td><td>€" + datas.borg + "</td></tr><tr><td>verdieping</td><td>" + datas.verdieping + "</td></tr><tr><td>aantal koten</td><td>" + datas.aantalkoten + "</td></tr><tr><td>aantal personen per kot</td><td>" + datas.aantalpersonen + "</td></tr><tr><td>oppervlakte</td><td>" + datas.oppervlakte + "m&sup2;</td></tr></table><p>" + datas.beschrijving + "<br><br>"+distance+" km van uw campus!</p></div>";
                kotdetail.innerHTML = content;
                kotbaaskey = datas.huurbaaskey;
                document.querySelector('.messagebutton').addEventListener('click', function () {
                    document.querySelector('.messageform').style.display = "block";
                })
                document.querySelector('.submitbutton').addEventListener('click', function (e) {
                    e.preventDefault();
                    firebase.database().ref('messages/').push({
                        sender: userkey,
                        sendername: username,
                        receiver: kotbaaskey,
                        message: document.querySelector('.message').value,
                        receivername: datas.huurbaas
                    })
                    location.reload();
                })
                document.querySelector('.favoritebutton').addEventListener('click', function (e) {
                    e.preventDefault();
                    firebase.database().ref("favorites/" + userkey + "/" + currentKot).set({
                        aantalkoten: datas.aantalkoten,
                        foto: datas.foto,
                        lat: datas.lat,
                        long: datas.long,
                        stad: datas.stad,
                        postcode: datas.postcode,
                        huisnummer: datas.huisnummer,
                        straat: datas.straat,
                        bad: datas.bad,
                        aantalpersonen: datas.aantalpersonen,
                        beschrijving: datas.beschrijving,
                        borg: datas.borg,
                        douche: datas.douche,
                        meubels: datas.meubels,
                        oppervlakte: datas.oppervlakte,
                        toilet: datas.toilet,
                        verdieping: datas.verdieping,
                        afstand: distance,
                        prijs: datas.prijs,
                        huurbaaskey: datas.huurbaaskey,
                    })
                })

            })
        })
    })
    var fbButton = document.getElementById('fb-share-button');
    var url = "http://www.codeddesign.be";

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    fbButton.addEventListener('click', function () {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
            'facebook-share-dialog',
            'width=800,height=600'
        );
        return false;
    });
};
