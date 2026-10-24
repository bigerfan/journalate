"use client";

import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                size="small"
                aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                onClick={() => setVisible((v) => !v)}
                // keeps focus in the input when the button is pressed with a mouse
                onMouseDown={(e) => e.preventDefault()}
              >
                {visible ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
        // Passwords are typed left-to-right even in a Persian UI.
        htmlInput: { dir: "ltr" },
      }}
    />
  );
}
