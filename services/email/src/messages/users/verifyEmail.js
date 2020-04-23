import secret from "../../utils/secret";
export default (info) => {
  return {
    body: {
      name: info.name,
      intro: "Welcome to Binbro! We're very excited to have you on board.",
      action: [
        {
          instructions:
            "We need a little more information to provide you better support,including the confirmation of your aacount",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${secret.frontUrl}/confirm?s=${info.token}`,
          },
        },
        {
          instructions: "This link expires in 24 hours",
        },
      ],
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
