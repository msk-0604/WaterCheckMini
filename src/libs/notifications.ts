import { Alert } from "react-native";

// Expo Go では push 周りが制限されているので、
// 今はダミー実装にしておき、dev build 以降で本物に差し替える。
export async function requestNotificationPermission() {
  Alert.alert("通知について", "現バージョンでは通知は開発ビルドで対応予定です。");
  return false;
}

export async function scheduleDrinkReminder(_minutes: number) {
  Alert.alert("通知について", "現バージョンでは通知は開発ビルドで対応予定です。");
}

export async function cancelAllDrinkReminders() {
  Alert.alert("通知について", "現バージョンでは通知は開発ビルドで対応予定です。");
}
