import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


export async function scheduleGoalReminder() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚀 Focus Check-In",
      body: "Remember to review your goals today!",
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}
