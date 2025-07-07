import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [type, setType] = useState('daily');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const addGoal = () => {
    if (goal.trim() !== '') {
      setGoals([
        ...goals,
        {
          text: goal,
          id: Date.now().toString(),
          completed: false,
          type: type,
        },
      ]);
      setGoal('');
    }
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
      <Button title="Add Goal" onPress={addGoal} />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <Text style={[styles.goal, item.completed && styles.completed]}>
              {item.text} ({item.type})
            </Text>
          </TouchableOpacity>
        )}
      />
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

const completedDaily = goals.filter(g => g.type === 'daily' && g.completed).length;
const completedWeekly = goals.filter(g => g.type === 'weekly' && g.completed).length;
const completedMonthly = goals.filter(g => g.type === 'monthly' && g.completed).length;

<View style={{ marginTop: 20 }}>
  <Text>📆 Summary:</Text>
  <Text>✅ Daily: {completedDaily}</Text>
  <Text>✅ Weekly: {completedWeekly}</Text>
  <Text>✅ Monthly: {completedMonthly}</Text>
</View>