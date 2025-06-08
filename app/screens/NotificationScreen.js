import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Mock user ID - replace with actual user from context/auth
  const userId = 1;

  // Mock data for development
  const mockNotifications = [
    {
      id: 1,
      type: "MATCH",
      message: "You matched with Sarah!",
      isRead: false,
      createdAt: new Date().toISOString(),
      referenceId: 123,
    },
    {
      id: 2,
      type: "MESSAGE",
      message: "New message from Alex",
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      referenceId: 456,
    },
    {
      id: 3,
      type: "LIKE",
      message: "Someone liked your profile!",
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      referenceId: 789,
    },
    {
      id: 4,
      type: "MATCH",
      message: "You matched with Emma!",
      isRead: true,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      referenceId: 101112,
    },
    {
      id: 5,
      type: "MESSAGE",
      message: "New message from Michael",
      isRead: false,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      referenceId: 131415,
    },
  ];

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async (page = 0, isRefresh = false) => {
    try {
      setLoading(page === 0 && !isRefresh);

      // Replace with actual API call
      // const response = await fetch(`/api/notifications?userId=${userId}&page=${page}&size=20`);
      // const data = await response.json();

      // Mock API simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = {
        content: mockNotifications,
        currentPage: page,
        totalPages: 2,
        totalElements: mockNotifications.length,
      };

      if (isRefresh || page === 0) {
        setNotifications(data.content);
      } else {
        setNotifications((prev) => [...prev, ...data.content]);
      }

      setCurrentPage(data.currentPage);
      setHasMore(data.currentPage < data.totalPages - 1);
    } catch (error) {
      console.error("Error loading notifications:", error);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/notifications/unread-count?userId=${userId}`);
      // const count = await response.json();

      // Mock unread count
      const count = mockNotifications.filter((n) => !n.isRead).length;
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

  const loadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(currentPage + 1);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' });

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
      // Replace with actual API call
      // await fetch(`/api/notifications/read-all?userId=${userId}`, { method: 'PUT' });

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);

      Alert.alert("Success", "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      Alert.alert("Error", "Failed to mark notifications as read");
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "MATCH":
        navigation.navigate("Chat", { matchId: notification.referenceId });
        break;
      case "MESSAGE":
        navigation.navigate("Chat", { matchId: notification.referenceId });
        break;
      case "LIKE":
        navigation.navigate("Home"); // Navigate to discovery screen
        break;
      default:
        break;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "MATCH":
        return { name: "heart", color: "#FF6B6B" };
      case "MESSAGE":
        return { name: "chatbubble", color: "#4ECDC4" };
      case "LIKE":
        return { name: "thumbs-up", color: "#45B7D1" };
      default:
        return { name: "notifications", color: "#666" };
    }
  };

  const renderNotification = ({ item }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        className={`flex-row items-center p-4 border-b border-gray-100 ${
          !item.isRead ? "bg-blue-50" : "bg-white"
        }`}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-4`}
          style={{ backgroundColor: icon.color + "20" }}
        >
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>

        <View className="flex-1">
          <Text
            className={`text-base ${
              !item.isRead ? "font-semibold text-gray-900" : "text-gray-700"
            }`}
          >
            {item.message}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {formatTime(item.createdAt)}
          </Text>
        </View>

        {!item.isRead && (
          <View className="w-3 h-3 bg-blue-500 rounded-full ml-2" />
        )}

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          className="ml-2"
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <SafeAreaView className="bg-white border-b border-gray-200">
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text className="text-sm text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </Text>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            className="bg-blue-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-sm font-medium">
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="notifications-outline" size={80} color="#ccc" />
      <Text className="text-xl font-semibold text-gray-400 mt-4">
        No notifications
      </Text>
      <Text className="text-gray-400 mt-2 text-center">
        You'll see your matches, messages, and likes here
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || notifications.length === 0) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View className="flex-1 bg-white">
        {renderHeader()}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationScreen;
