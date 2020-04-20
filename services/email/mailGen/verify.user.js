function email(name, link) {
    return {
        name,
        intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
        action: {
            instructions: 'To enjoy full acess services with Binbro, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
}

module.exports = email