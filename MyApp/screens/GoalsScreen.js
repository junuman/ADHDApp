import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
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
    if (auth.currentUser) {
      loadGoals();
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      saveGoals();
    }
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

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
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
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, 'users', user.uid), {
        goals: goals,
      });
    } catch (e) {
      console.log('Firestore save error:', e);
    }
  };

  const loadGoals = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoals(data.goals || []);
      } else {
        console.log('No saved goals found.');
      }
    } catch (e) {
      console.log('Firestore load error:', e);
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

      <Button title="Pick Reminder Time" onPress={() => setShowPicker(true)} />
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

      <Button title="Add Goal" onPress={addGoal} />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <Text style={[styles.goal, item.completed && styles.completed]}>
              {item.text} ({item.type}) ⏰ {new Date(item.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.header}>📆 Summary:</Text>
        <Text>✅ Daily: {completedDaily}</Text>
        <Text>✅ Weekly: {completedWeekly}</Text>
        <Text>✅ Monthly: {completedMonthly}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 20, marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  picker: { flex: 1, height: 40 },
  goal: { padding: 10, fontSize: 16, backgroundColor: '#eee', marginTop: 5 },
  completed: { textDecorationLine: 'line-through', backgroundColor: '#d4f7d4' },
});
