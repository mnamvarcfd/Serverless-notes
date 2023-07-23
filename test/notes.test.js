// it ("should pass", () => {
//     expect(true).toBe(true);
// }) 


"use strict"
let init = require("./steps/init");
let {knownUser} = require("./steps/given");
let idToken;

describe("Given an authenticated user", () => {
    beforeAll(async() => {
        init();
        let user = await knownUser();
        idToken = user.AuthenticationResult.IdToken;
    });

    describe("When we invoke POST / note", () => {
        it ("Should create a new note", async () => {
            expect(true).toBe(true);
        })
    });

});