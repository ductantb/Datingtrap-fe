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

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);

  // Get match data from navigation params
  const { matchData } = route.params || {};

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! Nice to match with you 😊",
      senderId: 2,
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: 2,
      text: "Hi there! Thanks for the match. How's your day going?",
      senderId: 1,
      timestamp: new Date(Date.now() - 3000000),
      isRead: true,
    },
    {
      id: 3,
      text: "Pretty good! Just finished work. What about you?",
      senderId: 2,
      timestamp: new Date(Date.now() - 2400000),
      isRead: true,
    },
    {
      id: 4,
      text: "Same here! I love your photos by the way, especially the hiking one 🏔️",
      senderId: 1,
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mock current user ID
  const currentUserId = 1;

  const id = 2;
  // Mock partner data - in real app this would come from matchData
  const partnerData = matchData || {
    id: 2,
    name: "Sarah Johnson",
    avatarUrl:
      "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
    isOnline: true,
    lastSeen: new Date(),
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText.trim(),
        senderId: currentUserId,
        timestamp: new Date(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      // Simulate partner typing and response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const responses = [
            "That's awesome! 😄",
            "I totally agree!",
            "Haha, that's funny!",
            "Tell me more about that",
            "Sounds great! 👍",
          ];
          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];

          const partnerMessage = {
            id: messages.length + 2,
            text: randomResponse,
            senderId: id,
            timestamp: new Date(),
            isRead: false,
          };
          setMessages((prev) => [...prev, partnerMessage]);
        }, 2000);
      }, 1000);
    }
  };

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

      {/* Show time below bubble */}
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
            <View style={[styles.typingDot, { animationDelay: "0ms" }]} />
            <View style={[styles.typingDot, { animationDelay: "150ms" }]} />
            <View style={[styles.typingDot, { animationDelay: "300ms" }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Messages List */}
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

      {/* Input Area */}
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
            onChangeText={setInputText}
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
              onPress={() => Alert.alert("Voice message feature coming soon!")}
            >
              <Ionicons name="mic" size={20} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5", // màu nền nhẹ nhàng hơn
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#4CD964", // xanh khi online
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerStatus: {
    fontSize: 14,
    color: "#4CD964",
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 15,
  },
  currentUserMessage: {
    justifyContent: "flex-end",
  },
  partnerMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "75%",
  },
  currentUserBubble: {
    backgroundColor: "#4A90E2",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  partnerBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },
  currentUserText: {
    color: "white",
  },
  partnerText: {
    color: "#333",
  },
  messageStatus: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
  paddingHorizontal: 5,
},
timeText: {
  fontSize: 11,
  color: "#999",
},
  typingBubble: {
    paddingVertical: 15,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
    marginHorizontal: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatScreen;
