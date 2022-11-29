import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

import { Box, Button } from "@mui/material";
import { NotFound } from "./NotFound";
import { Context } from "./Storage";

function Welcome() {
  const history = useNavigate();
  const [state, setState] = useContext(Context);
  const [mainData, setMainData] = useState();
  const [loaderShow, setLoaderShow] = useState(true);

  const getCookieToken = async () => {
    await axios
      .get("http://localhost:5000/api/get-cookie-token", { withCredentials: true })
      .then((res) => {
        setMainData(res.data.user);
        console.log(res.data.user);
        setLoaderShow(false);
        // Refresh page to update state
      })
      .catch((err) => {
        history("/login");
      });
  };

  useEffect(() => {
    getCookieToken();
  }, []);

  return (
    <>
      {!loaderShow ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          <h1 style={{ textAlign: "center", fontSize: "2rem", maxWidth: "450px" }}>Welcome {mainData.name} 👋</h1>
          <h1 style={{ textAlign: "center", fontSize: "1rem", maxWidth: "450px" }}>Email: {mainData.email} </h1>
          <h1 style={{ textAlign: "center", fontSize: "1rem", maxWidth: "300px", marginTop: "5rem", marginBottom: "1rem" }}>
            Console Log your User Information
          </h1>
          <Button
            variant="outlined"
            onClick={() => {
              console.log(mainData);
            }}
          >
            Console Log User
          </Button>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>{" "}
        </Box>
      )}
    </>
  );
}

export default Welcome;
