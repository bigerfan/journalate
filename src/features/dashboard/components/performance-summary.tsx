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
    { label: "Closed trades", value: String(stats.closedTrades) },
    { label: "Winning trades", value: String(stats.wins) },
    { label: "Losing trades", value: String(losses) },
    { label: "Win rate", value: winRate },
    { label: "Average R", value: avgR },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Performance summary
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
