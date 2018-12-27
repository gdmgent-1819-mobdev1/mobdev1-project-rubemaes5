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
    let username;
    let useremail = localStorage.getItem("useremail");

    firebase.database().ref("/users").orderByChild('email').equalTo(useremail).on("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            username = data.username;
            console.log(username)
            document.getElementById('username').innerHTML = username;
            if (data.type === "student") {
                document.querySelector('.visibleStudent').style.display = "block";
                document.querySelector('.navigationstudent').style.display = "block";

            } else {
                document.querySelector('.visibleKotbaas').style.display = "block";
                document.querySelector('.navigationkotbaas').style.display = "block";
                firebase.database().ref("/koten").orderByChild('huurbaas').equalTo(username).on("value", function (snaps){
                     document.querySelector('.yourkoten').innerHTML = "";
                    snaps.forEach(function (childSnapshots){
                        let datas = childSnapshots.val();
                        if(datas.foto){
                        document.querySelector('.yourkoten').innerHTML += "<div class='contentkot' id='"+childSnapshots.key+"'><div class='addreskot'><span>"+ datas.straat+" "+datas.huisnummer+", </span><span>"+datas.postcode+ " " + datas.stad+ "</span></div><img src='https://firebasestorage.googleapis.com/v0/b/kottet-36e19.appspot.com/o/images%2F"+datas.foto+"?alt=media&token=ad63c346-c172-42f5-afc0-5d65f6baf0d0' class='kotimage'></div>";
                        }else{
                             document.querySelector('.yourkoten').innerHTML += "<div class='contentkot'><p>"+ datas.straat+" "+datas.huisnummer+"</p><p>"+datas.postcode+ " " + datas.stad+ "</p></div>";
                        }
                    })
                })
            }
        });

    })
    


}
