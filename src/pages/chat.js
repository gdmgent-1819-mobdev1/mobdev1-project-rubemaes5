import {
    compile
} from 'handlebars';
import update from '../helpers/update';
const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const chatTemplate = require('../templates/chat.handlebars');

export default () => {
    // Data to be passed to the template
    const name = 'Test inc.';
    // Return the compiled template to the router
    update(compile(chatTemplate)({
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
    let replyId;
    let username;
    let userkey;
    let useremail = localStorage.getItem("useremail");
    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            localStorage.setItem('username', username)
            userkey = childSnapshot.key;
            localStorage.setItem('userkey', userkey);
            document.getElementById('username').innerHTML = username;
            if (data.type === "student") {
                document.querySelector('.navigationstudent').style.display = "block";
            } else {
                document.querySelector('.navigationkotbaas').style.display = "block";
            }
            document.querySelector('.inbox').addEventListener('click', function () {
                document.querySelector('.inboxmessages').style.display = "block";
                document.querySelector('.sentmessages').style.display = "none";
            })
            document.querySelector('.sent').addEventListener('click', function () {
                document.querySelector('.sentmessages').style.display = "block";
                document.querySelector('.inboxmessages').style.display = "none";
            })

            firebase.database().ref("/messages").orderByChild('receiver').equalTo(userkey).on("value", function (snaps) {
                document.querySelector('.inboxmessages').innerHTML = "";
                snaps.forEach(function (childSnapshots) {
                    if (!("Notification" in window)) {
                        alert("This browser does not support system notifications");
                    }

                    // Let's check whether notification permissions have already been granted
                    else if (Notification.permission === "granted") {
                        // If it's okay let's create a notification
                        var notification = new Notification("Message received");
                    }

                    // Otherwise, we need to ask the user for permission
                    else if (Notification.permission !== 'denied') {
                        Notification.requestPermission(function (permission) {
                            // If the user accepts, let's create a notification
                            if (permission === "granted") {
                                var notification = new Notification("Message received");
                            }
                        });
                    }
                    let datas = childSnapshots.val();
                    console.log('hallo')
                    document.querySelector('.inboxmessages').innerHTML += "<div class='message'><p>" + datas.sendername + "</p><p class='contentmessage'>" + datas.message + "</p><p class='reply' id='" + datas.sender + "'>beantwoord</p></div>";


                    let replybutton = document.querySelectorAll('.reply');

                    for (let i = 0; i < replybutton.length; i++) {
                        replybutton[i].addEventListener('click', function () {
                            replyId = replybutton[i].id;
                            console.log(replyId);
                            localStorage.setItem('receiver', replyId);
                            localStorage.setItem('sender', userkey)
                            window.location.href = '/#/chatsend'
                        })
                    }


                })
            })
            firebase.database().ref("/messages").orderByChild('sender').equalTo(userkey).on("value", function (snaps) {
                document.querySelector('.sentmessages').innerHTML = "";
                snaps.forEach(function (childSnapshots) {
                    let datas = childSnapshots.val();
                    console.log('hallo')
                    document.querySelector('.sentmessages').innerHTML += "<div class='message'><p>" + datas.sendername + "</p><p class='contentmessage'>" + datas.message + "</p></div>";


                    let replybutton = document.querySelectorAll('.reply');

                    for (let i = 0; i < replybutton.length; i++) {
                        replybutton[i].addEventListener('click', function () {
                            replyId = replybutton[i].id;
                            console.log(replyId);
                            localStorage.setItem('receiver', replyId);
                            localStorage.setItem('sender', userkey)
                            window.location.href = '/#/chatsend'
                        })
                    }


                })
            })
        })
    })
}
