let whatsappTab = null;

const normalizeItalianPhone = (raw) => {
  let phone = raw.replace(/[\s\-()]/g, "").replace(/^\+/, "");

  if (phone.startsWith("00")) phone = phone.slice(2);

  if (phone.startsWith("39") && phone.length > 9) return phone;

  return `39${phone}`;
};

export const sendOrderUpdate = async (order, status) => {
  const customerName = order.name;
  const customerPhone = normalizeItalianPhone(order.phoneNumber);
  const orderNumber = order._id.slice(-6).toUpperCase();

  let statusMessage = "";

  switch (status) {
    case "confirmed":
      statusMessage = `Hello ${customerName}!\nOrder #${orderNumber} confirmed!\nPreparing your food.\nEstimated delivery: 30-40 min. We'll notify you when it's out for delivery.\nThank you!`;
      break;

    case "preparing":
      statusMessage = `Hello ${customerName}!\nOrder #${orderNumber} is being prepared!\nReady in 20-25 min.\nStay tuned for updates!`;
      break;

    case "out_for_delivery":
      statusMessage = `Hello ${customerName}!\nOrder #${orderNumber} is out for delivery!\nArrival: 15-20 min.\nPlease keep your phone handy!`;
      break;

    case "delivered":
      statusMessage = `Hello ${customerName}!\nOrder #${orderNumber} has been delivered!\nEnjoy your meal! 🍕\nThank you for choosing Azzipizza!`;
      break;

    default:
      statusMessage = `Hello ${customerName}!\nOrder #${orderNumber} received!\nWe're processing it and will update you soon.`;
  }
  const encodedMessage = encodeURIComponent(statusMessage);
  const whatsappURL = `https://wa.me/${customerPhone}?text=${encodedMessage}`;

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
