export const MuiTableCell = {
  styleOverrides: {
    root: {
      padding: "16px",
      borderBottom: "1px solid var(--mui-palette-divider)",
      fontSize: 13,
      verticalAlign: "middle",
    },

    head: {
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      color: "var(--mui-palette-text-secondary)",
      backgroundColor: "var(--mui-palette-background-default)",
      borderBottom: "1px solid var(--mui-palette-divider)",
    },

    body: {
      color: "var(--mui-palette-text-primary)",
    },
  },
};

export const MuiTableHead = {
  styleOverrides: {
    root: {
      "& .MuiTableCell-root": {
        fontWeight: 500,
      },
    },
  },
};
