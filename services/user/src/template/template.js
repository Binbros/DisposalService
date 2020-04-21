function email(content) {
    const {name, text, buttonText , links} = content
    return {
        name,
        intro: text[0],
        action: {
            instructions: text[1],
            button: {
                color: '#22BC66', // Optional action button color
                text: buttonText,
                link: links[0]
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
}

module.exports = email