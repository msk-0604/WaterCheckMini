# ================================
# 🚀 WaterCheckMini one shot finish script
# - store/ 説明文 & プライポリ生成
# - Home / Log / History UI テンプレ反映（バックアップ付き）
# - git commit & push
# ================================

Write-Host "=== WaterCheckMini one shot start ==="

# このスクリプトが置かれているディレクトリ＝アプリルート
$AppPath = $PSScriptRoot
Set-Location $AppPath
Write-Host "Current Directory: $(Get-Location)"

# 0. SafeArea 用ライブラリ（念のため）
Write-Host "=== npm install react-native-safe-area-context ==="
npm install react-native-safe-area-context | Out-Host

# 1. store/ フォルダ & 説明文・プライポリのたたき台作成
Write-Host "=== store/ 以下の md を生成 ==="

$storeDir = Join-Path $AppPath "store"
if (-Not (Test-Path $storeDir)) {
    New-Item -ItemType Directory -Path $storeDir | Out-Null
}

# 日本語説明文
$jaDescPath = Join-Path $storeDir "description-ja.md"
$jaContent = @"
# WaterCheckMini（ウォーター・チェック・ミニ）

WaterCheckMini は「1タップで飲水を記録できる、超シンプルなウォーター・トラッカーアプリ」です。

## 主な機能
- 1タップで飲水ログを追加
- 日別・週別の飲水量グラフ
- 連続達成日数（ストリーク）の表示
- 1日の目標摂取量の設定
- シンプルで見やすい黒ベースのUI

## こんな人におすすめ
- 毎日の水分摂取量を管理したい人
- ダイエットやボディメイク中で、水分量を意識したい人
- 健康管理の一環として、手軽に飲水ログを残したい人
"@
Set-Content -Encoding UTF8 -Path $jaDescPath -Value $jaContent

# 英語説明文
$enDescPath = Join-Path $storeDir "description-en.md"
$enContent = @"
# WaterCheckMini

WaterCheckMini is a super simple water tracker app that lets you log your water intake with just one tap.

## Features
- One-tap water logging
- Daily and weekly intake charts
- Streak counter for consecutive achievement days
- Daily water intake goal
- Clean, dark-themed UI

## Recommended for
- People who want to manage their daily water intake
- Users who care about hydration for diet or fitness
- Anyone who wants an easy way to keep a record of their drinking habit
"@
Set-Content -Encoding UTF8 -Path $enDescPath -Value $enContent

# プライバシーポリシー簡易版
$ppPath = Join-Path $storeDir "privacy-policy.md"
$ppContent = @"
# WaterCheckMini プライバシーポリシー（簡易版）

WaterCheckMini（以下、本アプリ）は、ユーザーのプライバシーを尊重し、以下の方針に基づいて個人情報を取り扱います。

## 1. 収集する情報
本アプリでは、ユーザーが入力した飲水ログなどのデータを、ユーザー端末内のストレージに保存します。
開発者は個人を特定できる情報を外部サーバーに送信しません。

## 2. 広告について
本アプリでは、収益化のために第三者配信の広告サービス（Google AdMob 等）を利用する場合があります。
広告配信事業者は、ユーザーの興味・関心に応じた広告を表示するために、広告ID等の情報を利用することがあります。
詳細は各広告サービス提供会社のプライバシーポリシーをご確認ください。

## 3. アナリティクスについて
アプリの品質向上のために、匿名の利用状況データを収集する分析ツールを利用する場合がありますが、
個人を特定できる情報は収集しません。

## 4. お問い合わせ
本アプリのプライバシーポリシーに関するお問い合わせは、ストアの開発者連絡先よりご連絡ください。
"@
Set-Content -Encoding UTF8 -Path $ppPath -Value $ppContent

Write-Host "store/ ファイル生成完了"

# 2. 画面レイアウトテンプレ（Home / Log / History）上書き
Write-Host "=== UI レイアウトテンプレを反映（Home / Log / History）==="

$homeScreenPath    = Join-Path $AppPath "src\screens\HomeScreen.tsx"
$logScreenPath     = Join-Path $AppPath "src\screens\LogScreen.tsx"
$historyScreenPath = Join-Path $AppPath "src\screens\HistoryScreen.tsx"

function Backup-And-WriteFile {
    param(
        [string] $Path,
        [string] $Content
    )

    if (Test-Path $Path) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = "$Path.bak_$timestamp"
        Copy-Item $Path $backupPath
        Write-Host "Backup created: $backupPath"
        Set-Content -Encoding UTF8 -Path $Path -Value $Content
        Write-Host "Updated: $Path"
    }
    else {
        Write-Host "Skip (not found): $Path"
    }
}

# HomeScreen
$homeScreenContent = @"
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "../components/AdBanner";

export default function HomeScreen() {
  // TODO: 実データに差し替え
  const total = 1200;
  const goal = 2000;
  const streak = 5;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>今日の飲水量</Text>

          <View style={styles.card}>
            <Text style={styles.label}>合計</Text>
            <Text style={styles.value}>
              {total} ml / {goal} ml
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>時間帯ごとの推移</Text>
            {/* TODO: グラフコンポーネント */}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>連続達成日数</Text>
            <Text style={styles.value}>{streak} 日</Text>
          </View>
        </ScrollView>

        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#111",
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  adContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
"@
Backup-And-WriteFile -Path $homeScreenPath -Content $homeScreenContent

# LogScreen
$logScreenContent = @"
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "../components/AdBanner";

export default function LogScreen() {
  // TODO: 実際は入力ロジックと連携
  const presets = [200, 250, 300, 500];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>飲水を記録</Text>

          <View style={styles.card}>
            <Text style={styles.label}>ワンタップで追加</Text>
            <View style={styles.presetRow}>
              {presets.map((ml) => (
                <TouchableOpacity key={ml} style={styles.presetButton}>
                  <Text style={styles.presetText}>{ml} ml</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* TODO: カスタム入力フォームなど */}
        </ScrollView>

        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#111",
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#222",
  },
  presetText: {
    fontSize: 16,
    color: "#fff",
  },
  adContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
"@
Backup-And-WriteFile -Path $logScreenPath -Content $logScreenContent

# HistoryScreen
$historyScreenContent = @"
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MiniAdBanner } from "../components/MiniAdBanner";

type HistoryItem = {
  id: string;
  date: string;
  total: number;
};

const dummyHistory: HistoryItem[] = [
  { id: "1", date: "2025-12-08", total: 2100 },
  { id: "2", date: "2025-12-07", total: 1800 },
  { id: "3", date: "2025-12-06", total: 2000 },
];

export default function HistoryScreen() {
  // TODO: 実データに差し替え
  const data = dummyHistory;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.total}>{item.total} ml</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <View style={styles.adContainer}>
          <MiniAdBanner />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  date: {
    fontSize: 14,
    color: "#ccc",
  },
  total: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  separator: {
    height: 8,
  },
  adContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
"@
Backup-And-WriteFile -Path $historyScreenPath -Content $historyScreenContent

# 3. git commit & push
Write-Host "=== git commit & push ==="

git status | Out-Host
git add . | Out-Host

$commitMessage = "UI layout polish, store docs, and ad layout (one shot)"
git commit -m $commitMessage | Out-Host
git push origin main | Out-Host

Write-Host "=== WaterCheckMini one shot 完了 ==="
