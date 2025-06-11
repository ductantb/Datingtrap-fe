// NotificationScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from '@react-native-firebase/auth';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const userId = 1; // Replace with real user ID

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async (page = 0, isRefresh = false) => {
    try {
      const token = await auth().currentUser.getIdToken();
      setLoading(page === 0 && !isRefresh);

      const res = await fetch(`https://api.datingtrap.com/api/notifications?userId=${userId}&page=${page}&size=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (isRefresh || page === 0) {
        setNotifications(data.content);
      } else {
        setNotifications((prev) => [...prev, ...data.content]);
      }

      setCurrentPage(data.currentPage);
      setHasMore(data.currentPage < data.totalPages - 1);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const token = await auth().currentUser.getIdToken();
      const res = await fetch(`https://api.datingtrap.com/api/notifications/unread-count?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = await res.json();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(0, true);
    loadUnreadCount();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = await auth().currentUser.getIdToken();
      await fetch(`https://api.datingtrap.com/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await auth().currentUser.getIdToken();
      await fetch(`https://api.datingtrap.com/api/notifications/read-all?userId=${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    switch (notification.type) {
      case "MATCH":
      case "MESSAGE":
        navigation.navigate("Chat", { matchId: notification.referenceId });
        break;
      case "LIKE":
        navigation.navigate("Home");
        break;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 16, backgroundColor: item.isRead ? '#FFF' : '#E6F0FF', borderBottomWidth: 1, borderColor: '#EEE' }}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons
          name={item.type === 'MATCH' ? 'heart' : item.type === 'MESSAGE' ? 'chatbubble' : 'thumbs-up'}
          size={24}
          color={item.type === 'MATCH' ? '#FF6B6B' : item.type === 'MESSAGE' ? '#4ECDC4' : '#45B7D1'}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: item.isRead ? 'normal' : 'bold' }}>{item.message}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        {!item.isRead && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginLeft: 8 }} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ color: '#007AFF' }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No notifications</Text>}
        ListFooterComponent={loading && notifications.length > 0 ? <ActivityIndicator style={{ margin: 10 }} /> : null}
        onEndReached={() => hasMore && loadNotifications(currentPage + 1)}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
