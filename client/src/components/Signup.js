import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Context } from "./Storage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Signup() {
  const history = useNavigate();
  const [state, setState] = useContext(Context);
  const [inputs, setInputs] = useState({
    name: "",
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

  function handleChange(e) {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendRequest();
  }

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/api/signup", { name: inputs.name, email: inputs.email, password: inputs.password })
      .then((res) => {
        console.log(res.data);

        setTimeout(() => {
          history("/login");
        }, 1000);
      })
      .catch((err) => {
        setSubmitMessage(err.response.data.message);
        handleClick();
      });
  };

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  useEffect(() => {
    console.log(state);

    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));


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
          <Typography variant="h5">Signup</Typography>

          <TextField
            size="small"
            name="name"
            onChange={handleChange}
            value={inputs.name}
            type="text"
            label="Name"
            placeholder="Name"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            fullWidth
          />
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

          <Button sx={{ marginTop: "14px" }} size="small" variant="contained" type="submit" fullWidth>
            Signup
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Signup;
