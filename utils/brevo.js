
const sendBrevoEmail = async ({
  to,
  subject,
  html,
  replyTo
}) => {

    const apiKey = process.env.BREVO_API_KEY?.trim();

console.log("Brevo key loaded:", Boolean(apiKey));
console.log("Brevo key prefix:", apiKey?.slice(0, 8));
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json"
      },

      body: JSON.stringify({
        sender: {
          name: process.env.COMPANY_NAME,
          email: process.env.BREVO_SENDER_EMAIL
        },

        to: [
          {
            email: to.email,
            name: to.name
          }
        ],

        replyTo,

        subject,

        htmlContent: html
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Brevo Error: ${error}`
    );
  }

  return await response.json();
};

export default sendBrevoEmail;
