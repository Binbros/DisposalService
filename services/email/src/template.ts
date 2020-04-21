"use strict";

import Mailgen, { Content } from "mailgen";

const email = (content: object): Content => {
    const { name, buttonText, text, links } = content;
    return {
        body: {
            name,
            intro: text[0],
            action: [{
                instructions: text[1],
                button: {
                    color: "#22BC66", // Optional action button color
                    text: buttonText,
                    link: links[0],
                },
            }, {
                instructions: text[2],
                button: {
                    color: "#22BC66", // Optional action button color
                    text: buttonText,
                    link: links[1],
                },

            },
            ],
            outro: text[3],
        }; 
    };};

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
mailGenerator.generate(email);

export default mailGenerator;
