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
const loginTemplate = require('../templates/login.handlebars');

export default () => {

    // Data to be passed to the template
    const user = 'Test user';
    // Return the compiled template to the router
    update(compile(loginTemplate)({

    }));
    document.querySelector('.hamburger').addEventListener('click', function () {
        document.querySelector('.fullnav').style.left = "0%";
    })
    document.querySelector('.closenav').addEventListener('click', function () {
        document.querySelector('.fullnav').style.left = "100%";
    })
    let createbutton = document.querySelector('.createbutton');
    let loginbutton = document.querySelector('.loginbutton');
    let createemail = document.querySelector('.emailcreate');
    let createpassword = document.querySelector('.passwordcreate');
    let loginemail = document.querySelector('.emaillogin');
    let loginpassword = document.querySelector('.passwordlogin');
    let email;
    let password;
    let type = document.querySelector('.type');
    let name = document.querySelector('.name');
    let straat = document.querySelector('.straat');
    let huisnummer = document.querySelector('.huisnummer');
    let postcode = document.querySelector('.postcode');
    let stad = document.querySelector('.stad');
    let telefoon = document.querySelector('.telephone');
    let who;
    let lat;
    let long;
    createbutton.addEventListener('click', function (e) {
        e.preventDefault();
        email = createemail.value;
        password = createpassword.value;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            localStorage.setItem("useremail", email);
            if (document.querySelector('.straat').value) {
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
                        firebase.database().ref('users').push({
                            username: name.value,
                            email: email,
                            type: type.value,
                            straat: straat.value,
                            huisnummer: huisnummer.value,
                            postcode: postcode.value,
                            stad: stad.value,
                            lat: lat,
                            long: long,
                            tel: telefoon.value
                        });
                    })

            } else {
                firebase.database().ref('users').push({
                    username: name.value,
                    email: email,
                    type: type.value,
                    tel: telefoon.value
                });

            }
            window.location.href = "/#"
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

        });

    })
    loginbutton.addEventListener('click', function (e) {
        e.preventDefault();
        email = loginemail.value;
        password = loginpassword.value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            localStorage.setItem("useremail", email);
            window.location.href = '/#';
        }).catch(function (error) {
            document.querySelector('.foutje').style.display = "block";
            var errorCode = error.code;
            var errorMessage = error.message;

        });
    })
    console.log('jow')

    setInterval(function () {
        if (document.querySelector('.type')) {
            who = document.querySelector('.type').value
            if (who == "student") {
                document.getElementById('onlystudent').style.display = 'block';
            } else if (who == "kotbaas") {
                document.getElementById('onlystudent').style.display = 'none';
            }
        }
    }, 500);
    document.querySelector('.question').addEventListener('click', function (e) {
        document.querySelector('.loginform').style.display = "none";
        document.querySelector('.create').style.display = "none";
        document.querySelector('.forgotpassword').style.display = "block";
        document.querySelector('.forgotpass').addEventListener('click', function (e) {
            e.preventDefault();
            let emailaddressforgot = document.querySelector('.forgotpassmail').value
            firebase.auth().sendPasswordResetEmail(emailaddressforgot).then(function () {
                location.reload();
            }).catch(function (error) {
                console.log('error')
            });
        })
    })
};

/*

*/
