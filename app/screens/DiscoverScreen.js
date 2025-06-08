import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  {
    title: 'serious',
    icon: <FontAwesome5 name="rose" size={40} color="white" />,
    color: '#B379F4',
    people: '3K',
    target: 'love',
  },
  {
    title: 'casual',
    icon: <FontAwesome5 name="heart" size={36} color="white" />,
    color: '#FF5A5F',
    people: '2K',
    target: 'serious',
  },
  {
    title: 'fun',
    icon: <Ionicons name="moon" size={36} color="white" />,
    color: '#B379F4',
    people: '1K',
    target: 'tonight',
  },
  {
    title: 'Just Chatting',
    icon: <Ionicons name="chatbubble-ellipses" size={36} color="white" />,
    color: '#FF5A5F',
    people: '1K',
    target: 'chat',
  },
];

const DiscoverScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
  navigation.navigate('Home');
};


  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Welcome to Discover</Text>
      <Text style={styles.subHeader}>Find people who share your dating goals</Text>

      <View style={styles.grid}>
        {categories.map((item, index) => (
          <Pressable
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={handlePress}
          >
            <View style={styles.iconRow}>
              {item.icon}
              <View style={styles.badge}>
                <Ionicons name="person" size={12} color="#fff" />
                <Text style={styles.badgeText}>{item.people}</Text>
              </View>
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 6,
  },
  header: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeader: {
    color: '#555',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'column',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#00000088',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
