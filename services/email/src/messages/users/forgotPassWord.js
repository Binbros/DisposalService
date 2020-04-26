const secret = require ("../../utils/secret");
module.exports = (info) => {
  return {
    body: {
      name: info.name,
      intro:
        "You have requested to reset your password. Unblocking this device makes it  able to access your account",
      action: [
        {
          instructions: "Click the button below to reset password",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${secret.fronturl}/reset?s=${info.token}`,
          },
        },
        {
          instructions: "This link expires in 24 hours",
          button: {
            color: "", // Optional action button color
            text: "",
            link: '',
          },
        },
      ],
      outro: `If you did not make this request, no further action is required on your part`,
    },
  };
};
