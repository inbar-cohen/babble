var http = require('http'),
    url = require('url'),
    queryUtil = require('querystring'),
    messages = require('./messages-util.js'),
    clients = [],
    users = [],
    usersUpdate = [],
    msgs = [];
var id = 0;

var server = http.createServer(function (req, res) {
    setTimeout(function () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Methods", 'GET,OPTIONS,POST,DELETE');
        var address = url.parse(req.url);
        if (req.method === 'GET') {
            if (!address.path) {
                res.writeHead(404);
                res.end();
            }
            if (address.pathname.substr(0, 9) === '/messages' && address.query != null && address.query.substr(0, 8) === 'counter=' && isNaN(address.query.substr(8)) === false) {
                var count = address.query.replace(/[^0-9]*/, '');
                res.writeHead(200, { "Content-Type": "text/json" });
                if (msgs.length > count) {
                    res.end(JSON.stringify({
                        count: msgs.length,
                        append: msgs.slice(count),
                        status: "poll"
                    }));
                } else {
                    clients.push(res);
                }
                res.end();
            } else if (address.pathname.substr(0, 6) === '/stats') {
                if (users.length >= 0) {
                    res.end(JSON.stringify({
                        count: users.length,
                        count2: msgs.length,
                        append: users.slice(count),
                        status: "upol",
                        users: users.length,
                        messages: messages.length
                    }));
                } else {
                    usersUpdate.push(res);
                }
                res.end();
            } else if (address.pathname.substr(0, 9) === '/messages' && address.query != null && address.query.substr(0, 8) !== 'counter=') {
                res.writeHead(400);
                res.end();
            } else if (address.pathname.substr(0, 9) === '/messages' && address.query != null && address.query.substr(0, 8) === 'counter=' && isNaN(address.query.substr) === true) {
                res.writeHead(400);
                res.end();
            } else if (address.pathname === "/messages") {
                res.writeHead(405);
                res.end();
            } else if (address.pathname.includes("/messages/")) {
                res.writeHead(405);
                res.end();
            } else {
                res.writeHead(404);
                res.end();
            }
        } else if (req.method === 'POST') {
            if (address.pathname === '/messages' && !(address.path.includes("messages?counter=")) && !(address.path.includes("/messages/"))) {
                var requestBody = '';
                req.on('data', function (chunk) {
                    requestBody = JSON.parse(chunk);
                });
                req.on('end', function () {
                    var msg;
                    if (requestBody.name === undefined && requestBody.email === undefined && requestBody.timestamp === undefined) {

                        msg = { message: requestBody.message };
                    }
                    else {
                        msg = { name: requestBody.name, email: md5(requestBody.email), message: requestBody.message, timestamp: requestBody.timestamp };
                    }
                    console.log("the message: " + JSON.stringify(msg));
                    var i =  require('./messages-util.js').addMessage(msg);
                    console.log("msgs = " + JSON.stringify(msgs));
                    // msg.email = md5(msg.email);
                    while (clients.length > 0) {
                        var client = clients.pop();
                        client.end(JSON.stringify({
                            count: msgs.length,
                            append: msg,
                            status: "client"
                        }));
                    }
                    res.writeHead(200, { "Content-Type": "text/json" });
                    res.end(JSON.stringify({
                        id: i
                    }));
                });
            } else if (address.pathname.substr(0, 5) === '/log/') {
                var requestBody = '';
                req.on('data', function (chunk) {
                    requestBody = JSON.parse(chunk);
                });
                req.on('end', function () {
                    var u = { name: requestBody.name, email: requestBody.email };
                    if (requestBody.status === "login") {
                        users.push(u);
                    } else {
                        users.pop(u);
                    }
                    while (usersUpdate.length > 0) {
                        var client = usersUpdate.pop();
                        client.end(JSON.stringify({
                            users: users.length,
                            messages: msgs.length,
                        }));
                    }
                    res.writeHead(200, { "Content-Type": "text/json" });
                    res.end(JSON.stringify({
                        messages: msgs
                    }));
                });
            } else if (address.path.includes("messages?counter=")) {
                res.writeHead(405);
                res.end();
            } else if (address.path.includes("/messages/")) {
                res.writeHead(405);
                res.end();
            } else if (address.path.includes("/stats")) {
                res.writeHead(405);
                res.end();
            } else {
                res.writeHead(404);
                res.end();
            }
        } else if ((req.method === 'DELETE')) {
            var id1 = unescape(address.pathname.substr(10));
            if (address.path.includes("/messages/")) {
                if (!isNaN(id1)) {
                    res.writeHead(200, { "Content-Type": "text/json" });
                    res.end(require('./messages-util.js').deleteMessage(id1));
                } else {
                    res.writeHead(400);
                    res.end();
                }
            }
            else if (address.path.includes("messages?counter=")) {
                res.writeHead(405);
                res.end();
            } else if (address.path === ("/messages")) {
                res.writeHead(405);
                res.end();
            } else if (address.path.includes("/stats")) {
                res.writeHead(405);
                res.end();
            }
            else {
                res.writeHead(404);
                res.end();
            }
        } else if ((req.method === 'OPTIONS')) {
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(405);
            res.end();
        }
    }, 10);
}).listen(9000, 'localhost');

module.exports.id = id;
module.exports.msgs = msgs;
module.exports.users = users;
module.exports.messages = messages;
module.exports.server = server;

// MD5
function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
    txt = '';
    var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i)
            + (s.charCodeAt(i + 1) << 8)
            + (s.charCodeAt(i + 2) << 16)
            + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
            + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
}

function hex(x) {
    for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
    return x.join('');
}

function md5(s) {
    return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}
