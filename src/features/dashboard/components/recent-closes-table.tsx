import { Currency } from "@/features/settings/schema";
import { closePnl } from "@/features/trade/derive";
import { Close, Trade } from "@/features/trade/types";
import { getCurrencyFormatter } from "@/lib/format";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type Props = {
  trades: Trade[];
  closes: Close[];
  currency: string;
};

export default function RecentClosesTable({ trades, closes, currency }: Props) {
  const tradeById = new Map(trades.map((trade) => [trade.id, trade]));

  const formatter = getCurrencyFormatter(currency as Currency);

  const recentCloses = [...closes]
    .sort((a, b) => Date.parse(b.closedAt) - Date.parse(a.closedAt))
    .slice(0, 5)
    .map((close) => ({
      close,
      trade: tradeById.get(close.tradeId),
    }))
    .filter(
      (item): item is { close: Close; trade: Trade } =>
        item.trade !== undefined,
    );

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, p: 3, pb: 2 }}>
        Recent closes
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell>Pair</TableCell>
              <TableCell>Closed</TableCell>
              <TableCell align="right">P&L</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentCloses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography
                    variant="body2"
                    sx={{ py: 3, color: "text.secondary", textAlign: "center" }}
                  >
                    No closes yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              recentCloses.map(({ close, trade }) => {
                const pnl = closePnl(trade, close);

                return (
                  <TableRow key={close.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trade.pair}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(close.closedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: pnl >= 0 ? "success.main" : "error.main",
                        }}
                      >
                        {pnl > 0 ? "+" : ""}
                        {formatter.format(pnl)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
