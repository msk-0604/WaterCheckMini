import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogStore } from "../../src/stores/useLogStore";
import { startOfDay, subDays, format } from "date-fns";

const AnalyticsScreen: React.FC = () => {
  const { getWeeklyStats } = useLogStore();
  const { thisWeekAvg, lastWeekAvg, diff, diffRate } = getWeeklyStats();

  const today = startOfDay(new Date());

  const thisWeekLabel =
    format(subDays(today, 6), "M/d") + " ~ " + format(today, "M/d");
  const lastWeekEnd = subDays(today, 7);
  const lastWeekStart = subDays(today, 13);
  const lastWeekLabel =
    format(lastWeekStart, "M/d") + " ~ " + format(lastWeekEnd, "M/d");

  const diffRatePercent = Math.round(diffRate * 100);
  let diffMessage = "先週とほぼ同じ水準です";
  if (diffRate > 0) diffMessage = "先週より増えています 👍";
  if (diffRate < 0) diffMessage = "先週より減っています 👀";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>週間レポート</Text>

        <View style={styles.card}>
          <Text style={styles.label}>今週の平均摂取量</Text>
          <Text style={styles.mainValue}>{Math.round(thisWeekAvg)} ml / 日</Text>
          <Text style={styles.subValue}>{thisWeekLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>先週の平均摂取量</Text>
          <Text style={styles.mainValue}>{Math.round(lastWeekAvg)} ml / 日</Text>
          <Text style={styles.subValue}>{lastWeekLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>変化量</Text>
          <Text style={styles.mainValue}>
            {diff >= 0 ? "+" : ""}
            {Math.round(diff)} ml / 日
          </Text>
          <Text
            style={[
              styles.subValue,
              diffRate > 0 ? styles.positive : diffRate < 0 ? styles.negative : null,
            ]}
          >
            {diffMessage}
            {diffRate !== 0 && "（約 " + diffRatePercent + "%）"}
          </Text>
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>使い方のヒント</Text>
          <Text style={styles.hintText}>
            ・「今週平均」が「目標 / 日」に近づくほど、良い習慣になっています。
            {"\n"}
            ・しばらく続けると、streak（日々の連続達成）も伸びていきます。
          </Text>
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
  mainValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1b3c5c",
  },
  subValue: {
    fontSize: 13,
    color: "#6b7a8a",
    marginTop: 4,
  },
  positive: {
    color: "#0b8a3c",
  },
  negative: {
    color: "#d2383f",
  },
  hintCard: {
    backgroundColor: "#e7f1ff",
    borderRadius: 16,
    padding: 16,
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1b3c5c",
    marginBottom: 4,
  },
  hintText: {
    fontSize: 13,
    color: "#4f5f6f",
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
