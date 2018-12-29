// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
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
  update(compile(kotdetailTemplate)({  }));
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
            }else{
                document.querySelector('.navigationkotbaas').style.display ="block"
            }
            firebase.database().ref('koten/'+currentKot).on('value', function (snaps) {
                let datas = snaps.val();
                let kotdetail = document.querySelector('.kotdetail');
                let content = "<img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F" + datas.foto + "?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0'><div class='info'><h1>"+datas.soort+" - €"+datas.prijs+"</h1><h2>"+datas.straat+" "+datas.huisnummer+", "+datas.postcode+" "+datas.stad+"</h2><table><tr><td>bad</td><td>"+datas.bad+"</td></tr><tr><td>douche</td><td>"+datas.douche+"</td></tr><tr><td>toilet</td><td>"+datas.toilet+"</td></tr><tr><td>keuken</td><td>"+datas.keuken+"</td></tr><tr><td>meubels</td><td>"+datas.meubels+"</td></tr><tr><td>waarborg</td><td>€"+datas.borg+"</td></tr><tr><td>verdieping</td><td>"+datas.verdieping+"</td></tr><tr><td>aantal koten</td><td>"+datas.aantalkoten+"</td></tr><tr><td>aantal personen per kot</td><td>"+datas.aantalpersonen+"</td></tr><tr><td>oppervlakte</td><td>"+datas.oppervlakte+"m&sup2;</td></tr></table></div>";
                kotdetail.innerHTML = content;
                kotbaaskey = datas.huurbaaskey;
                document.querySelector('.messagebutton').addEventListener('click', function(){
                    document.querySelector('.messageform').style.display = "block";
                })
                document.querySelector('.submitbutton').addEventListener('click', function(e){
                    e.preventDefault();
                    firebase.database().ref('messages/').push({
                    sender: userkey,
                    sendername: username,
                    receiver: kotbaaskey,
                    message: document.querySelector('.message').value
                })
                })
                
                
            })
        })
    })
    var fbButton = document.getElementById('fb-share-button');
    var url = "http://www.codeddesign.be";

    fbButton.addEventListener('click', function() {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
            'facebook-share-dialog',
            'width=800,height=600'
        );
        return false;
});
};
