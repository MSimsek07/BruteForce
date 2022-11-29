import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmailConfirmation() {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(id);
    const verify = async () => {
      await axios
        .patch(`http://localhost:5000/api/update-verified/${id}`)
        .then((res) => {
          console.log(res);
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    };

    verify();
  }, [id]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <p>You're now verified! Please login.</p>
    </div>
  );
}

export default EmailConfirmation;
