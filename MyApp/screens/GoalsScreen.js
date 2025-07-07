import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [type, setType] = useState('daily');
  const [goals, setGoals] = useState([]);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const addGoal = async () => {
    if (goal.trim() === '') return;

    const newGoal = {
      text: goal,
      id: Date.now().toString(),
      completed: false,
      type: type,
      reminderTime: time,
    };

    setGoals([...goals, newGoal]);
    setGoal('');

    await scheduleReminder(goal, time);
  };

  const scheduleReminder = async (text, time) => {
    const trigger = new Date(time);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📌 Reminder',
        body: text,
      },
      trigger: {
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
        repeats: true,
      },
    });
  };

  const toggleComplete = (id) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    setGoals(updated);
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(goals));
    } catch (e) {
      console.log('Error saving goals:', e);
    }
  };

  const loadGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem('goals');
      if (stored) setGoals(JSON.parse(stored));
    } catch (e) {
      console.log('Error loading goals:', e);
    }
  };

  const completedDaily = goals.filter(g => g.type === 'daily' && g.completed).length;
  const completedWeekly = goals.filter(g => g.type === 'weekly' && g.completed).length;
  const completedMonthly = goals.filter(g => g.type === 'monthly' && g.completed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Goals</Text>

      <TextInput
        placeholder="Enter a goal..."
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
      />

      <View style={styles.pickerRow}>
        <Text>Type: </Text>
        <Picker
          selectedValue={type}
          style={styles.picker}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>⏰ Pick Reminder Time</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="time"
          value={time}
          is24Hour={false}
          display="default"
          onChange={(event, selectedTime) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={addGoal}>
        <Text style={styles.buttonText}>➕ Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <Text style={[styles.goal, item.completed && styles.completed]}>
              {item.text} ({item.type}) ⏰{' '}
              {new Date(item.reminderTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.header}>📅 Summary:</Text>
        <Text style={styles.xp}>✅ Daily: {completedDaily}</Text>
        <Text style={styles.xp}>✅ Weekly: {completedWeekly}</Text>
        <Text style={styles.xp}>✅ Monthly: {completedMonthly}</Text>
        <Text style={styles.xp}>💥 XP: {completedDaily + completedWeekly + completedMonthly}</Text>
        <Text style={styles.xp}>🍬 Level: {Math.floor((completedDaily + completedWeekly + completedMonthly) / 5) + 1}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  goal: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 6,
  },
  completed: {
    textDecorationLine: 'line-through',
    backgroundColor: '#d4f7d4',
  },
  xp: {
    fontSize: 16,
    marginTop: 4,
  },
});
