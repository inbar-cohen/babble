'use strict';

localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: '', email: '' } }));
var ret;

window.Babble = {
    counter: 0,
    register: function register(userInfo) {
        console.log("register register register register register register register " + localStorage.getItem('babble'));
        //  var exist = false;

        console.log("register-Babble: " + JSON.stringify(Babble));
        localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: userInfo.name, email: userInfo.email } }));
        console.log("AFTER AFTER AFTER AFTER AFTER  " + localStorage.getItem('babble'));


        if (typeof (Storage) !== "undefined") {
            request({
                method: 'POST',
                action: 'http://localhost:9000/log/',// + document.getElementById('input').value,//+ "userName=" + Babble[betterIndexOf(Babble)].userName + "&email=" + Babble[betterIndexOf(Babble)].email + "&msg=" + document.getElementById('input').value + "&time=" + new Date(),
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    status: "login"
                }
                //serialize(form)
            }).then(function (result) {
                // console.log(result);
            });
        } else {
            // Sorry! No Web Storage support..
            console.log("error");
        }
        //console.log("AFTER AFTER AFTER AFTER AFTER  " + JSON.stringify(localStorage.getItem('babble')));

        //  }
    },
    getMessages: function getMessages(counter, callback) {
        //setTimeout(callback(counter), 100);
        // callback(counter);
        // console.log("YOYOYOYOYOY");
        if (typeof callback !== "function") {
            console.log("NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION ");
            poll(counter);
        }
        else {
            callback(poll(counter));
        }
    },
    postMessage: function postMessage(message, callback) {
        console.log("HOHHOHOHOHOOHOHOHOHHOHOHOHOHOHOOHHO");
        if (typeof callback !== "function") {
            // console.log("NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION ");
            postMsg(message);
        }
        else {
            //console.log("2222222NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION NOT FUNCTION ");
            var t = JSON.parse(postMsg(message));
            console.log(t);
            callback({ id: String(t.id) });
            //            callback(postMsg(message));
            // postMsg(message).then(callback());
        }
    },
    getStats: function getStats(callback) {
        //setTimeout(callback(), 100);
        if (typeof callback !== "function") {
            userPoll();
        }
        else {
            var t = userPoll();
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 + " + t);
            callback(JSON.parse(t));
            //callback(JSON.parse(userPoll()));
        }
    },
    deleteMessage: function deleteMessage(id, callback) {
        if (typeof callback !== "function") {
            dlt(id);
        }
        else {
            // var t = dlt();
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 + " + t);
            callback(dlt(id));
            //callback(JSON.parse(userPoll()));
        }
    },
};
function dlt(id) {
    var request = new XMLHttpRequest();
    var response;
    request.open("DELETE", 'http://localhost:9000' + '/messages/' + id, false);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            console.log("request.status " + request.status);
            //   response = (request.response === "true") ? true : false;// JSON.parse(request.responseText);
            response = JSON.parse(request.responseText);
            console.log(response);
        }
    }

    request.onerror = function () {
        // There was a connection error of some sort
    };
    //console.log("(props.data = " + JSON.stringify(props.data));
    request.send();
    //console.log("VALUE = " + value);
    return response;
    //}
};


// function dlt(id) {
//     var request = new XMLHttpRequest();
//     var response;
//     request.open("DELETE", 'http://localhost:9000' + '/messages/:' + id, false);

//     request.onload = function () {
//         if (request.status >= 200 && request.status < 400) {
//             // Success!
//             console.log("request.status " + request.status);
//             response = (request.response === "true") ? true : false;// JSON.parse(request.responseText);
//             console.log(response);
//         }
//     }

//     request.onerror = function () {
//         // There was a connection error of some sort
//     };
//     //console.log("(props.data = " + JSON.stringify(props.data));
//     request.send();
//     //console.log("VALUE = " + value);
//     return response;
//     //}
// };




// // // // // function dlt(id) {
// // // // //     var res;
// // // // //     console.log('http://localhost:9000' + '/messages/:' + parseInt(id));
// // // // //     request({
// // // // //         method: 'DELETE',
// // // // //         action: 'http://localhost:9000' + '/messages/:' + id,
// // // // //         data: {}
// // // // //     }).then(function (result) {
// // // // //         res = JSON.parse(result);
// // // // //     });
// // // // //     return res;
// // // // // }

