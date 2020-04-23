import secret from "../../utils/secret";
export default (info) => {
  return {
    body: {
      name: info.name,
      intro:
        "You have recieve this email because a unknown device tried to access your account. If that was you kindly verify the device",
      action: [
        {
          instructions:
            "To access your account with a different device, please verify the device below",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Verify Device",
            link: `${secret.fronturl}/verify?s=${info.firstToken}`,
          },
        },
        {
          instructions: "This link expires in 24 hours",
        },
      ],
      outro: `If the action was not prompted by you, kindly block the device by clicking ${[
        here,
      ](secret.fronturl)}/block?s=${info.secondToken}})`,
    },
  };
};
