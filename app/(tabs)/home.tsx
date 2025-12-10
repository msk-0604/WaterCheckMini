import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogStore } from "../../src/stores/useLogStore";
import { AdBanner } from "../../src/components/AdBanner";

const formatNumber = (n: number) => Math.round(n);

const OnboardingView: React.FC = () => {
  const { dailyGoal, setDailyGoal, completeOnboarding } = useLogStore();
  const [goalInput, setGoalInput] = useState(
    dailyGoal ? String(dailyGoal) : "2000"
  );

  const handleStart = () => {
    const value = parseInt(goalInput, 10);
    if (!Number.isNaN(value) && value > 0) {
      setDailyGoal(value);
    }
    completeOnboarding();
  };

  return (
    <ScrollView contentContainerStyle={styles.onboardingContainer}>
      <Text style={styles.onboardingTitle}>ようこそ WaterCheckMini へ 💧</Text>
      <Text style={styles.onboardingText}>
        このアプリは「シンプルに水分を記録して、習慣化する」ことに特化しています。
      </Text>

      <View style={styles.onboardingBlock}>
        <Text style={styles.onboardingLabel}>1日の目標摂取量（ml）</Text>
        <TextInput
          value={goalInput}
          onChangeText={setGoalInput}
          keyboardType="numeric"
          placeholder="例: 2000"
          style={styles.onboardingInput}
        />
        <Text style={styles.onboardingHint}>
          ※あとから設定画面でも変更できます。
        </Text>
      </View>

      <TouchableOpacity style={styles.onboardingButton} onPress={handleStart}>
        <Text style={styles.onboardingButtonText}>今日から一緒に記録開始！</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const HomeScreen: React.FC = () => {
  const {
    dailyGoal,
    getTodayTotal,
    streak,
    bestStreak,
    isPro,
    hasCompletedOnboarding,
    addLog,
  } = useLogStore();

  const todayTotal = getTodayTotal();
  const progress = useMemo(() => {
    if (!dailyGoal || dailyGoal <= 0) return 0;
    const ratio = todayTotal / dailyGoal;
    const value = Math.round(ratio * 100);
    return Math.max(0, Math.min(100, value));
  }, [todayTotal, dailyGoal]);

  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <OnboardingView />
      </SafeAreaView>
    );
  }

  const addQuick = (amount: number) => {
    addLog(amount);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>今日の水分</Text>

        <View style={styles.card}>
          <Text style={styles.label}>今日の合計</Text>
          <Text style={styles.mainValue}>{formatNumber(todayTotal)} ml</Text>
          <Text style={styles.subValue}>目標 {dailyGoal} ml</Text>

          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                { width: String(progress) + "%" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}% 達成</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>連続達成日数</Text>
            <Text style={styles.smallValue}>{streak} 日</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>ベスト記録</Text>
            <Text style={styles.smallValue}>{bestStreak} 日</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>クイック追加</Text>
          <View style={styles.buttonRow}>
            {[200, 300, 500].map((v) => (
              <TouchableOpacity
                key={v}
                style={styles.quickButton}
                onPress={() => addQuick(v)}
              >
                <Text style={styles.quickButtonText}>+{v} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!isPro && (
          <View style={styles.adWrapper}>
            <AdBanner />
          </View>
        )}
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
  cardRow: {
    flexDirection: "row",
    marginBottom: 16,
    columnGap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: "#6b7a8a",
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0b6ef0",
  },
  subValue: {
    fontSize: 14,
    color: "#6b7a8a",
    marginTop: 4,
  },
  progressBarOuter: {
    marginTop: 12,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#e2ecf5",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#0b6ef0",
  },
  progressText: {
    fontSize: 13,
    color: "#6b7a8a",
    marginTop: 4,
  },
  smallLabel: {
    fontSize: 13,
    color: "#6b7a8a",
    marginBottom: 4,
  },
  smallValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b3c5c",
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
  adWrapper: {
    marginTop: 8,
  },
  onboardingContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: "#f7fbff",
    flexGrow: 1,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1b3c5c",
    marginBottom: 12,
  },
  onboardingText: {
    fontSize: 14,
    color: "#4f5f6f",
    lineHeight: 20,
    marginBottom: 16,
  },
  onboardingBlock: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  onboardingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1b3c5c",
    marginBottom: 8,
  },
  onboardingInput: {
    borderWidth: 1,
    borderColor: "#d0d9e4",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9fbff",
  },
  onboardingHint: {
    fontSize: 12,
    color: "#8493a3",
    marginTop: 4,
  },
  onboardingButton: {
    backgroundColor: "#0b6ef0",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  onboardingButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default HomeScreen;
