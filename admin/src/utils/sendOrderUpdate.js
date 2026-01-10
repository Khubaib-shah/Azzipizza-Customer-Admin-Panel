let whatsappTab = null;
export const sendOrderUpdate = async (order, status) => {
  const customerName = order.name;
  const customerPhone = `39${order.phoneNumber}`;
  const orderNumber = order._id.slice(-6).toUpperCase();

  let statusMessage = "";

  switch (status) {
    case "confirmed":
      statusMessage = `Hello ${customerName}! Order #${orderNumber} confirmed! %0A Preparing your food. %0A Estimated delivery: 30-40 min. We'll notify you when it's out for delivery. %0A Thank you!`;
      break;

    case "preparing":
      statusMessage = `Hello ${customerName}! Order #${orderNumber} is being prepared! %0A Ready in 20-25 min. %0A Stay tuned for updates!`;
      break;

    case "out_for_delivery":
      statusMessage = `Hello ${customerName}! Order #${orderNumber} is out for delivery! %0A Arrival: 15-20 min. %0A Please keep your phone handy!`;
      break;

    case "delivered":
      statusMessage = `Hello ${customerName}! Order #${orderNumber} has been delivered! %0A Enjoy your meal! 🍕 %0A Thank you for choosing Azzipizza!`;
      break;

    default:
      statusMessage = `Hello ${customerName}! Order #${orderNumber} received! %0A We're processing it and will update you soon.`;
  }
  const encodedMessage = encodeURIComponent(statusMessage);
  const whatsappURL = `https://web.whatsapp.com/send?phone=${customerPhone}&text=${encodedMessage}`;

  console.log("WhatsApp Tab reference:", whatsappTab);
  console.log(
    "Tab closed?",
    whatsappTab ? whatsappTab.closed : "No tab reference"
  );

  if (whatsappTab && !whatsappTab.closed) {
    console.log("Updating existing tab...");
    try {
      // Try to update the location
      whatsappTab.location.href = whatsappURL;
      whatsappTab.focus();
      console.log("Tab updated successfully");
    } catch (error) {
      console.log("Error updating tab:", error);
      // If error, open new tab
      whatsappTab = window.open(whatsappURL, "_blank");
    }
  } else {
    console.log("Opening new tab...");
    whatsappTab = window.open(whatsappURL, "_blank");
    if (whatsappTab) {
      console.log("New tab opened:", whatsappTab);
    } else {
      console.log("Browser blocked popup");
    }
  }
};
