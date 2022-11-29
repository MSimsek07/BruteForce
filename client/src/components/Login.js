import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Context } from "./Storage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  const history = useNavigate();
  const [state, setState] = useContext(Context);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const logoutClearToken = async () => {
    await axios.get("http://localhost:5000/api/delete-cookie-token", { withCredentials: true });
  };

  function handleChange(e) {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/api/login", { email: inputs.email, password: inputs.password })
      .then((res) => {
        if (res.data.message === "Logged in!") {
          history("/verification");
        }
      })
      .catch((err) => {
        setSubmitMessage(err.response.data.message);
        handleClick();
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    sendRequest();
  }

  useEffect(() => {
    console.log(state);
    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));

    logoutClearToken();
  }, []);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {submitMessage}
        </Alert>
      </Snackbar>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          margin: "0 2rem",
        }}
        onSubmit={handleSubmit}
      >
        <Box maxWidth="200px">
          <Typography variant="h5">Login</Typography>
          <TextField
            size="small"
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type="email"
            label="Email"
            placeholder="Email"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            fullWidth
          />
          <TextField
            size="small"
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type="password"
            label="Password"
            placeholder="Password"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            fullWidth
          />
          <Button
            sx={{
              marginTop: "14px",
            }}
            size="medium"
            variant="contained"
            type="submit"
            fullWidth
          >
            Login
          </Button>
        </Box>
    
      </form>
    </div>
  );
}

export default Login;
