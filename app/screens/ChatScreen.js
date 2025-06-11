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
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';
import webSocketService from "../services/WebSocketService";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);
  const { matchData } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [partnerData, setPartnerData] = useState(matchData);

  const currentUserId = 1; // TODO: Replace with actual user ID from context or auth

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await auth().currentUser.getIdToken();
        const res = await fetch(
          `https://api.datingtrap.com/api/messages?matchId=${partnerData.id}&page=0&size=30`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const formatted = data.content.map((msg) => ({
          id: msg.id,
          text: msg.message,
          senderId: msg.senderId,
          timestamp: new Date(msg.createdAt),
          isRead: true,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();

    webSocketService.connect(currentUserId).then(() => {
      webSocketService.subscribeToMessages((messageData) => {
        if (messageData.matchId === partnerData.id) {
          const newMsg = {
            id: messageData.id,
            text: messageData.message,
            senderId: messageData.senderId,
            timestamp: new Date(messageData.createdAt),
            isRead: false,
          };
          setMessages((prev) => [...prev, newMsg]);
        }
      });
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [partnerData.id]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: null,
        message: inputText.trim(),
        senderId: currentUserId,
        receiverId: partnerData.id,
        createdAt: null,
      };

      webSocketService.sendMessage(newMessage);
      setMessages((prev) => [
        ...prev,
        { ...newMessage, id: Date.now(), timestamp: new Date(), isRead: false },
      ]);
      setInputText("");
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.partnerMessage]}>
        <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.partnerBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messagesContent: { padding: 10 },
  messageContainer: { marginVertical: 4 },
  currentUserMessage: { alignItems: 'flex-end' },
  partnerMessage: { alignItems: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: '80%' },
  currentUserBubble: { backgroundColor: '#DCF8C6' },
  partnerBubble: { backgroundColor: '#EEE' },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
});

export default ChatScreen;