export const MuiButton = {
  styleOverrides: {
    root: {
      borderRadius: "8px",
      textTransform: "uppercase",
      fontSize: 13,
      fontWeight: 400,
      letterSpacing: "0.08em",
      boxShadow: "none",
      minHeight: 36,
      padding: "8px 16px",

      "&:hover": {
        boxShadow: "none",
      },

      "&:focus-visible": {
        outline: "2px solid currentColor",
        outlineOffset: 2,
      },

      "&.Mui-disabled": {
        opacity: 0.5,
      },
    },

    contained: {
      boxShadow: "none",

      "&:hover": {
        boxShadow: "none",
      },
    },

    containedPrimary: {
      backgroundColor: "#F65F09",
      color: "#05080B",

      "&:hover": {
        backgroundColor: "#FF6D16",
        boxShadow: "none",
      },
    },

    outlined: {
      borderWidth: 1,

      "&:hover": {
        borderWidth: 1,
        boxShadow: "none",
      },
    },

    text: {
      "&:hover": {
        boxShadow: "none",
      },
    },

    sizeSmall: {
      minHeight: 30,
      padding: "5px 10px",
    },

    sizeLarge: {
      minHeight: 42,
      padding: "10px 20px",
    },
  },
};
