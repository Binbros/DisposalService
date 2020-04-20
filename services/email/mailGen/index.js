"use strict"

const Mailgen = require('mailgen');
const verifyAccount = require('./verify.user');

class MailGenerator {
    constructor() {
        this.mail = new Mailgen({
            theme: 'cerberus',
            product: {
                // Appears in header & footer of e-mails
                name: 'Binbro',
                link: 'https://mailgen.js/'
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        })
    }

    verifyAccount(name, link) {
        return this.mail.generate(verifyAccount(name,link));
    }
}

module.exports = new MailGenerator();