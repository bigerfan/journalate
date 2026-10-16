import { Paper, Stack, Typography } from "@mui/material";

type SummaryCardProps = {
  label: string;
  value: string;
  description?: string;
  valueColor?: string;
};

export default function SummaryCard({
  label,
  value,
  description,
  valueColor,
}: SummaryCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: "100%", borderRadius: 2 }}>
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography
          variant="h5"
          sx={{ color: valueColor ? valueColor : "unset", fontWeight: 600 }}
        >
          {value}
        </Typography>

        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
