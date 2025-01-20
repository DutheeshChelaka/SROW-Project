const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: order.customerEmail,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <h2>Thank you for your order, ${order.customerName}!</h2>
        <p>Here are the details of your order:</p>
        <ul>
          ${order.products
            .map(
              (product) => `
            <li>
              ${product.name} - ${product.quantity} x LKR ${product.price} (Size: ${product.size})
            </li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Total Price:</strong> LKR ${order.totalPrice.toFixed(2)}</p>
        <p>We will notify you once your order has been shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendOrderConfirmationEmail;
