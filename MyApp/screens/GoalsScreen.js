import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState([]);

  const addGoal = () => {
    if (goal.trim() !== '') {
      setGoals([...goals, { text: goal, id: Date.now().toString() }]);
      setGoal('');
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
      <Button title="Add Goal" onPress={addGoal} />
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.goal}>{item.text}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 20, marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  goal: { padding: 10, fontSize: 16, backgroundColor: '#eee', marginTop: 5 },
});
