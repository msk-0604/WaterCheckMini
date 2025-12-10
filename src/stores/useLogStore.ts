import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startOfDay, subDays, isSameDay } from "date-fns";
import { persist, createJSONStorage } from "zustand/middleware";

export type LogEntry = {
  id: string;
  amount: number;
  timestamp: string;
};

type Store = {
  logs: LogEntry[];
  dailyGoal: number;
  streak: number;
  bestStreak: number;
  lastAchievedDate?: string;
  isPro: boolean;
  hasCompletedOnboarding: boolean;

  addLog: (amount: number) => void;
  getTodayTotal: () => number;
  getWeeklyStats: () => {
    thisWeekAvg: number;
    lastWeekAvg: number;
    diff: number;
    diffRate: number;
  };
  setDailyGoal: (v: number) => void;
  setIsPro: (v: boolean) => void;
  completeOnboarding: () => void;
};

export const useLogStore = create<Store>()(
  persist(
    (set, get) => ({
      logs: [],
      dailyGoal: 2000,
      streak: 0,
      bestStreak: 0,
      lastAchievedDate: undefined,
      isPro: false,
      hasCompletedOnboarding: false,

      addLog: (amount: number) => {
        const now = new Date();
        const newLog: LogEntry = {
          id: String(now.getTime()),
          amount,
          timestamp: now.toISOString(),
        };

        set((state) => ({ logs: [...state.logs, newLog] }));

        const todayTotal = get().getTodayTotal() + amount;
        const {
          dailyGoal,
          streak,
          bestStreak,
          lastAchievedDate,
        } = get();

        if (todayTotal >= dailyGoal) {
          const todayStr = startOfDay(now).toISOString();
          const isSame =
            lastAchievedDate && isSameDay(new Date(lastAchievedDate), now);

          const newStreak = isSame ? streak : streak + 1;
          const newBest = Math.max(bestStreak, newStreak);

          set({
            streak: newStreak,
            bestStreak: newBest,
            lastAchievedDate: todayStr,
          });
        }
      },

      getTodayTotal: () => {
        const logs = get().logs;
        const today = startOfDay(new Date());
        return logs
          .filter((l) => isSameDay(new Date(l.timestamp), today))
          .reduce((sum, l) => sum + l.amount, 0);
      },

      getWeeklyStats: () => {
        const logs = get().logs;
        const today = startOfDay(new Date());

        const getRangeAvg = (start: number, end: number) => {
          const rangeDays: number[] = [];
          for (let i = start; i <= end; i++) {
            const day = startOfDay(subDays(today, i));
            const total = logs
              .filter((l) => isSameDay(new Date(l.timestamp), day))
              .reduce((sum, l) => sum + l.amount, 0);
            rangeDays.push(total);
          }
          if (rangeDays.length === 0) return 0;
          return rangeDays.reduce((a, b) => a + b, 0) / rangeDays.length;
        };

        const thisWeekAvg = getRangeAvg(0, 6);
        const lastWeekAvg = getRangeAvg(7, 13);
        const diff = thisWeekAvg - lastWeekAvg;
        const diffRate = lastWeekAvg === 0 ? (thisWeekAvg > 0 ? 1 : 0) : diff / lastWeekAvg;

        return { thisWeekAvg, lastWeekAvg, diff, diffRate };
      },

      setDailyGoal: (v: number) => set({ dailyGoal: v }),
      setIsPro: (v: boolean) => set({ isPro: v }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "water-check-mini-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        logs: state.logs,
        dailyGoal: state.dailyGoal,
        streak: state.streak,
        bestStreak: state.bestStreak,
        lastAchievedDate: state.lastAchievedDate,
        isPro: state.isPro,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