// function userPoll() {
//     var ret = {};
//     request({
//         method: 'GET',
//         action: 'http://localhost:9000' + '/stats',
//         requestBody: {}
//         //serialize(form)
//     }).then(function (result) {
//         console.log("STATS RESULT");
//         console.log(result);
//         ret = { users: result.count, messages: result.count2 };
//         document.getElementById('userCount').textContent = result.count;
//         document.getElementById('msgCount').textContent = result.count2;

//     });
//     return ret;
// }

//setTimeout(Babble.getMessages(0), 100);

// function postMsg(message) {
//     console.log("postMsgpostMsgpostMsgpostMsgpostMsgpostMsgpostMsgpostMsgpostMsgpostMsg");
//     var request = new XMLHttpRequest();
//     var response;
//     // request.open('GET', 'http://localhost:9000' + '/poll/' + counter, true);
//     request.open("POST", "http://localhost:9000/messages", false);

//     request.onload = function () {
//         if (request.status >= 200 && request.status < 400) {
//             // Success!
//             console.log("request.status " + request.status);
//             response = JSON.parse(request.responseText);
//             console.log(response);
//         }
//     }

//     request.onerror = function () {
//         // There was a connection error of some sort
//     };
//     //console.log("(props.data = " + JSON.stringify(props.data));
//     request.send(JSON.stringify({
//         name: message.name,
//         email: message.email,
//         message: message.message,
//         timestamp: message.timestamp
//     }));
//     //console.log("VALUE = " + value);
//     return JSON.stringify(response);
//     //}
// };


// function postMsg(message) {
//     var ret = {};
//     request({
//         method: 'POST',
//         action: 'http://localhost:9000/messages',
//         // data: "name=" + Babble[Babble.indexOf(usr)].name + "&email=" + Babble[Babble.indexOf(usr)].email + "&msg=" + Babble[Babble.indexOf(usr)].currentMessage + "&time=" + new Date()
//         requestBody: {
//             name: message.name,
//             email: message.email,
//             message: message.message,
//             timestamp: message.timestamp
//         }
//         //serialize(form)
//     }).then(function (result) {
//         console.log(result);
//         ret = result;
//     });
//     return JSON.stringify(ret);
// }


// function postMsg(message) {
//     var request = new XMLHttpRequest();
//     var response;
//     request.open('POST', 'http://localhost:9000/messages' , false);
//     var response;
//     request.onload = function () {
//         if (request.status >= 200 && request.status < 400) {
//             response = JSON.parse(request.responseText);
//         } else {
//             // We reached our target server, but it returned an error
//             console.log("connection error");
//         }
//     }

//     request.onerror = function () {
//         // There was a connection error of some sort
//     };
//     request.send(JSON.stringify(message));
//     console.log("ressssss = " + JSON.stringify(response));
//     return JSON.stringify(response);
//     //}
// };

// function postMsg(message) {
//     var request = new XMLHttpRequest();
//     var response;
//     request.open('POST', 'http://localhost:9000/messages', false);
//     var response;
//     request.onload = function () {
//         if (request.status >= 200 && request.status < 400) {
//             response = JSON.parse(request.responseText);
//         } else {
//             // We reached our target server, but it returned an error
//             console.log("connection error");
//         }
//     };;

//     request.onerror = function () {
//         // There was a connection error of some sort
//     };
//     request.send(JSON.stringify(message));
//     console.log("ressssss = " + JSON.stringify(response));
//     return JSON.stringify(response);
//     //}
// };


function postMsg(message) {
    var req1 = new XMLHttpRequest();
    var res1;
    req1.open('POST', 'http://localhost:9000/messages', false);
    req1.onload = function () {
        if (req1.status >= 200 && req1.status < 400) {
            res1 = JSON.parse(req1.responseText);
        } else {
            // We reached our target server, but it returned an error
            console.log("connection error");
        }
    }

    req1.onerror = function () {
        // There was a connection error of some sort
    };
    req1.send(JSON.stringify(message));
    //    request.send(JSON.stringify(message));
    console.log("ressssss = " + JSON.stringify(res1));
    return JSON.stringify(res1);
    //}
};

function poll() {
    // console.log("POL POL POL POL POL");
    var ret = [];
    request({
        method: 'GET',
        action: 'http://localhost:9000' + '/messages?counter=' + Babble.counter,
        data: {}
        //serialize(form)
    }).then(function (result) {
        console.log("SOMETHING");
        //console.log(result);
        if (result.append === undefined) {
            ret = result;
        }
        else {
            ret = result.append;

            for (var i = 0; i < result.append.length; i++) {
                //   console.log("sfsfs " + result.append[0].message.email);
                createMessage(result.append[i].message.name, result.append[i].message.email, result.append[i].message.lastMsg, result.append[i].message.time, true);
            }
            Babble.counter = result.count;
        }


        // console.log("STATUS " + result.status);
    });
    return ret;
}

