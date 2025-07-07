import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PetScreen() {
  const [health, setHealth] = useState(0);
  const [level, setLevel] = useState(1);
  const [emoji, setEmoji] = useState("🐣");

  useEffect(() => {
    calculatePetStats();
  }, []);

  const getPetEmoji = (lvl) => {
    if (lvl >= 6) return "🐉";      // Legendary
    if (lvl >= 4) return "🦖";      // Grown
    if (lvl >= 2) return "🐶";      // Teen
    return "🐣";                    // Baby
  };

  const calculatePetStats = async () => {
    try {
      const stored = await AsyncStorage.getItem('goals');
      const goals = stored ? JSON.parse(stored) : [];

      const completedGoals = goals.filter((g) => g.completed).length;
      const totalGoals = goals.length;
      const healthPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      const lvl = Math.floor(completedGoals / 5) + 1;

      setHealth(healthPercent);
      setLevel(lvl);
      setEmoji(getPetEmoji(lvl));
    } catch (e) {
      console.log('Error calculating pet stats:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pet}>{emoji}</Text>
      <Text style={styles.status}>Level: {level}</Text>
      <Text style={styles.status}>Health: {Math.round(health)}%</Text>
      <Text style={{ fontStyle: 'italic' }}>Complete more goals to help your pet grow!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pet: { fontSize: 120 },
  status: { fontSize: 20, marginVertical: 5 },
});
