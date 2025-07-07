import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { scheduleGoalReminder } from '../utils/notifications';
import { auth } from '../firebase'; // ✅ Fix: use relative path
import { signInAnonymously } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    const loginAnon = async () => {
      try {
        await signInAnonymously(auth);
        console.log('Signed in anonymously');
      } catch (err) {
        console.log('Anon login failed', err);
      }
    };

    loginAnon();
    scheduleGoalReminder(); // ✅ Optional: global reminder
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Focus Pet</Text>
      <Button title="View Goals" onPress={() => navigation.navigate('Goals')} />
      <Button title="Check on Your Pet" onPress={() => navigation.navigate('Pet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
