import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PetScreen() {
  const [health, setHealth] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    calculatePetStats();
  }, []);

  const calculatePetStats = async () => {
    try {
      const stored = await AsyncStorage.getItem('goals');
      const goals = stored ? JSON.parse(stored) : [];

      const completedGoals = goals.filter((g) => g.completed).length;
      const totalGoals = goals.length;
      const healthPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      setHealth(healthPercent);
      setLevel(Math.floor(completedGoals / 5) + 1); // 5 completed goals = level up
    } catch (e) {
      console.log('Error calculating pet health:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pet}>🐾</Text>
      <Text style={styles.text}>Level: {level}</Text>
      <Text style={styles.text}>Health: {Math.round(health)}%</Text>
      <Text style={{ fontStyle: 'italic' }}>
        Keep finishing goals to help your pet grow!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pet: { fontSize: 100 },
  text: { fontSize: 20, marginVertical: 5 },
});
