import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Button, Typography, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ChangePassword() {
  let { id } = useParams();

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    newPassword: "",
    confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .patch(`http://localhost:5000/api/forgot-password/${id}`, { newPassword: inputs.newPassword, confirmPassword: inputs.confirmPassword })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        setSubmitMessage(err.response.data.message);
        handleClick();
      });
  };

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {submitMessage}
        </Alert>
      </Snackbar>
      <form
        style={{
          textAlign: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Typography
          style={{
            marginTop: "10rem",
          }}
          variant="h5"
        >
          Enter a New Password
        </Typography>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: "5px",
            marginTop: "1rem",
          }}
        >
          <TextField
            size="small"
            name="newPassword"
            onChange={handleChange}
            value={inputs.newPassword}
            type="password"
            label="New Password"
            placeholder="Enter a New Password"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            size="small"
            name="confirmPassword"
            onChange={handleChange}
            value={inputs.confirmPassword}
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />

          <Button
            type="submit"
            sx={{
              marginTop: "14px",
            }}
            variant="outlined"
          >
            Change Password
          </Button>
        </Container>
      </form>
    </div>
  );
}

export default ChangePassword;
