'use strict';

let assert = window.chai.assert;
let sinon = window.sinon;
let Babble = window.Babble;

// let main = require("../../client/scripts/main.js");

describe("adding new message to the array of messages", function () {
    it("createMessage - should insert to the ol of mesages", function () {
        var list = document.querySelector(".messagesList"),
            listLi = list.getElementsByTagName("li");
        console.log("LENGH = " + listLi.length);

        createMessage("Inbar Cohen", "inbar2859@gmail.com", "Hi", 100, true, 0);
        console.log("LENGH = " + listLi.length);

        // let ol = document.getElementById("myList");
        assert.equal(listLi.length, 1, "ERROR the message is not added to the list");
    });
});

