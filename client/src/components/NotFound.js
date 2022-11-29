import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export function NotFound() {
  const { divStyle, headerStyle, secondaryHeaderStyle, paragraphStyle, reactLinkStyle } = {
    divStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "5rem",
      flexDirection: "column",
    },
    headerStyle: {
      fontSize: "10rem",
      fontWeight: "bold",
    },
    secondaryHeaderStyle: {
      textAlign: "center",
    },
    paragraphStyle: {
      maxWidth: "200px",
      textAlign: "center",
      marginTop: "1rem",
      lineHeight: "1.5",
      marginBottom: "2rem",
    },
    reactLinkStyle: { textDecoration: "none" },
  };

  return (
    <div style={divStyle} className="notfound-main">
      <h1 style={headerStyle}>404</h1>
      <h2 style={secondaryHeaderStyle}>Page not found</h2>
      <p style={paragraphStyle}>Sorry, we couldn't find the page you were looking for.</p>
      <Link style={reactLinkStyle} to="/login">
        <Button variant="outlined">Go To Login</Button>
      </Link>
    </div>
  );
}
