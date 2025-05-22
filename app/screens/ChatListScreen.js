import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'messages'
  
  // Mock data for matches and conversations
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatarUrl: "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
      age: 25,
      mutualFriends: 3,
      isOnline: true,
      matchedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: 2,
      name: "Emma Wilson",
      avatarUrl: "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
      age: 23,
      mutualFriends: 1,
      isOnline: false,
      matchedAt: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
      id: 3,
      name: "Jessica Chen",
      avatarUrl: "https://i.pinimg.com/736x/48/62/99/486299625e08a1e62ad9451dac4630ff.jpg",
      age: 27,
      mutualFriends: 5,
      isOnline: true,
      matchedAt: new Date(Date.now() - 259200000), // 3 days ago
    },
    {
      id: 4,
      name: "Maria Garcia",
      avatarUrl: "https://i.pinimg.com/736x/47/88/22/478822b8b8c8c745ac4b56b1f79dc2b9.jpg",
      age: 24,
      mutualFriends: 2,
      isOnline: false,
      matchedAt: new Date(Date.now() - 432000000), // 5 days ago
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      matchId: 1,
      name: "Sarah Johnson",
      avatarUrl: "https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg",
      lastMessage: "That sounds amazing! I'd love to go hiking this weekend 🏔️",
      lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
    },
    {
      id: 2,
      matchId: 2,
      name: "Emma Wilson",
      avatarUrl: "https://i.pinimg.com/736x/49/67/4c/49674ccc074f5b28829c058d293cad60.jpg",
      lastMessage: "Thanks for the great conversation yesterday!",
      lastMessageTime: new Date(Date.now() - 43200000), // 12 hours ago
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    },
    {
      id: 3,
      matchId: 3,
      name: "Jessica Chen",
      avatarUrl: "https://i.pinimg.com/736x/48/62/99/486299625e08a1e62ad9451dac4630ff.jpg",
      lastMessage: "Hey! Nice to match with you 😊",
      lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
      unreadCount: 1,
      isOnline: true,
      isTyping: true,
    },
    {
      id: 4,
      matchId: 5,
      name: "Lisa Anderson",
      avatarUrl: "https://i.pinimg.com/736x/50/29/77/502977a7b5e2d94f5a1ea3b3da15f8e0.jpg",
      lastMessage: "I saw your photography work, it's incredible!",
      lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return messageTime.toLocaleDateString();
  };

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMatchPress = (match) => {
    // Check if there's already a conversation with this match
    const existingConv = conversations.find(conv => conv.matchId === match.id);
    
    if (existingConv) {
      // Navigate to existing chat
      navigation.navigate('Chat', { 
        matchData: {
          id: match.id,
          name: match.name,
          avatarUrl: match.avatarUrl,
          isOnline: match.isOnline
        }
      });
    } else {
      // Start new conversation
      Alert.alert(
        "Start Conversation",
        `Send a message to ${match.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Send Message", 
            onPress: () => {
              navigation.navigate('Chat', { 
                matchData: {
                  id: match.id,
                  name: match.name,
                  avatarUrl: match.avatarUrl,
                  isOnline: match.isOnline
                }
              });
            }
          }
        ]
      );
    }
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chat', { 
      matchData: {
        id: conversation.matchId,
        name: conversation.name,
        avatarUrl: conversation.avatarUrl,
        isOnline: conversation.isOnline
      }
    });
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const renderMatch = ({ item }) => (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => handleMatchPress(item)}
    >
      <View style={styles.matchImageContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.matchImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.matchName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.matchAge}>{item.age}</Text>
    </TouchableOpacity>
  );

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationImageContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.conversationImage} />
        {item.isOnline && <View style={styles.onlineIndicatorSmall} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.conversationTime}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>
        
        <View style={styles.conversationMessageRow}>
          <Text 
            style={[
              styles.conversationMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
            {item.isTyping ? "typing..." : item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Messages</Text>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={() => Alert.alert("Filter options coming soon!")}
      >
        <Ionicons name="options" size={24} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search matches and messages..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity 
          onPress={() => setSearchQuery('')}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
        onPress={() => setActiveTab('matches')}
      >
        <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
          New Matches ({filteredMatches.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
        onPress={() => setActiveTab('messages')}
      >
        <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
          Messages ({filteredConversations.filter(c => c.unreadCount > 0).length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={activeTab === 'matches' ? "heart" : "chatbubble"} 
        size={50} 
        color="#CCC" 
      />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'matches' ? 'No new matches' : 'No conversations yet'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'matches' 
          ? 'Keep swiping to find your perfect match!' 
          : 'Start a conversation with your matches!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      {renderTabs()}
      
      {activeTab === 'matches' ? (
        filteredMatches.length > 0 ? (
          <FlatList
            data={filteredMatches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          renderEmptyState()
        )
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.conversationsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 25,
    padding: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  matchesList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  matchCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  matchImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  matchName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  matchAge: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginVertical: 3,
    borderRadius: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  conversationImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  conversationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  conversationMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    fontStyle: 'normal',
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatListScreen;
