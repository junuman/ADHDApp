import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scheduleGoalReminder } from '../utils/notifications';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import LottieView from 'lottie-react-native';

export default function HomeScreen({ navigation }) {
  const [petLevel, setPetLevel] = useState(1); // Replace with actual XP logic later

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
    scheduleGoalReminder();
  }, []);

  const getPetAnimation = () => {
    if (petLevel >= 6) return require('../assets/animations/dragon.json');
    if (petLevel >= 3) return require('../assets/animations/teen.json');
    return require('../assets/animations/baby.json');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={getPetAnimation()}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />

      <Text style={styles.title}>Welcome to Your Focus Pet</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Goals')}>
        <Text style={styles.buttonText}>📝 View Goals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pet')}>
        <Text style={styles.buttonText}>🐾 Check on Your Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
