import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import socketService from "../services/SocketService";
import { debounce } from "lodash";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);

  const { matchData } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerData, setPartnerData] = useState(
    matchData || {
      id: 2,
      name: "Sarah Johnson",
      avatarUrl:
        "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
      isOnline: true,
      lastSeen: new Date(),
    }
  );

  const currentUserId = 1;

  useEffect(() => {
    socketService.connect(currentUserId);

    socketService.onNewMessage((messageData) => {
      console.log("Received new_message", messageData);
      if (messageData.matchId === partnerData.id) {
        const newMsg = {
          id: Date.now(),
          text: messageData.text,
          senderId: messageData.senderId,
          timestamp: new Date(),
          isRead: false,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    socketService.onTyping((data) => {
      if (data.matchId === partnerData.id) {
        setIsTyping(data.isTyping);
      }
    });

    socketService.onOnlineStatus((data) => {
      if (data.userId === partnerData.id) {
        setPartnerData((prev) => ({
          ...prev,
          isOnline: data.isOnline,
          lastSeen: new Date(),
        }));
      }
    });

    return () => {
      socketService.offNewMessage();
      socketService.offTyping();
      socketService.offOnlineStatus();
      socketService.disconnect();
    };
  }, [partnerData.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputText.trim(),
        senderId: currentUserId,
        matchId: partnerData.id,
        timestamp: new Date(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      socketService.sendMessage(newMessage);
      setInputText("");
    }
  };

  const debouncedSendTyping = useRef(
    debounce((text) => {
      socketService.sendTyping({
        matchId: partnerData.id,
        isTyping: text.length > 0,
      });
    }, 300)
  ).current;

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.senderId === currentUserId;
    const showAvatar =
      !isCurrentUser &&
      (index === 0 || messages[index - 1].senderId !== item.senderId);
    const showTime =
      index === messages.length - 1 ||
      messages[index + 1].senderId !== item.senderId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.partnerMessage,
        ]}
      >
        {!isCurrentUser && showAvatar && (
          <Image
            source={{ uri: partnerData.avatarUrl }}
            style={styles.messageAvatar}
          />
        )}
        {!isCurrentUser && !showAvatar && (
          <View style={styles.avatarPlaceholder} />
        )}

        <View>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.currentUserBubble : styles.partnerBubble,
              { maxWidth: wp(70) },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.partnerText,
              ]}
            >
              {item.text}
            </Text>
          </View>

          {showTime && (
            <View
              style={[
                styles.messageStatus,
                { justifyContent: isCurrentUser ? "flex-end" : "flex-start" },
              ]}
            >
              <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
              {isCurrentUser && (
                <Ionicons
                  name={item.isRead ? "checkmark-done" : "checkmark"}
                  size={12}
                  color={item.isRead ? "#4A90E2" : "#666"}
                  style={{ marginLeft: 3 }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.partnerMessage]}>
        <Image
          source={{ uri: partnerData.avatarUrl }}
          style={styles.messageAvatar}
        />
        <View
          style={[
            styles.messageBubble,
            styles.partnerBubble,
            styles.typingBubble,
          ]}
        >
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerContent}>
          <Image
            source={{ uri: partnerData.avatarUrl }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{partnerData.name}</Text>
            <Text style={styles.headerStatus}>
              {partnerData.isOnline
                ? "Online"
                : `Last seen ${formatTime(partnerData.lastSeen)}`}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert("Video call feature coming soon!")}
        >
          <Ionicons name="videocam" size={24} color="#4A90E2" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert("More options")}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => Alert.alert("Attachment feature coming soon!")}
          >
            <Ionicons name="add" size={24} color="#4A90E2" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              debouncedSendTyping(text);
            }}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />

          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() =>
                Alert.alert("Voice message feature coming soon!")
              }
            >
              <Ionicons name="mic" size={20} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = { /* giữ nguyên style bạn đã có */ };

export default ChatScreen;