// function poll(counter) {
//     // console.log("POL POL POL POL POL");
//     var ret = [];
//     request({
//         method: 'GET',
//         action: 'http://localhost:9000' + '/messages?counter=' + counter,
//         requestBody: {}
//         //serialize(form)
//     }).then(function (result) {
//         console.log("SOMETHING");
//         //    console.log(result);
//         ret = result;
//         //for(.....)
//         counter = result.count;
//     });
//     return ret;
// }


// function poll(counter) {
//     console.log("poll poll poll poll poll poll poll poll poll poll poll poll poll poll poll poll  poll");
//     //if (userIndex != undefined) {
//     //if (!(Babble[userIndex].name == null || Babble[userIndex].email === null || Babble[userIndex].currentMessage === null || Babble[userIndex].time === null)) {
//     //  var data = "name=" + encodeURIComponent(Babble[userIndex].name) + "&email=" + encodeURIComponent(Babble[userIndex].email) + "&currentMessage=" + encodeURIComponent(Babble[userIndex].currentMessage) + "&time=" + encodeURIComponent(Babble[userIndex].time);
//     //   var data = "example=one";
//     //  console.log("data before sending = " + data);

//     var request = new XMLHttpRequest();
//     var response;
//     var value = [];
//     // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     // request.open('GET', 'http://localhost:9000' + '/poll/' + counter, true);
//     request.open('GET', 'http://localhost:9000' + '/messages?counter=' + counter, true);

//     request.onload = function () {
//         if (request.status >= 200 && request.status < 400) {
//             // Success!
//             console.log("request.status " + request.status);

//             response = JSON.parse(request.responseText);
//             console.log("response.status = " + response.status);
//             counter = response.count;
//             console.log("@@@@@@@@@@@@@@@@@@counter client " + counter);
//             // var elem = document.getElementById('input');
//             // elem.textContent = elem.textContent + response.append;
//             //   console.log( arr =" + response.arr" + " arr[0]= " + response.arr[0]);
//             //console.log("response.count = " + response.count);
//             //    for (var index = 0; index < response.count; index++) 

//             value = response.append;

//             if (counter > 0) {
//                 if (response.status == "poll") {
//                     //value = value;
//                     for (i in value) {
//                         console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ " + JSON.stringify(value[i]));
//                         var check = false;
//                         if (value[i].message.name === Babble.userInfo.name && value[i].message.email === Babble.userInfo.email) {
//                             check = true;
//                         }
//                         createMessage(value[i].message.name, value[i].message.email, value[i].message.lastMsg, value[i].message.time, check);
//                     }
//                 }
//                 else {
//                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111  HANDLING MESSAGE " + response.status + " " + JSON.stringify(value));
//                     // for (var i = 0; i < response.count; i++) {
//                     var check = false;
//                     if (value.name === Babble.userInfo.name && value.email === Babble.userInfo.email) {
//                         check = true;
//                     }
//                     console.log(value.name + " " + value.email + " " + value.msg + " " + value.time + '\n');
//                     createMessage(value.name, value.email, value.lastMsg, value.time);
//                     //  }
//                 }
//                 poll(counter);
//             } else {
//                 // We reached our target server, but it returned an error
//                 console.log("counter is ZERO");
//             }
//         }
//     }

//     request.onerror = function () {
//         // There was a connection error of some sort
//     };
//     request.send();

//     return value;
//     //}
// };

