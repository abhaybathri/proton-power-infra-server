
const escapeHTML = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const styles = {
  page: `
    margin:0;
    padding:30px 12px;
    background:#f3f6f4;
    font-family:Arial,Helvetica,sans-serif;
    color:#1f2937;
  `,
  container: `
    max-width:620px;
    margin:0 auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
  `,
  header: `
    background:#123c2b;
    padding:30px 32px;
    color:#ffffff;
  `,
  content: `
    padding:32px;
    line-height:1.6;
  `,
  footer: `
    background:#f5f8f6;
    padding:24px 32px;
    font-size:12px;
    color:#66736b;
    text-align:center;
    line-height:1.8;
  `,
  heading: `
    margin:0;
    font-size:25px;
    line-height:1.3;
    color:#ffffff;
  `,
  label: `
    font-size:12px;
    color:#718078;
    margin-bottom:4px;
  `,
  value: `
    font-size:14px;
    font-weight:bold;
    color:#243b30;
    margin:0;
  `,
  card: `
    border:1px solid #e4ebe6;
    border-radius:9px;
    padding:14px;
    margin-bottom:12px;
  `
};

const layout = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0">
</head>

<body style="${styles.page}">

  <table width="100%" cellpadding="0"
    cellspacing="0" border="0">

    <tr>
      <td align="center">

        <table width="100%" cellpadding="0"
          cellspacing="0" border="0"
          style="${styles.container}">

          ${content}

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`;

const header = () => `
<tr>
  <td style="${styles.header}">
    <p style="
      margin:0 0 10px;
      font-size:12px;
      letter-spacing:2px;
      color:#a8d9b9;
      font-weight:bold;
    ">
      ${escapeHTML(process.env.COMPANY_NAME)}
    </p>

    <h1 style="${styles.heading}">
      Solar Energy Solutions
    </h1>

    <p style="
      margin:10px 0 0;
      color:#d4e8dc;
      font-size:13px;
    ">
      Powering a brighter and greener future.
    </p>
  </td>
</tr>
`;

const footer = () => `
<tr>
  <td style="${styles.footer}">

    <strong style="color:#123c2b;">
      ${escapeHTML(process.env.COMPANY_NAME)}
    </strong>

    <br>

    ${escapeHTML(process.env.COMPANY_PHONE)}

    <br>

    <a href="${escapeHTML(process.env.COMPANY_WEBSITE)}"
      style="color:#16804c;text-decoration:none;">
      Visit our website
    </a>

    <p style="margin:14px 0 0;">
      © ${new Date().getFullYear()}
      ${escapeHTML(process.env.COMPANY_NAME)}.
      All rights reserved.
    </p>

  </td>
