window.Babble = {
    counter: 0,
    register: function register(userInfo) {
        localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: userInfo.name, email: userInfo.email } }));
        if (typeof (Storage) !== "undefined") {
            request({
                method: 'POST',
                action: 'http://localhost:9000/log/',
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    status: "login"
                }
            }).then(function (result) { });
        } else { }
    },
    getMessages: function getMessages(counter, callback) {
        var type = typeof callback;
        var func = "function";
        if (type === func) {
            var result = poll(counter);
            callback(result);
        }
        else {
            poll(counter);
        }
    },
    postMessage: function postMessage(message, callback) {
        var und = "undefined";
        var type = typeof callback;
        if (type !== und) {
            var t = JSON.parse(postMsg(message));
            t = { id: String(t.id) };
            callback(t);
        }
        else {
            postMsg(message);
        }
    },
    deleteMessage: function deleteMessage(id, callback) {
        if (typeof callback !== "function") {
            dlt(id);
        }
        else {
            callback(dlt(id));
        }
    },
    getStats: function getStats(callback) {
        if (typeof callback !== "function") {
            userPoll();
        }
        else {
            var t = userPoll();
            callback(JSON.parse(t));
        }
    }
};

function dlt(id) {
    var response;
    try {
        var request = new XMLHttpRequest();
        request.open("DELETE", 'http://localhost:9000' + '/messages/' + id, false);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                response = JSON.parse(request.responseText);
            }
        }
        request.send();
    } catch (e) { }
    return response;
};

function poll() {
    var ret = [];
    request({
        method: 'GET',
        action: 'http://localhost:9000' + '/messages?counter=' + Babble.counter,
        data: {}
    }).then(function (result) {
        ret = result.append;
        if (ret !== undefined) {
            for (var i = 0; i < result.append.length; i++) {
                createMessage(result.append[i].name, result.append[i].email, result.append[i].message, result.append[i].timestamp, true, result.append[i].id);
            }
            Babble.counter = result.count;
        }
    });
    return ret;
}


function userPoll() {
    var response;
    var request = new XMLHttpRequest();
    try {
        var val = { users: 0, messages: 0 };
        request.open('GET', 'http://localhost:9000' + '/stats', false);
        var response;
        request.onload = function () {

            if (request.status >= 200 && request.status < 400 && request.status != 204) {
                if (request.responseText !== "") {
                    response = JSON.parse(request.responseText);
                    document.getElementById('userCount').textContent = response.count;
                    document.getElementById('msgCount').textContent = response.count2;
                }
            } else { }
        }
        request.send();
    } catch (e) { }
    return JSON.stringify(response);
};

window.addEventListener('load', function () {
    if (localStorage.getItem('babble') == null) {
        var Babble = {
            currentMessage: "",
            userInfo: {
                name: "",
                email: ""
            }
        };
        localStorage.setItem('babble', JSON.stringify(Babble));
    }
    var data = JSON.parse(localStorage.getItem('babble'));
    if ((typeof (Storage) == "undefined") || (data.currentMessage === "" && data.userInfo.name === "" && data.userInfo.email === "")) {
        document.getElementById('myModal').style.display = "block";
    }
    else {
        var usr = JSON.parse(localStorage.getItem('babble'));
        localStorage.setItem('babble', JSON.stringify({ currentMessage: '', userInfo: { name: usr.userInfo.name, email: usr.userInfo.email } }));
        document.getElementById('input').value = usr.currentMessage;
        request({
            method: 'POST',
            action: 'http://localhost:9000/log/',
            data: {
                name: usr.userInfo.name,
                email: usr.userInfo.email,
                status: "login"
            }
        }).then(function (result) { });
    }
});

document.getElementById('btnAnonymous').addEventListener('click', function () {
    var name = '';
    var email = '';
    Babble.register({ name, email });
    document.getElementById('myModal').style.display = "none";
});

document.getElementById('btnlogin').addEventListener('click', function () {
    var name = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    Babble.register({ name, email });
    document.getElementById('myModal').style.display = "none";
});

function request(props) {
    return new Promise(function (resolve, reject) {
        var response = "";
        try {
            var request = new XMLHttpRequest();
            if (props.method === 'post') {
                request.setRequestHeader('Content-Type', 'application/json');
            }
            request.onload = function () {
                if (request.status === 200 && request.responseText !== "") {
                    response = request.responseText
                    response = JSON.parse(response);
                }
                if (response !== "") {
                    resolve(response);
                }
            }
            var met = props.method;
            var act = props.action;
            request.open(met, act);
            request.timeout = 600;
            request.send(JSON.stringify(props.data));
            setTimeout(function () {
                Babble.getMessages(Babble.counter);
                Babble.getStats();
            }, 10);
        } catch (e) { }
    });
}

