import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.pet}>🐶</Text>
      <Text style={styles.status}>Your pet is happy!</Text>
      <Text>Complete more goals to help it grow!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pet: { fontSize: 100 },
  status: { fontSize: 20, marginTop: 10, marginBottom: 10 },
});
