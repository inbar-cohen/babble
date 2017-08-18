var main = require('./main.js');

function addMessage(message) {
    // Code here
    message.id = main.id;
    main.msgs.push(message);
    return main.id++;
}
function getMessages(counter) {
    var ret = [];
    for (var i = 0; i < main.msgs.length; i++) {
        ret.push(main.msgs[i]);
    }
    return (ret.slice(counter));
}
function deleteMessage(id) {
    // Code here
    for (var i = 0; i < main.msgs.length; i++) {
        if (main.msgs[i].id == id) {
            main.msgs.splice(i, 1);
            return JSON.stringify(true);
        }
    }
    return JSON.stringify(false);
}

module.exports = { addMessage, getMessages, deleteMessage };