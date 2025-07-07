import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function PetScreen() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [emoji, setEmoji] = useState("🐣");
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    calculateStats();
  }, []);

  const getPetEmoji = (lvl) => {
    if (lvl >= 6) return "🐉";
    if (lvl >= 4) return "🦖";
    if (lvl >= 2) return "🐶";
    return "🐣";
  };

  const calculateStats = async () => {
    const user = auth.currentUser;
    const docRef = doc(db, 'users', user.uid);

    const stored = await AsyncStorage.getItem('goals');
    const goals = stored ? JSON.parse(stored) : [];
    const completed = goals.filter((g) => g.completed).length;

    const xpGained = completed * 10;
    const newLevel = Math.floor(xpGained / 100) + 1;
    const newProgress = (xpGained % 100) / 100;

    // Animate if XP has increased
    const userSnap = await getDoc(docRef);
    const previousXP = userSnap.exists() ? userSnap.data().xp : 0;
    if (xpGained > previousXP) {
      setShowAnimation(true);
      animationRef.current?.play();
      setTimeout(() => setShowAnimation(false), 2000);
    }

    // Save to Firestore
    await setDoc(docRef, { xp: xpGained, level: newLevel }, { merge: true });

    setXp(xpGained);
    setLevel(newLevel);
    setProgress(newProgress);
    setEmoji(getPetEmoji(newLevel));
  };

  return (
    <View style={styles.container}>
      {showAnimation && (
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/levelup.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
      )}

      {!showAnimation && <Text style={styles.pet}>{emoji}</Text>}

      <Text style={styles.status}>Level: {level}</Text>
      <Text style={styles.status}>XP: {xp}</Text>

      <Progress.Bar
        progress={progress}
        width={200}
        height={15}
        color="#4caf50"
        borderRadius={10}
      />

      <Text style={styles.hint}>✨ Complete goals to level up your pet!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  pet: { fontSize: 120 },
  status: { fontSize: 20, marginVertical: 5 },
  hint: { fontStyle: 'italic', marginTop: 20 },
});
