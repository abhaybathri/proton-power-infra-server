
import sendBrevoEmail from "../utils/brevo.js";

import {
  companyEmailTemplate,
  customerEmailTemplate
} from "../utils/emailTemplate.js";

const submitEnquiry = async (req, res) => {
  try {

    const {
      fullName,
      email,
      mobile,
      customerType,
      projectLocation,
      propertyType,
      electricityConsumption,
      message
    } = req.body;

    // 1. Validate required fields

    const requiredFields = {
      fullName,
      email,
      mobile,
      customerType,
      projectLocation
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (
        typeof value !== "string" ||
        !value.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${key} is required.`
        });
      }
    }

    // 2. Validate email format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // 3. Validate field lengths

    const limits = {
      fullName: 100,
      email: 254,
      mobile: 11,
      customerType: 50,
      projectLocation: 200,
      propertyType: 100,
      electricityConsumption: 100,
      message: 2000
    };

    for (const [key, limit] of Object.entries(limits)) {
      const value = req.body[key] ?? "";

      if (
        typeof value !== "string" ||
        value.length > limit
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${key}.`
        });
      }
    }

    // 4. Prepare clean customer data

    const data = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      customerType: customerType.trim(),
      projectLocation: projectLocation.trim(),
      propertyType: propertyType?.trim() || "",
      electricityConsumption:
        electricityConsumption?.trim() || "",
      message: message?.trim() || ""
    };

    // 5. Generate email HTML

    const companyHTML = companyEmailTemplate(data);

    const customerHTML = customerEmailTemplate(data);

    // 6. Send company notification first

    const companyResult = await sendBrevoEmail({
      to: {
        email: process.env.COMPANY_EMAIL,
        name: process.env.COMPANY_NAME
      },

      subject: `New Solar Enquiry - ${data.fullName}`,

      html: companyHTML,

      replyTo: {
        email: data.email,
        name: data.fullName
      }
    });

    // 7. Send customer acknowledgement

    let customerEmailSent = true;

    try {
      await sendBrevoEmail({
        to: {
          email: data.email,
          name: data.fullName
        },

        subject: "Your Solar Enquiry Has Been Received!",

        html: customerHTML,

        replyTo: {
          email: process.env.COMPANY_EMAIL,
          name: process.env.COMPANY_NAME
        }
      });

    } catch (error) {
      customerEmailSent = false;

      console.error(
        "Customer acknowledgement failed:",
        error.message
      );
    }

    // 8. Return success response

    return res.status(200).json({
      success: true,

      message: (customerEmailSent)
        ? "Your enquiry has been submitted successfully!"
        : "Your enquiry was received. Your confirmation email may be delayed.",

      companyEmailSent: true,
      customerEmailSent,

      messageId: companyResult.messageId
    });

  } catch (error) {

    console.error("Enquiry submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
};

export { submitEnquiry };