window.addEventListener('beforeunload', function () {
    if (typeof (Storage) !== "undefined" && JSON.parse(localStorage.getItem('babble')) != null) {
        var ls = JSON.parse(localStorage.getItem('babble'));
        request({
            method: 'POST',
            action: 'http://localhost:9000/log/',
            data: {
                name: ls.userInfo.name,
                email: ls.userInfo.email,
                status: "out"
            }
        }).then(function (result) { });
        ls.currentMessage = document.getElementById('input').value;
        localStorage.setItem('babble', JSON.stringify(ls));
    }
});

function postMsg(message) {
    try {
        var req1 = new XMLHttpRequest();
        var res1;
        req1.open('POST', 'http://localhost:9000/messages', false);
        req1.onload = function () {
            if (req1.status >= 200 && req1.status < 400) {
                res1 = JSON.parse(req1.responseText);
            }
        }
        req1.send(JSON.stringify(message));
    } catch (e) { }
    return JSON.stringify(res1);
};

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (typeof (Storage) !== "undefined" && JSON.parse(localStorage.getItem('babble')) != null) {
        var ls = JSON.parse(localStorage.getItem('babble'));
        Babble.postMessage({
            name: ls.userInfo.name,
            email: ls.userInfo.email,
            message: document.getElementById('input').value,
            timestamp: unix()
        });
    }
});

function unix() {
    var date = new Date();
    var dateTime = date.getTime();
    var dateTime2 = 1000;
    var dateTime3 = dateTime / dateTime2;
    var DateTime4 = Math.round(dateTime3);
    return DateTime4;
}

document.querySelector('form').addEventListener('keypress', function (e) {
    if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        if (typeof (Storage) !== "undefined" && JSON.parse(localStorage.getItem('babble')) != null) {
            var ls = JSON.parse(localStorage.getItem('babble'));
            Babble.postMessage({
                name: ls.userInfo.name,
                email: ls.userInfo.email,
                message: document.getElementById('input').value,
                timestamp: unix()
            });
        }
    }
});

function createMessage(name, email, msg, myTime, isUser, id) {
    var img = document.createElement("IMG");
    img.setAttribute('alt', "");
    
    if (name === '') {
        img.setAttribute("src", "../images/anonymous.png");
    }
    else {
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
        y.setAttribute('aria-label', "delete message");
        y.onclick = function () { deleteMess(id) };
        li.appendChild(y);
    }
    var z = document.createElement("TIME");
    var time = getTime(myTime);
    z.setAttribute("datetime", myTime);
    var t2, m, h;
    if (time.getMinutes() < 10) {
        m = "0" + time.getMinutes();
    }
    else {
        m = time.getMinutes();
    }
    if (time.getHours() < 10) {
        h = "0" + time.getHours();
    }
    else {
        h = time.getHours();
    }
    t2 = document.createTextNode(h + ":" + m);
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

function deleteMess(id) {
    Babble.deleteMessage(id);
}

function clearContents(element) {
    element.value = '';
}

function getTime(myTime) {
    return new Date(myTime * 1000)
}

makeGrowable(document.querySelector('.js-growable'));
function makeGrowable(container) {
    var area = document.querySelector('textarea');
    var clone = container.querySelector('span');
    var initialCont = parseInt(document.querySelector('.js-growable').clientHeight);
    var initialLi = parseInt(document.getElementById('myList').clientHeight);
    var containerHeight = document.querySelector('.js-growable').clientHeight;
    area.addEventListener('input', function (e) {
        clone.textContent = area.value;
        var diff = parseInt(document.querySelector('.js-growable').clientHeight) - parseInt(containerHeight);
        document.getElementById('myList').style.height = (parseInt(document.getElementById('myList').clientHeight) - diff).toString() + "px";
        containerHeight = document.querySelector('.js-growable').clientHeight;
    });
    document.getElementById("submitForm").addEventListener('submit', function () {
        document.getElementById('myList').style.height = initialLi + "px";
        document.querySelector('.js-growable').style.height = initialCont + "px";
    });
    document.getElementById("submitForm").addEventListener('kepress', function (e) {
        if (e.which == 13) {
            document.getElementById('myList').style.height = initialLi + "px";
            document.querySelector('.js-growable').style.height = initialCont + "px";
        }
    });
    clone.textContent = "";
}
