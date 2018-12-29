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
    let receiverkey = localStorage.getItem('receiver')
    let senderkey = localStorage.getItem('sender')
    let username = localStorage.getItem('username')

    document.querySelector('.submitform').addEventListener('click', function (e) {
        e.preventDefault();
        firebase.database().ref('messages').push({
            sender: senderkey,
            sendername: username,
            receiver: receiverkey,
            message: document.querySelector('.message').value
        })
        window.location.href = "/#/chat";
    })
};
