import { Stats } from "@/features/trade/stats";
import { Divider, Paper, Stack, Typography } from "@mui/material";

type Props = {
  stats: Stats;
};

export default function PerformanceSummary({ stats }: Props) {
  const winRate =
    stats.winRate === null ? "—" : `${(stats.winRate * 100).toFixed(1)}%`;

  const avgR =
    stats.avgR === null
      ? "—"
      : `${stats.avgR >= 0 ? "+" : ""}${stats.avgR.toFixed(2)}R`;

  const losses = stats.closedTrades - stats.wins;

  const rows = [
    { label: "معاملات بسته‌شده", value: String(stats.closedTrades) },
    { label: "معاملات سودده", value: String(stats.wins) },
    { label: "معاملات زیان‌ده", value: String(losses) },
    { label: "درصد معاملات موفق", value: winRate },
    { label: "میانگین R", value: avgR },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        خلاصه عملکرد
      </Typography>

      <Stack divider={<Divider flexItem />} spacing={1.5}>
        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              spacing: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {row.label}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
