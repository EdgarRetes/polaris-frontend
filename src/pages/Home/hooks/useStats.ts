import { useEffect, useState } from "react";
import type { Stats } from "@/types/Stats";
const API_URL = import.meta.env.VITE_API_URL;

const initialStats: Stats = {
  users: 0,
  files: 0,
  filesAllTime: 0,
  changes: 0,
  notifications: "",
  rulesPerMonth: [],
  onlineUsersPerDay: [],
  ruleStatus: [],
  successDay: 0,
  successMonth: 0,
};

export default function useStats(): Stats {
  const [stats, setStats] = useState<Stats>(initialStats);

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log(API_URL);
        const res = await fetch(`${API_URL}/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data: Stats = await res.json(); // Type assertion here
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }

    fetchStats();
  }, []);

  return stats;
}
