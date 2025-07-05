// File: app/screens/BuyerDashboard.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";

const dummyOrders = [
  { id: "1234", status: "Delivered", date: "June 25", total: "$34.50" },
  { id: "1235", status: "Pending", date: "June 27", total: "$48.00" },
];

const cartItems = [
  { name: "Tomatoes", qty: "2kg" },
  { name: "Carrots", qty: "1kg" },
];

const favoriteFarms = [
  { name: "Green Valley Farms" },
  { name: "SunFresh Organics" },
];

const reviews = [
  { item: "Tomatoes", rating: 4 },
  { item: "Cabbage", rating: 3 },
];

const payments = [
  { amount: "$34.50", date: "June 5" },
  { amount: "$89.00", date: "May 29" },
];

const BuyerDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👋 Hello Samuel</Text>

      {/* Order Summary */}
      <Section title="Recent Orders" icon={<MaterialIcons name="receipt" size={22} color="#007AFF" />}>
        {dummyOrders.map((order) => (
          <View key={order.id} style={styles.rowBetween}>
            <Text>#{order.id} - {order.status}</Text>
            <Text>{order.total}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>See all orders</Text></TouchableOpacity>
      </Section>

      {/* Cart */}
      <Section title="Your Cart" icon={<Ionicons name="cart-outline" size={22} color="#007AFF" />}>
        {cartItems.map((item, idx) => (
          <Text key={idx}>• {item.name} - {item.qty}</Text>
        ))}
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>View Cart</Text></TouchableOpacity>
      </Section>

      {/* Analytics */}
      <Section title="Purchase Analytics" icon={<FontAwesome5 name="chart-bar" size={20} color="#007AFF" />}>
        <Text>Total Spent This Month: $245.00</Text>
        <Text>Top Product: Organic Tomatoes</Text>
      </Section>

      {/* Favorite Farms */}
      <Section title="Favorite Farms" icon={<MaterialIcons name="favorite" size={22} color="#007AFF" />}>
        {favoriteFarms.map((farm, idx) => (
          <Text key={idx}>• {farm.name}</Text>
        ))}
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>Explore More Farms</Text></TouchableOpacity>
      </Section>

      {/* Reviews */}
      <Section title="Your Reviews" icon={<Ionicons name="star-outline" size={22} color="#007AFF" />}>
        {reviews.map((r, idx) => (
          <Text key={idx}>• {r.item}: {"⭐".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</Text>
        ))}
      </Section>

      {/* Profile */}
      <Section title="Account Settings" icon={<Ionicons name="person-circle-outline" size={22} color="#007AFF" />}>
        <Text>Name: Samuel Boateng</Text>
        <Text>Email: samuel@example.com</Text>
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>Edit Profile</Text></TouchableOpacity>
      </Section>

      {/* Payments */}
      <Section title="Payment History" icon={<Ionicons name="card-outline" size={22} color="#007AFF" />}>
        {payments.map((p, idx) => (
          <Text key={idx}>• {p.amount} - {p.date}</Text>
        ))}
      </Section>

      {/* Farm Explorer */}
      <Section title="Explore Farms" icon={<Entypo name="map" size={22} color="#007AFF" />}>
        <Text>Find farms near you and connect directly with farmers.</Text>
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>Open Farm Explorer</Text></TouchableOpacity>
      </Section>

      {/* Support */}
      <Section title="Support Center" icon={<Ionicons name="help-circle-outline" size={22} color="#007AFF" />}>
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>Contact Support</Text></TouchableOpacity>
        <TouchableOpacity style={styles.link}><Text style={styles.linkText}>Visit FAQs</Text></TouchableOpacity>
      </Section>
    </ScrollView>
  );
};

const Section = ({ title, icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={{ marginTop: 6 }}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f4f7",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default BuyerDashboard;
