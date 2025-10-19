import { useEffect, useState } from "react";
import type { Stats } from "@/types/Stats";
import { getStats } from "@/services/statsService";

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
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }

    fetchStats();
  }, []);

  return stats;
}
