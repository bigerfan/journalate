"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";

type Colors = {
  good: string;
  bad: string;
  brand: string;
  text: string;
  muted: string;
  line: string;
};

function RiskDiagram({ c }: { c: Colors }) {
  return (
    <svg
      viewBox="0 0 160 56"
      width="100%"
      role="img"
      aria-label="حد ضرر، نقطه ورود و حد سود روی نمودار قیمت"
    >
      <line x1="8" x2="152" y1="24" y2="24" stroke={c.line} strokeWidth="2" />
      <rect x="24" y="18" width="46" height="12" fill={c.bad} opacity="0.3" />
      <rect x="70" y="18" width="70" height="12" fill={c.good} opacity="0.3" />
      <circle cx="24" cy="24" r="4" fill={c.bad} />
      <circle cx="70" cy="24" r="4" fill={c.text} />
      <circle cx="140" cy="24" r="4" fill={c.good} />
      {[
        ["حد ضرر", 24],
        ["ورود", 70],
        ["حد سود", 140],
      ].map(([t, x]) => (
        <text
          key={t}
          x={x as number}
          y="46"
          textAnchor="middle"
          fontSize="10"
          fill={c.muted}
        >
          {t}
        </text>
      ))}
    </svg>
  );
}

function ScaleOutDiagram({ c }: { c: Colors }) {
  const parts = [
    { w: 70, o: 1, label: "۵۰٪" },
    { w: 42, o: 0.6, label: "۳۰٪" },
    { w: 28, o: 0.3, label: "۲۰٪" },
  ];
  let x = 8;

  return (
    <svg
      viewBox="0 0 160 56"
      width="100%"
      role="img"
      aria-label="بستن یک موقعیت معاملاتی در سه مرحله"
    >
      {parts.map((p) => {
        const cx = x;
        x += p.w + 4;

        return (
          <g key={p.label}>
            <rect
              x={cx}
              y="22"
              width={p.w}
              height="14"
              rx="3"
              fill={c.brand}
              opacity={p.o}
            />
            <text
              x={cx + p.w / 2}
              y="16"
              textAnchor="middle"
              fontSize="10"
              fill={c.muted}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RDiagram({ c }: { c: Colors }) {
  const rs = [1.8, -1, 2.4, -0.6, 3.1, -1, 1.2, 2, -0.5];
  const base = 28;
  const unit = 8;

  return (
    <svg
      viewBox="0 0 160 56"
      width="100%"
      role="img"
      aria-label="نتایج معاملات بر اساس مضرب R"
    >
      <line
        x1="4"
        x2="156"
        y1={base}
        y2={base}
        stroke={c.line}
        strokeWidth="1"
      />
      {rs.map((r, i) => (
        <rect
          key={i}
          x={8 + i * 16}
          y={r > 0 ? base - r * unit : base}
          width="10"
          height={Math.abs(r) * unit}
          rx="2"
          fill={r > 0 ? c.good : c.bad}
        />
      ))}
    </svg>
  );
}

const ITEMS = [
  {
    Diagram: RiskDiagram,
    title: "محاسبه حجم معامله بر اساس ریسک",
    text: "حد ضرر را مشخص کن و حجم مناسب معامله را به دست بیار.",
  },
  {
    Diagram: ScaleOutDiagram,
    title: "بستن پله‌ای معامله",
    text: "معامله را مرحله‌به‌مرحله ببند و سود و زیان را دقیق محاسبه کن.",
  },
  {
    Diagram: RDiagram,
    title: "اندازه‌گیری بر اساس R",
    text: "عملکرد هر معامله رو با ریسک اولیه‌اش مقایسه کن.",
  },
];

export default function FeatureStrip() {
  const t = useTheme();

  const c: Colors = {
    good: t.palette.success.main,
    bad: t.palette.error.main,
    brand: t.palette.primary.main,
    text: t.palette.text.primary,
    muted: t.palette.text.secondary,
    line: t.palette.divider,
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        }}
      >
        {ITEMS.map(({ Diagram, title, text }, i) => (
          <Box
            key={title}
            sx={{
              px: { xs: 0, md: 4 },
              py: { xs: 3, md: 1 },
              borderTop: { xs: i === 0 ? 0 : 1, md: 0 },
              borderLeft: { xs: 0, md: i === 0 ? 0 : 1 },
              borderColor: "divider",
            }}
          >
            <Box sx={{ maxWidth: 260, mb: 2.5 }}>
              <Diagram c={c} />
            </Box>

            <Typography sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, maxWidth: 280 }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
