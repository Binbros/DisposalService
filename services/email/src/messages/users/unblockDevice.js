const secret = require("../../utils/secret");
module.exports = (info) => {
  return {
    body: {
      name: info.name,
      intro:
        "A blacklisted device is trying to access your account.  Do you wish to unblock this device? Unblocking this device makes it able to access your account",
      action: [
        {
          instructions: "Cick the button below to unblock this device",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${secret.fronturl}/unblock?s=${info.token}`,
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
