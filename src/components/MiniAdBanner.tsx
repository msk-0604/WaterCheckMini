import React from "react";
import { View, Text } from "react-native";

/**
 * Expo Go では AdMob のネイティブモジュールが不安定なので、
 * 本番用 dev build まではダミー表示にしておく。
 * デザインの位置だけ確保しておき、EAS Build 時に本物に差し替える想定。
 */
export function MiniAdBanner() {
  return (
    <View style={{ alignItems: "center", marginTop: 8 }}>
      <Text style={{ fontSize: 10, color: "#999" }}>
        広告（本番ビルドで表示予定）
      </Text>
    </View>
  );
}
