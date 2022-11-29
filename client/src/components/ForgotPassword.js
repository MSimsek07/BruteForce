import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, TextField, Typography, Snackbar } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForgotPassword() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs.email);
    await axios
      .post("http://localhost:5000/api/forgot-password/send-email", { email: inputs.email })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        setSubmitMessage(err.response.data.message);
        handleClick();
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        margin: "0 2rem",
      }}
    >
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {submitMessage}
        </Alert>
      </Snackbar>

      <QuestionMarkIcon
        sx={{
          fontSize: "10rem",
          color: "#1976d2",
          marginBottom: "1rem",
        }}
      />
      <Typography variant="h5">Find Your Account</Typography>
      <Typography sx={{ maxWidth: "350px", margin: "1rem 0" }} variant="h7">
        Please enter your email to search for your account.
      </Typography>
      <TextField
        sx={{
          maxWidth: "300px",
        }}
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
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "1rem",
        }}
      >
        <Button
          sx={{
            marginTop: "14px",
            padding: "10px",
          }}
          size="medium"
          variant="outlined"
          type="button"
          onClick={() => {
            navigate("/login");
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            marginTop: "14px",
            padding: "10px",
          }}
          size="medium"
          variant="contained"
          type="submit"
        >
          Search
        </Button>
      </Container>
    </form>
  );
}

export default ForgotPassword;
