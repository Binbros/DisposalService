"use strict";

import Mailgen from "mailgen";
const mailGenerator = new Mailgen({
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

export default mailGenerator;
