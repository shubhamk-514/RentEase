const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // await transporter.sendMail({
    //   from: `"RentEase" <${process.env.EMAIL_USER}>`,
    //   to,
    //   subject,
    //   text,
    // });

    // console.log(`Email sent successfully to ${to}`);

    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("Before sending email");

    await transporter.sendMail({
      from: `"RentEase" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("After sending email");
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email Error:", error);

    throw new Error(error.message); // IMPORTANT
  }
};

module.exports = sendEmail;
