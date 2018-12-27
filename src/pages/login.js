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
    let adress = document.querySelector('.adress')
    let who; 
    createbutton.addEventListener('click', function (e) {
        e.preventDefault();
        email = createemail.value;
        password = createpassword.value;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            localStorage.setItem("useremail", email);
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

        });
        firebase.database().ref('users').push({
            username: name.value,
            email: email,
            type: type.value,
            adress: adress.value
        });
        window.location.href = '/#';
    })
    loginbutton.addEventListener('click', function (e) {
        e.preventDefault();
        email = loginemail.value;
        password = loginpassword.value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            localStorage.setItem("useremail", email);
            window.location.href = '/#';
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

        });
    })
    console.log('jow')
    
    setInterval(function () {
        who = document.querySelector('.type').value
        if( who == "student"){
            document.getElementById('onlystudent').style.display = 'block';
        }else if(who == "kotbaas"){
            document.getElementById('onlystudent').style.display = 'none';
        }
    }, 500);
};

/*

*/
