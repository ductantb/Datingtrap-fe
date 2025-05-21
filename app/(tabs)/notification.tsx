import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';

const notifications = [
  { id: '1', title: 'New Message', content: 'You have a new message from Alice.', time: '2 min ago' },
  { id: '2', title: 'New Match', content: 'You matched with Bob!', time: '10 min ago' },
  { id: '3', title: 'Reminder', content: 'Complete your profile to get more matches.', time: '1 hour ago' },
];

export default function NotificationScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 12 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}
          >
            <View style={{ marginRight: 12 }}>
              <Bell size={24} color="#007aff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', fontSize: 15 }}>{item.title}</Text>
              <Text style={{ color: '#555', marginTop: 2 }}>{item.content}</Text>
              <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