function createMessage(name, email, msg, time, isUser) {
    //printData(data);

    console.log("in my function()" + email);
    var img = document.createElement("IMG");
    console.log(name + " " + email);
    if (name === '') {
        console.log("Anonymous Anonymous Anonymous Anonymous Anonymous Anonymous Anonymous ");
        img.setAttribute("src", "../images/anonymous.png");
    }
    else {
        console.log("http://www.gravatar.com/avatar/" + email);
        img.setAttribute("src", "http://www.gravatar.com/avatar/" + email);

    }
    var att = document.createAttribute("class");       // Create a "class" attribute
    att.value = "avatar";
    img.setAttributeNode(att);
    document.getElementById("myList").appendChild(img);

    var li = document.createElement("LI");

    var cite = document.createElement("CITE");
    var t = document.createTextNode(name);
    cite.appendChild(t);
    li.appendChild(cite);
    if (isUser) {
        var y = document.createElement("BUTTON");
        var attribute = document.createAttribute("class");       // Create a "class" attribute
        attribute.value = "deleteIcon";                           // Set the value of the class attribute
        y.setAttributeNode(attribute);
        y.onclick = deleteMessage;
        li.appendChild(y);
    }

    var z = document.createElement("TIME");
    var time = new Date(Date.parse(time));// new Date(time);
    var datetime = time.getDate() + "/"
        + (time.getMonth() + 1) + "/"
        + time.getFullYear() + " @ "
        + time.getHours() + ":"
        + time.getMinutes() + ":"
        + time.getSeconds();

    z.setAttribute("datetime", datetime);
    var t2;
    if (time.getMinutes() < 10) {
        t2 = document.createTextNode(time.getHours() + ":0" + time.getMinutes());
    }
    else {
        t2 = document.createTextNode(time.getHours() + ":" + time.getMinutes());
    }
    z.appendChild(t2);
    li.appendChild(z);


    var para = document.createElement("p");
    var node = document.createTextNode(msg);
    para.appendChild(node);
    li.appendChild(para);

    document.getElementById("myList").appendChild(li);

    clearContents(document.getElementById("input"));

    var objContainer = document.getElementById("myList");
    objContainer.scrollTop = objContainer.scrollHeight;
}

function request(props) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        //  console.log("props.action = " + props.action);
        if (props.method === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.onload = function () {
            if (xhr.status === 200 && xhr.responseText !== "") {
                console.log(JSON.parse(xhr.responseText));
                resolve(JSON.parse(xhr.responseText));
            }
        }
        xhr.open(props.method, props.action);
        xhr.timeout = 600;
        xhr.send(JSON.stringify(props.data));

        // xhr.send();
    });
}



// function request(props) {
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         //  console.log("props.action = " + props.action);

//         xhr.timeout = 600;
//         if (props.method === 'post') {
//             console.log("POLL REQUEST");
//             xhr.setRequestHeader('Content-Type', 'application/json');
//         }
//         xhr.onload = function () {
//             if (xhr.status === 200) {
//                 console.log(JSON.parse(xhr.responseText));
//                 resolve(JSON.parse(xhr.responseText));
//             }
//         };
//         xhr.open(props.method, props.action);

//         xhr.send(JSON.stringify(props.requestBody));

//         // xhr.send();
//     });
// }


// function request(props) {
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         var response;
//         console.log("props.action = " + props.action);
//         xhr.timeout = 600;
//         xhr.open(props.method, props.action);
//         if (props.method === 'post') {
//             xhr.setRequestHeader('Content-Type', 'application/json');
//         }
//         xhr.send(JSON.stringify(props.data));
//         console.log("SENT SENT SENT SENT SENT");
//         // xhr.send();
//     });
// }

function userPoll() {
    var request = new XMLHttpRequest();
    var response;
    var val = { users: 0, messages: 0 };
    // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.open('GET', 'http://localhost:9000' + '/stats' /*+ count*/, false);
    var response;
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            //  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!request.status " + request.status);

            //   response = request.responseText;
            if (request.responseText !== "") {
                response = JSON.parse(request.responseText);
                // val = { users: response.count, messages: response.count2 };
                console.log("??????????????????????????????? + " + JSON.stringify(response));

                // document.getElementById('userCount').textContent = response.count;
                // document.getElementById('msgCount').textContent = response.count2;

            }

            //userPoll();
        } else {
            // We reached our target server, but it returned an error
            console.log("connection error");
        }
    }

    request.onerror = function () {
        // There was a connection error of some sort
    };
    request.send();
    console.log("ressssss = " + JSON.stringify(response));
    return JSON.stringify(response);
    //}
};


// function userPoll() {
//     var ret = {};
//     request({
//         method: 'GET',
//         action: 'http://localhost:9000' + '/stats',
//         data: {}
//         //serialize(form)
//     }).then(function (result) {
//         console.log("STATS RESULT");
//         console.log(result);
//         ret = { users: result.count, messages: result.count2 };
//         document.getElementById('userCount').textContent = result.count;
//         document.getElementById('msgCount').textContent = result.count2;

//     });
//     return ret;
// }
