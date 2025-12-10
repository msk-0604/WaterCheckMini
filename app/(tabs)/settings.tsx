import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogStore } from "../../src/stores/useLogStore";

const SettingsScreen: React.FC = () => {
  const { dailyGoal, setDailyGoal, isPro, setIsPro } = useLogStore();
  const [goalInput, setGoalInput] = useState(String(dailyGoal));

  const handleSaveGoal = () => {
    const value = parseInt(goalInput, 10);
    if (Number.isNaN(value) || value <= 0) {
      Alert.alert("エラー", "正しい数値を入力してください");
      return;
    }
    setDailyGoal(value);
    Alert.alert("保存しました", "1日の目標摂取量を更新しました");
  };

  const handleProPress = () => {
    Alert.alert(
      "Pro版について",
      "今はデバッグ用にスイッチでON/OFFできます。\n本番では「広告削除Pro版」の購入画面に遷移させます。"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>設定</Text>

        <View style={styles.card}>
          <Text style={styles.label}>1日の目標摂取量（ml）</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={goalInput}
              keyboardType="numeric"
              onChangeText={setGoalInput}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subValue}>現在の目標: {dailyGoal} ml</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>広告削除 Pro版（準備）</Text>
          <Text style={styles.description}>
            将来的にはサブスクリプションで「広告なし / 高度なAnalytics」などを提供します。
          </Text>

          <TouchableOpacity style={styles.proButton} onPress={handleProPress}>
            <Text style={styles.proButtonText}>Pro版の詳細を見る（仮）</Text>
          </TouchableOpacity>

          <View style={styles.proSwitchRow}>
            <Text style={styles.subValue}>デバッグ用 Proフラグ</Text>
            <Switch value={isPro} onValueChange={setIsPro} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fbff",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1b3c5c",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#6b7a8a",
    marginBottom: 4,
  },
  subValue: {
    fontSize: 13,
    color: "#6b7a8a",
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: "#4f5f6f",
    lineHeight: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    columnGap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d9e4",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9fbff",
  },
  saveButton: {
    backgroundColor: "#0b6ef0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  proButton: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#0b6ef0",
    paddingVertical: 10,
    alignItems: "center",
  },
  proButtonText: {
    color: "#0b6ef0",
    fontSize: 14,
    fontWeight: "600",
  },
  proSwitchRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SettingsScreen;
