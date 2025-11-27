import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const initialNotifications = [
  {
    id: "n1",
    type: "order",
    title: "Order #3482 confirmed",
    message: "Your order has been confirmed and will be prepared shortly.",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "message",
    title: "New message from Green Valley Farm",
    message: "Hi! Your tomatoes are ready for pickup tomorrow morning.",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min ago
    read: false,
  },
  {
    id: "n3",
    type: "promo",
    title: "Weekend Deal: 10% off leafy greens",
    message: "Limited time offer on lettuce, kale and spinach.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h ago
    read: true,
  },
  {
    id: "n4",
    type: "system",
    title: "App updated",
    message: "We’ve squashed some bugs and improved performance.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    read: true,
  },
  {
    id: "n5",
    type: "order",
    title: "Order #3421 delivered",
    message: "Your order has been delivered. Enjoy!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "n6",
    type: "promo",
    title: "Fresh arrivals near you",
    message: "New farm produce listed by Sunrise Harvest.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    read: false,
  },
  {
    id: "n7",
    type: "message",
    title: "Kojo Mensah sent a reply",
    message: "Sure, we can swap to 3kg carrots.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(), // 9 days ago
    read: true,
  },
];


const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  return `${w}w ago`;
};

const iconForType = (type) => {
  switch (type) {
    case "order":
      return <MaterialCommunityIcons name="basket-outline" size={20} color="#392867" />;
    case "message":
      return <Ionicons name="chatbubble-ellipses-outline" size={20} color="#392867" />;
    case "promo":
      return <Ionicons name="pricetags-outline" size={20} color="#392867" />;
    default:
      return <Ionicons name="information-circle-outline" size={20} color="#392867" />;
  }
};

export default function NotificationsScreen() {
  const [items, setItems] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = useMemo(
    () => (showUnreadOnly ? items.filter((n) => !n.read) : items),
    [items, showUnreadOnly]
  );

  const sections = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - 7);

    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const earlier = [];

    filtered.forEach((n) => {
      const d = new Date(n.createdAt);
      if (d >= todayStart) {
        today.push(n);
      } else if (d >= yesterdayStart && d < todayStart) {
        yesterday.push(n);
      } else if (d >= weekStart && d < yesterdayStart) {
        thisWeek.push(n);
      } else {
        earlier.push(n);
      }
    });

    const s = [];
    if (today.length) s.push({ title: "Today", data: today });
    if (yesterday.length) s.push({ title: "Yesterday", data: yesterday });
    if (thisWeek.length) s.push({ title: "This Week", data: thisWeek });
    if (earlier.length) s.push({ title: "Earlier", data: earlier });
    return s;
  }, [filtered]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetch; prepend a new notification
    setTimeout(() => {
      const newItem = {
        id: `n${Math.random().toString(36).slice(2)}`,
        type: "promo",
        title: "Limited Offer: Free delivery today",
        message: "Enjoy free delivery on orders above $20.",
        createdAt: new Date().toISOString(),
        read: false,
      };
      setItems((prev) => [newItem, ...prev]);
      setRefreshing(false);
    }, 900);
  }, []);

  const toggleRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const removeOne = (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    if (!items.length) return;
    Alert.alert("Clear all notifications?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => setItems([]) },
    ]);
  };

  const markAllAsRead = () => {
    if (!unreadCount) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const HeaderBar = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notifications</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => setShowUnreadOnly((s) => !s)}
          style={[styles.pillBtn, showUnreadOnly && styles.pillBtnActive]}
        >
          <Ionicons
            name={showUnreadOnly ? "eye-off-outline" : "eye-outline"}
            size={16}
            color={showUnreadOnly ? "#fff" : "#392867"}
          />
          <Text style={[styles.pillText, showUnreadOnly && styles.pillTextActive]}>
            {showUnreadOnly ? "Unread Only" : "All"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={markAllAsRead}
          style={[styles.pillBtn, unreadCount ? styles.pillBtnActiveSoft : null]}
          disabled={!unreadCount}
        >
          <Ionicons name="checkmark-done-outline" size={16} color={unreadCount ? "#392867" : "#999"} />
          <Text style={[styles.pillText, { color: unreadCount ? "#392867" : "#999" }]}>
            Mark all read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearAll} style={[styles.pillBtn, styles.destructiveBtn]}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={[styles.pillText, styles.destructiveText]}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.unreadBadgeRow}>
        <Text style={styles.subtleText}>
          {unreadCount ? `${unreadCount} unread` : "You're all caught up!"}
        </Text>
      </View>
    </View>
  );

  const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const Item = ({ item }) => {
    const unread = !item.read;
    return (
      <TouchableOpacity
        onPress={() => toggleRead(item.id)}
        onLongPress={() =>
          Alert.alert("Notification", item.message, [
            { text: unread ? "Mark as read" : "Mark as unread", onPress: () => toggleRead(item.id) },
            { text: "Delete", style: "destructive", onPress: () => removeOne(item.id) },
            { text: "Close", style: "cancel" },
          ])
        }
        style={[styles.card, unread && styles.cardUnread]}
      >
        <View style={styles.iconWrap}>{iconForType(item.type)}</View>
        <View style={styles.cardBody}>
          <View style={styles.rowBetween}>
            <Text style={[styles.title, unread && styles.titleUnread]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={styles.actionsRow}>
            {item.type === "order" && (
              <TouchableOpacity style={styles.linkBtn}>
                <Text style={styles.linkBtnText}>View order</Text>
              </TouchableOpacity>
            )}
            {unread && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
    <View>
        <StatusBar style="dark" />
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Item item={item} />}
          renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
          ListHeaderComponent={<HeaderBar />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={34} color="#B9B9C2" />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyText}>
                When there’s something new, it will show up here.
              </Text>
            </View>
          }
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#392867" />
          }
          showsVerticalScrollIndicator={false}
        />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  /* Header */
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#392867",
    textAlign: "center",
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E7E7EF",
    gap: 6,
  },
  pillBtnActive: {
    backgroundColor: "#392867",
    borderColor: "#392867",
  },
  pillBtnActiveSoft: {
    backgroundColor: "#F0ECFF",
    borderColor: "#D7CEF8",
  },
  pillText: {
    color: "#392867",
    fontWeight: "600",
    fontSize: 13,
  },
  pillTextActive: {
    color: "#fff",
  },
  destructiveBtn: {
    backgroundColor: "#E63946",
    borderColor: "#E63946",
  },
  destructiveText: {
    color: "#fff",
    fontWeight: "700",
  },
  unreadBadgeRow: {
    marginTop: 8,
  },
  subtleText: {
    color: "#6B6B7A",
    fontSize: 12,
    textAlign: "center",
  },

  /* Sections */
  sectionHeader: {
    backgroundColor: "#F0ECFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  sectionTitle: {
    color: "#392867",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  /* Notification card */
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardUnread: {
    backgroundColor: "#FBFAFF",
    borderWidth: 1,
    borderColor: "#E8E3FF",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0ECFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    color: "#22223B",
    fontWeight: "700",
    fontSize: 14.5,
    flex: 1,
  },
  titleUnread: {
    color: "#1B1651",
  },
  message: {
    color: "#555568",
    marginTop: 4,
    fontSize: 13.5,
    lineHeight: 19,
  },
  time: {
    color: "#8C8CA1",
    fontSize: 12,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#392867",
    borderRadius: 8,
  },
  linkBtnText: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7C4DFF",
  },

  /* Empty state */
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#392867",
  },
  emptyText: {
    color: "#6B6B7A",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