</tr>
`;

const infoCard = (label, value) => {
  if (!value) return "";

  return `
    <td width="50%" valign="top"
      style="padding:5px;">

      <table width="100%" cellpadding="0"
        cellspacing="0" border="0"
        style="${styles.card}">

        <tr>
          <td>
            <div style="${styles.label}">
              ${escapeHTML(label)}
            </div>

            <p style="${styles.value}">
              ${escapeHTML(value)}
            </p>
          </td>
        </tr>

      </table>
    </td>
  `;
};

// ==================================
// 1. COMPANY NOTIFICATION EMAIL
// ==================================

export const companyEmailTemplate = (data) => {

  const fields = [
    ["Customer Name", data.fullName],
    ["Email Address", data.email],
    ["Phone Number", data.mobile],
    ["Customer Type", data.customerType],
    ["Project Location", data.projectLocation],
    ["Property Type", data.propertyType],
    ["Monthly Electricity Consumption", data.electricityConsumption]
  ];

  const rows = fields
    .filter(([label, value]) => value)
    .map(([label, value]) => `
      <tr>
        <td style="
          padding:13px 10px;
          border-bottom:1px solid #edf1ee;
          font-size:13px;
          color:#718078;
          width:42%;
        ">
          ${escapeHTML(label)}
        </td>

        <td style="
          padding:13px 10px;
          border-bottom:1px solid #edf1ee;
          font-size:14px;
          font-weight:bold;
          color:#243b30;
        ">
          ${escapeHTML(value)}
        </td>
      </tr>
    `).join("");

  return layout(`
    ${header()}

    <tr>
      <td style="${styles.content}">

        <div style="
          display:inline-block;
          padding:7px 12px;
          background:#e6f5eb;
          color:#16804c;
          font-size:11px;
          font-weight:bold;
          border-radius:20px;
          margin-bottom:16px;
        ">
          NEW CUSTOMER ENQUIRY
        </div>

        <h2 style="
          margin:0 0 8px;
          font-size:23px;
          color:#163d2c;
        ">
          A new enquiry has arrived!
        </h2>

        <p style="
          font-size:14px;
          color:#64736a;
          margin:0 0 24px;
        ">
          A customer has submitted a solar project
          enquiry through your website. Here are the details.
        </p>

        <h3 style="
          color:#163d2c;
          font-size:15px;
          margin-bottom:10px;
        ">
          Customer Information
        </h3>

        <table width="100%" cellpadding="0"
          cellspacing="0" border="0"
          style="
            border:1px solid #e4ebe6;
            border-radius:9px;
          ">

          ${rows}

        </table>

        ${data.message ? `
          <h3 style="
            color:#163d2c;
            font-size:15px;
            margin:24px 0 10px;
          ">
            Customer Message
          </h3>

          <div style="
            background:#f5f8f6;
            padding:16px;
            border-left:3px solid #16804c;
            border-radius:5px;
            font-size:14px;
            line-height:1.7;
            color:#47574d;
            white-space:pre-wrap;
          ">
            ${escapeHTML(data.message)}
          </div>
        ` : ""}

        <p style="
          font-size:12px;
          color:#8a968e;
          margin-top:24px;
        ">
          Received on:
          ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

      </td>
    </tr>

    ${footer()}
  `);
};


// ==================================
// 2. CUSTOMER ACKNOWLEDGEMENT EMAIL
// ==================================

export const customerEmailTemplate = (data) => {

  return layout(`
    ${header()}

    <tr>
      <td style="${styles.content}">

        <div style="
          width:54px;
          height:54px;
          line-height:54px;
          text-align:center;
          background:#e6f5eb;
          color:#16804c;
          border-radius:50%;
          font-size:27px;
          margin-bottom:22px;
        ">
          &#10003;
        </div>

        <h2 style="
          font-size:25px;
          line-height:1.3;
          color:#163d2c;
          margin:0 0 12px;
        ">
          Thank You, ${escapeHTML(data.fullName)}!
        </h2>

        <p style="
          font-size:15px;
          line-height:1.8;
          color:#596a60;
          margin:0 0 22px;
        ">
          Your solar enquiry has been successfully
          received. We appreciate your interest in
          switching to clean and sustainable energy.
        </p>

        <div style="
          background:#eaf6ee;
          border:1px solid #d8ecde;
          padding:18px;
          border-radius:9px;
          margin-bottom:24px;
        ">
          <p style="
            margin:0;
            color:#23643e;
            font-size:14px;
            font-weight:bold;
          ">
            ✓ Enquiry successfully submitted
          </p>

          <p style="
            margin:7px 0 0;
            font-size:13px;
            color:#526c5b;
            line-height:1.6;
          ">
            Our team will review your requirements
            and contact you to discuss the next steps.
          </p>
        </div>

        <h3 style="
          color:#163d2c;
          font-size:16px;
          margin-bottom:12px;
        ">
          Your Enquiry Summary
        </h3>

        <table width="100%" cellpadding="0"
          cellspacing="0" border="0">

          <tr>
            ${infoCard("Customer Name", data.fullName)}
            ${infoCard("Phone Number", data.mobile)}
          </tr>

          <tr>
            ${infoCard("Customer Type", data.customerType)}
            ${infoCard("Property Type", data.propertyType)}
          </tr>

          <tr>
            ${infoCard("Project Location", data.projectLocation)}
            ${infoCard(
              "Monthly Consumption",
              data.electricityConsumption
            )}
          </tr>

        </table>

        <p style="
          font-size:14px;
          color:#596a60;
          line-height:1.7;
          margin-top:22px;
        ">
          If you have any additional questions,
          feel free to contact our team.
        </p>

        <p style="
          margin-top:22px;
          color:#163d2c;
          font-size:14px;
          line-height:1.7;
        ">
          Warm regards,<br>
          <strong>${escapeHTML(process.env.COMPANY_NAME)}</strong>
        </p>

      </td>
    </tr>

    ${footer()}
  `);
};
