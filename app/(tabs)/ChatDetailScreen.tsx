import { useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const mockMessages = [
  { id: '1', text: 'Hi!', sender: 'other' },
  { id: '2', text: 'Hello! How are you?', sender: 'me' },
  { id: '3', text: 'I’m fine, thanks!', sender: 'other' },
];

export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
                backgroundColor: item.sender === 'me' ? '#007aff' : '#e5e5ea',
                borderRadius: 20,
                paddingVertical: 8,
                paddingHorizontal: 14,
                margin: 8,
                maxWidth: '75%',
              }}
            >
              <Text style={{ color: item.sender === 'me' ? '#fff' : '#000' }}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 8 }}
        />
        <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#eee' }}>
          <TextInput
            placeholder="Type a message..."
            style={{
              flex: 1,
              backgroundColor: '#f2f2f2',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#007aff',
              borderRadius: 20,
              paddingHorizontal: 16,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
