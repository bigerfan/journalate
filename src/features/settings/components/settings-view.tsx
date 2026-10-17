"use client";

import Link from "next/link";
import {
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { getCurrencyFormatter } from "@/lib/format";
import type { Settings } from "../schema";

export default function SettingsView({ settings }: { settings: Settings }) {
  const money = getCurrencyFormatter(settings.currency);

  const rows: [string, React.ReactNode][] = [
    ["Currency", settings.currency],
    ["Starting balance", money.format(settings.startingBalance)],
    ["Max risk per trade", `${settings.maxRiskPct}%`],
    [
      "Strategies",
      settings.strategies.length === 0 ? (
        "None"
      ) : (
        <Stack
          direction="row"
          sx={{ gap: 0.5, flexWrap: "wrap", justifyContent: "flex-end" }}
        >
          {settings.strategies.map((s) => (
            <Chip key={s} size="small" variant="outlined" label={s} />
          ))}
        </Stack>
      ),
    ],
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 750, mb: 3 }}>
        Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Trading setup
          </Typography>
          <Button
            component={Link}
            href="/onboarding"
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        </Stack>

        <Stack sx={{ gap: 1.5 }}>
          {rows.map(([label, value]) => (
            <Stack
              key={label}
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                component="div"
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "right" }}
              >
                {value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
