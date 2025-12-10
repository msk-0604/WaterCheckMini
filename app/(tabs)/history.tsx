import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogStore, LogEntry } from "../../src/stores/useLogStore";
import { format } from "date-fns";

const HistoryScreen: React.FC = () => {
  const { logs } = useLogStore();

  const sortedLogs: LogEntry[] = [...logs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>履歴</Text>

        {sortedLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              まだ記録がありません。{"\n"}Home や 記録タブから水分を追加してみましょう。
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedLogs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const date = new Date(item.timestamp);
              const dateLabel = format(date, "M/d (EEE)");
              const timeLabel = format(date, "HH:mm");
              return (
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.dateText}>{dateLabel}</Text>
                    <Text style={styles.timeText}>{timeLabel}</Text>
                  </View>
                  <Text style={styles.amountText}>{item.amount} ml</Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fbff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1b3c5c",
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  rowLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#1b3c5c",
    fontWeight: "600",
  },
  timeText: {
    fontSize: 12,
    color: "#6b7a8a",
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b6ef0",
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7a8a",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HistoryScreen;
