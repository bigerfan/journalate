"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";

// Add { label: "Privacy", href: "/privacy" } and { label: "Terms", href: "/terms" }
// once those pages exist. A link to a missing page is a 404 in the footer of every page.
const LINKS: { label: string; href: string }[] = [];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ borderTop: 1, borderColor: "divider", py: 3 }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Journalate
          </Typography>

          {LINKS.length > 0 && (
            <Stack direction="row" sx={{ gap: 2 }}>
              {LINKS.map((l) => (
                <MuiLink
                  key={l.href}
                  component={Link}
                  href={l.href}
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                >
                  {l.label}
                </MuiLink>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
