// ReceiptDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: Set font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/v11/qkB7smc.ttf" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
    width: "80mm", // width will still default in px, but content should fit
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
});

const ReceiptDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.bold}>Azzi Pizza</Text>
        <Text>Order ID: {order._id}</Text>
        <Text>Date: {new Date(order.createdAt).toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Customer Info</Text>
        <Text>Name: {order.name}</Text>
        <Text>Phone: {order.phoneNumber}</Text>
        <Text>
          Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}{" "}
          - {order.deliveryAddress.zipCode}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Items</Text>
        {order.items.map((item, idx) => (
          <View key={idx}>
            <Text>
              {item.menuItem.name} x{item.quantity} - €{item.menuItem.price}
            </Text>
            {item.customizations && <Text>Note: {item.customizations}</Text>}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Total: €{order.totalPrice}</Text>
        <Text>Payment: {order.paymentStatus}</Text>
        <Text>Status: {order.orderStatus}</Text>
      </View>

      <Text>Grazie! 🍕</Text>
    </Page>
  </Document>
);

export default ReceiptDocument;
