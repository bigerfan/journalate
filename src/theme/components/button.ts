export const MuiButton = {
  styleOverrides: {
    root: {
      borderRadius: 0,
      textTransform: "uppercase",
      fontSize: 11,
      fontWeight: 400,
      letterSpacing: "0.08em",
      boxShadow: "none",
    },

    containedPrimary: {
      backgroundColor: "#F65F09",
      color: "#05080B",

      "&:hover": {
        backgroundColor: "#FF6D16",
        boxShadow: "none",
      },
    },
  },
};
