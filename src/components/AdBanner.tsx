import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 開発中はネイティブAdMobを外して、ダミーの広告枠だけ表示
export const AdBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ad (開発中ダミー枠)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5f0ff",
    borderRadius: 8,
    marginTop: 8,
  },
  text: {
    fontSize: 12,
    color: "#0b6ef0",
  },
});
