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
                document.querySelector('.navigationstudent').style.display = "block";
                firebase.database().ref("/koten").on('value', function (snaps) {
                    document.querySelector('.kotlist').innerHTML += ""
                    
                    snaps.forEach(function(childsnapshots){
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
                        document.querySelector('.kotlist').innerHTML += "<div class='contentkot' id='" + childsnapshots.key + "'><div class='addreskot'><span>" + datas.straat +" "+datas.huisnummer+", " +datas.postcode+" "+datas.stad+ "<br>"+distance+"</span>km van de campus</div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + datas.foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'><div>€"+datas.prijs+"<span>/maand</span></div></div>"
                    })
                })
            }
        })
    })
    function deg2rad(deg) {
  return deg * (Math.PI/180)
}
}