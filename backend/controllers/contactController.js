const sendEmail = require("../utils/sendEmail");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    await sendEmail(
      process.env.EMAIL_USER,
      "New RentEase Help Center Message",
      `
Name: ${name}
Email: ${email}

Problem:
${message}
      `,
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { sendContactMessage };
