// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const verwijderenTemplate = require('../templates/verwijderen.handlebars');
const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
export default () => {
  // Data to be passed to the template
  const name = 'Test inc.';
  // Return the compiled template to the router
  update(compile(verwijderenTemplate)({ 
  
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
    let username;
    let useremail = localStorage.getItem("useremail");

    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            document.getElementById('username').innerHTML = username;
            console.log(username)
            if (data.type === "student") {

                document.querySelector('.navigationstudent').style.display = "block";

            } else {
                document.querySelector('.visibleKotbaas').style.display = "block";
                document.querySelector('.navigationkotbaas').style.display = "block";
                firebase.database().ref("/koten").orderByChild('huurbaas').equalTo(username).on("value", function (snaps){
                     document.querySelector('.yourkoten').innerHTML = "";
                    snaps.forEach(function (childSnapshots){
                        let datas = childSnapshots.val();
                        if(datas.foto){
                        document.querySelector('.yourkoten').innerHTML += "<div class='contentkot' id='"+childSnapshots.key+"'><div class='addreskot'><span>"+ datas.straat+" "+datas.huisnummer+", </span><span>"+datas.postcode+ " " + datas.stad+ "</span></div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F"+datas.foto+"?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'><div><p id='"+childSnapshots.key+"' class='remove'>verwijderen</p></div></div>";
                            
                        }else{
                             document.querySelector('.yourkoten').innerHTML += "<div class='contentkot'><p>"+ datas.straat+" "+datas.huisnummer+"</p><p>"+datas.postcode+ " " + datas.stad+ "</p></div>";
                        }
                    })
                    let removebuttons = document.querySelectorAll('.remove')
                
                for(let i=0; i<removebuttons.length; i++){
                    removebuttons[i].addEventListener('click', function(){
                        let getkey = removebuttons[i].id;
                        firebase.database().ref('koten/'+getkey).remove();
                    })
                }
                    
                })
                
            }
        });

    })
};
