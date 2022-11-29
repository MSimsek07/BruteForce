import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Snackbar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MuiAlert from "@mui/material/Alert";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Context } from "./Storage";
import { NotFound } from "./NotFound";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function OTP() {
  const history = useNavigate();
  const [state, setState] = useContext(Context);
  const [otp, setOtp] = useState(1);
  const [otpFetched, setOtpFetched] = useState(0);
  const [email, setEmail] = useState("");
  const [expiredOtp, setExpiredOtp] = useState(false);
  const [ctr, setCtr] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { otpInputStyle, resendButtonStyle } = {
    otpInputStyle: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    resendButtonStyle: {},
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const sendRequest = async () => {
    const res = await fetch("http://localhost:5000/api/verification", {
      method: "GET",
    });

    for (var i = 15; i > 0; --i) {
      (function (index) {
        setTimeout(function () {
          setCtr(60 - index);
        }, index * 1000);
      })(i);
    }

    const data = await res.json();
    console.log(data);
    setOtpFetched(data.code);
    setOtp(1);
    setExpiredOtp(false);
    setEmail(data.message.split(" ")[6]);

    setTimeout(() => {
      setOtpFetched(null);
      setExpiredOtp(true);
    }, 15000);
  };

  const createTokenCookie = async (req, res) => {
    await axios
      .get("http://localhost:5000/api/set-cookie-token", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        history("/user");
      });
  };

  useEffect(() => {
    if (otp === String(otpFetched)) {
      setState((prev) => ({ ...prev, isLoggedIn: true }));
      createTokenCookie();
    }

    if (otp !== String(otpFetched) && otp.length === 6) {
      handleClick();
    }
  }, [state, otp, history, otpFetched, setState]);

  useEffect(() => {
    console.log(state);

    if (state.isLoggedIn) {
      history("/user");
    } else {
      sendRequest();
    }
  }, []);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid Code!
        </Alert>
      </Snackbar>
      <div className="otp-ctn">
        <div className="otp-ctn-ctn">
          <h1
            style={{ fontWeight: "500", fontSize: "28px", color: "#11151a" }}
            className="otp-ctn-header"
          >
            OTP Verification
          </h1>
          <h3 style={{ lineHeight: "1.5" }}>
            Enter the OTP you received to{" "}
            <span style={{ fontWeight: "500", color: "#11151a" }}>{email}</span>
          </h3>
          <div className="otpinput-ctn">
            <MuiOtpInput
              value={otp}
              onChange={handleChange}
              style={otpInputStyle}
              length="6"
            />
          </div>
          {expiredOtp ? (
            <Button
              variant="outlined"
              endIcon={<SendIcon />}
              onClick={sendRequest}
              style={resendButtonStyle}
            >
              RESEND OTP
            </Button>
          ) : (
            // <p>{seconds}</p>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button
                disabled
                variant="outlined"
                endIcon={<SendIcon />}
                onClick={sendRequest}
                style={resendButtonStyle}
              >
                RESEND OTP
              </Button>
              <p>{ctr || 15}</p>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTP;
