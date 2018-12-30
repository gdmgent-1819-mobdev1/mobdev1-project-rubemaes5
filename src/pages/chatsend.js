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
const chatsendTemplate = require('../templates/chatsend.handlebars');

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(chatsendTemplate)({
        name
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
    let receiverkey = localStorage.getItem('receiver')
    let senderkey = localStorage.getItem('sender')
    let username = localStorage.getItem('username')
    let receivername = localStorage.getItem('receivername')

    document.querySelector('.submitform').addEventListener('click', function (e) {
        e.preventDefault();
        firebase.database().ref('messages').push({
            sender: senderkey,
            sendername: username,
            receiver: receiverkey,
            receivername: receivername,
            message: document.querySelector('.message').value
        })
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification("Message Sent");
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification("Message Sent");
                }
            });
        }
        window.location.href = "/#/chat";
    })
};
