"use strict";

const Mailgen = require("mailgen");
const mailgen = new Mailgen({
        theme: "cerberus",
        product: {
            // Appears in header & footer of e-mails
            name: "Binbro",
            link: "https://mailgen.js/",
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
            copyright: "Copyright © 2020 Binbro. All rights reserved.",
        },
    });


module.exports = mailgen
