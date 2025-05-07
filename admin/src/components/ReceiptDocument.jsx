import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  // Image,
} from "@react-pdf/renderer";

// import BarCode from "../../public/barcode.png";

Font.register({
  family: "Courier",
  src: "/fonts/CourierPrime-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 30,
    lineHeight: 1.2,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textCenter: {
    textAlign: "center",
  },
  divider: {
    marginVertical: 4,
    borderBottomWidth: 0.6,
    borderBottomColor: "#000",
  },
  bold: {
    fontWeight: 600,
  },

  highlight: {
    fontSize: 12,
    fontWeight: 600,
  },

  section: {
    marginBottom: 6,
  },

  itemContainer: {
    borderBottomWidth: 0.2,
    paddingBottom: 4,
    borderBottomColor: "#000",
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetails: {
    flexDirection: "row",
    gap: 4,
  },
  itemQuantity: {
    fontSize: 10,
    fontWeight: 400,
  },
  itemName: {
    fontSize: 10,
  },
  itemPrice: {
    fontSize: 10,
    fontWeight: 400,
  },
  ingredientContainer: {
    marginLeft: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 2,
  },
  ingredientList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  ingredientText: {
    fontSize: 8,
  },
  ingredientPrice: {
    fontSize: 8,
  },
});

const ReceiptDocument = ({ order }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("it-IT", {
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Document>
      <Page size={[226.77, null]} wrap={false} style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={[styles.textCenter, styles.highlight]}>
            *** AzziPizza ***
          </Text>
          <Text style={styles.textCenter}>Mica Pizza e Fichi</Text>
          <Text style={styles.textCenter}>
            Via Frassinago, 16b, 40123 Bologna
          </Text>
          <Text style={styles.textCenter}>Tel: +39 371 39 85 810</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Articoli:</Text>
          {order.items.map((item, idx) => (
            <View
              key={idx}
              style={order.items.length > 1 ? styles.itemContainer : null}
            >
              {/* Item Header */}
              <View style={styles.itemHeader}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.menuItem.name}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  €{item.menuItem.price.toFixed(2)}
                </Text>
              </View>

              {/* Selected Ingredients */}
              {item.selectedIngredients &&
                item.selectedIngredients.length > 0 && (
                  <View style={styles.ingredientContainer}>
                    {item.selectedIngredients.map((ing, index) => (
                      <View style={styles.ingredientList}>
                        <Text key={index} style={styles.ingredientText}>
                          x {ing.name}
                        </Text>
                        <Text key={index} style={styles.ingredientText}>
                          €{ing.price}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
            </View>
          ))}
        </View>

        {order.items[0].customizations && (
          <View>
            <View style={order.items.length < 2 ? styles.divider : null} />
            <Text style={{ textAlign: "center" }}>
              Note : {order.items[0].customizations}
            </Text>
          </View>
        )}
        <View style={styles.divider} />

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.bold}>ID Ordine: {order._id.slice(-6)}</Text>
          <Text>Data: {formatDate(order.createdAt)}</Text>
          <Text>Cliente: {order.name}</Text>
          <Text>Telefono: {order.phoneNumber}</Text>
          <Text>
            Indirizzo: {order.deliveryAddress.street},{" "}
            {order.deliveryAddress.city} ({order.deliveryAddress.zipCode})
          </Text>
        </View>
        <View style={styles.divider} />

        {/* Total and Payment */}
        <View style={styles.section}>
          <View style={styles.line}>
            <Text style={styles.bold}>Totale:</Text>
            <Text style={styles.bold}>€{order.totalPrice.toFixed(2)}</Text>
          </View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 10,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Pagamento:{" "}
            {order.paymentStatus === "Pending"
              ? "Contanti alla consegna"
              : "Pagato"}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          {/* <Image style={styles.image} src={BarCode} /> */}
          <Text style={[styles.textCenter, { marginTop: 10 }]}>
            Grazie per aver ordinato da Azzi Pizza! 🍕
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptDocument;
