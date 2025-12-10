import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogStore } from "../../src/stores/useLogStore";

const LogScreen: React.FC = () => {
  const { addLog, getTodayTotal, dailyGoal } = useLogStore();
  const [amountInput, setAmountInput] = useState("");

  const todayTotal = getTodayTotal();
  const progress =
    dailyGoal > 0 ? Math.min(100, Math.round((todayTotal / dailyGoal) * 100)) : 0;

  const handleAdd = (value?: number) => {
    let amount = value;
    if (amount == null) {
      const parsed = parseInt(amountInput, 10);
      if (Number.isNaN(parsed) || parsed <= 0) return;
      amount = parsed;
    }
    addLog(amount);
    setAmountInput("");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>記録</Text>

        <View style={styles.card}>
          <Text style={styles.label}>今日の合計</Text>
          <Text style={styles.mainValue}>{todayTotal} ml</Text>
          <Text style={styles.subValue}>目標 {dailyGoal} ml（達成率 {progress}%）</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>クイック追加</Text>
          <View style={styles.buttonRow}>
            {[200, 300, 500].map((v) => (
              <TouchableOpacity
                key={v}
                style={styles.quickButton}
                onPress={() => handleAdd(v)}
              >
                <Text style={styles.quickButtonText}>+{v} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>カスタム入力</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
              placeholder="例: 250"
            />
            <TouchableOpacity style={styles.addButton} onPress={() => handleAdd()}>
              <Text style={styles.addButtonText}>追加</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>※ ml単位で入力してください。</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
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
  mainValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1b3c5c",
  },
  subValue: {
    fontSize: 13,
    color: "#6b7a8a",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    columnGap: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: "#e5f0ff",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b6ef0",
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
  addButton: {
    backgroundColor: "#0b6ef0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    color: "#8493a3",
    marginTop: 4,
  },
});

export default LogScreen;
