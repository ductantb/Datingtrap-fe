import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await auth().currentUser.getIdToken();
        const userId = 1; // Replace with actual ID
        const res = await fetch(`https://api.datingtrap.com/match?userId=${userId}&page=0&size=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const mapped = data.content.map((item) => ({
          id: item.matchId,
          name: item.partnerUsername,
          avatarUrl: item.partnerAvatarUrl,
          lastMessage: item.lastMessage,
          lastMessageTime: new Date(item.lastMessageTime),
        }));
        setConversations(mapped);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchConversations();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Chat', {
        matchData: {
          id: item.id,
          name: item.name,
          avatarUrl: item.avatarUrl,
        },
      })}
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  lastMessage: { color: '#666' },
});

export default ChatListScreen;
