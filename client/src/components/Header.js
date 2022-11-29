import React, { useContext, useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "./Storage";

function Header() {
  const [state, setState] = useContext(Context);

  const { appbarStyles, typographyStyles, reactLinkStyles } = {
    appbarStyles: {
      backgroundColor: "#fff",
      boxShadow: "0px 1px 10px -2px rgba(0,0,0,0.1)",
      color: "#000",
    },
    typographyStyles: {
      flexGrow: 1,
      fontWeight: "400",
    },
    reactLinkStyles: {
      textDecoration: "none",
      color: "#000",
    },
  };

  const getCookieToken = async () => {
    await axios.get("http://localhost:5000/api/get-cookie-token", { withCredentials: true }).then((res) => {
      setState((prev) => ({
        ...prev,
        isLoggedIn: true,
      }));
    });
    // .catch((err) => {});
  };

  useEffect(() => {
    getCookieToken();
  }, []);

  return (
    <AppBar position="sticky" elevation={0} sx={appbarStyles}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={typographyStyles}>
          OTP
        </Typography>
        <Box>
          {state.isLoggedIn ? (
            <Link to="/login" style={reactLinkStyles}>
              <Button>Logout</Button>
            </Link>
          ) : (
            <Box style={{ display: "flex", gap: "1rem" }}>
              <Link to="/login" style={reactLinkStyles}>
                <Button>Login</Button>
              </Link>
              <Link to="/signup" style={reactLinkStyles}>
                <Button>Signup</Button>
              </Link>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
