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
const favoritesTemplate = require('../templates/favorites.handlebars');

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(favoritesTemplate)({
        name
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
    let username;
    let userkey;
    let useremail = localStorage.getItem("useremail");
    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            userkey = childSnapshot.key;
            localStorage.setItem('userkey', userkey);


            console.log(username)
            document.getElementById('username').innerHTML = username;
            if (data.type === "student") {
                document.querySelector('.navigationstudent').style.display = "block";
                firebase.database().ref("/favorites/" + userkey).on("value", function (snap) {
                    document.querySelector('.listfavorites').innerHTML = "";
                    snap.forEach(function (childSnapshot) {
                        let data = childSnapshot.val();

                        document.querySelector('.listfavorites').innerHTML += "<div class='contentkot' id='" + childSnapshot.key + "'><div class='addreskot'><span>" + data.straat + " " + data.huisnummer + ", </span><span>" + data.postcode + " " + data.stad + "<br>"+data.afstand+"km van de campus</span></div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + data.foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'></div><p id='" + childSnapshot.key + "' class='remove'>verwijderen</p>";

                        let removebuttons = document.querySelectorAll('.remove');
                        for (let i = 0; i < removebuttons.length; i++) {
                            removebuttons[i].addEventListener('click', function () {
                                let getkey = removebuttons[i].id;
                                firebase.database().ref('favorites/' + userkey +"/"+getkey).remove();
                            })
                        }
                    })
                })
            }
        })
    })
    console.log(userkey)

};
