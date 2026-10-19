"use client";

import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

// Sample data only. Not real performance.
const EQUITY = [
  100, 103, 101, 106, 104, 99, 103, 108, 112, 109, 115, 113, 121, 118, 126, 124,
  133, 130, 141, 138, 150,
];
const MARKERS = [
  { i: 5, label: "−1R", loss: true },
  { i: 12, label: "+2.4R", loss: false },
  { i: 18, label: "+3.1R", loss: false },
];

const DRAW_SECONDS = 2.8;
const START_DELAY = 0.35;

const min = Math.min(...EQUITY);
const max = Math.max(...EQUITY);
// x and y are percentages of the plot box, so markers (HTML) and the line (SVG) share coordinates.
const points = EQUITY.map((v, i) => ({
  x: (i / (EQUITY.length - 1)) * 100,
  y: 90 - ((v - min) / (max - min)) * 80,
}));
const line = points
  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
  .join(" ");
const area = `${line} L100,100 L0,100 Z`;
const last = points[points.length - 1];

// Linear on purpose: the reveal is tied to x, so marker delays can match it exactly.
const reveal = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;
const pop = keyframes`
  from { opacity: 0; transform: scale(0.4); }
  to { opacity: 1; transform: scale(1); }
`;
const ping = keyframes`
  from { opacity: 0.6; transform: scale(1); }
  to { opacity: 0; transform: scale(3.2); }
`;

const noMotion = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
};

export default function HeroCurve() {
  const endDelay = START_DELAY + DRAW_SECONDS;

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: { xs: "52%", md: "68%" },
        pointerEvents: "none",
      }}
    >
      {/* right inset leaves room for the end dot */}
      <Box sx={{ position: "absolute", inset: "0 5% 0 0" }}>
        <Box
          component="svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            color: "text.primary",
            opacity: 0.12,
          }}
        >
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            color: "success.main",
            animation: `${reveal} ${DRAW_SECONDS}s linear ${START_DELAY}s backwards`,
            ...noMotion,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <defs>
              <linearGradient id="hero-curve-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#hero-curve-fill)" />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </Box>

        {MARKERS.map(({ i, label, loss }) => {
          const p = points[i];
          const delay = START_DELAY + (p.x / 100) * DRAW_SECONDS;
          return (
            <Box
              key={i}
              sx={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Box
                sx={{
                  animation: `${pop} 0.4s ease-out ${delay}s backwards`,
                  ...noMotion,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: loss ? "error.main" : "success.main",
                    border: 2,
                    borderColor: "background.default",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    [loss ? "top" : "bottom"]: 18,
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                    color: loss ? "error.main" : "success.main",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </Box>
          );
        })}

        <Box
          sx={{
            position: "absolute",
            left: `${last.x}%`,
            top: `${last.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 12,
              height: 12,
              animation: `${pop} 0.4s ease-out ${endDelay}s backwards`,
              ...noMotion,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "success.main",
                animation: `${ping} 2.2s ease-out ${endDelay + 0.4}s infinite backwards`,
                ...noMotion,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
