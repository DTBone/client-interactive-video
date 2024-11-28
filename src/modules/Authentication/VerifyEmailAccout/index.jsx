import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorModal from "~/pages/ErrorModal";
import axiosInstance from "~/services/api/axiosInstance";
import '~/index.css';

function VerifyEmailAccount() {
    const location = useLocation();
  const email = location.state.email || 'email';
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axiosInstance.post('verify-account', {
            email,
            code: token
        });
        if (response.status === 200) {
            alert('Email verified successfully');
            window.location.href = '/signin';
        }   
    }
    catch (error) {
        console.log(error);
        setError(error.response.data.error);
    }
  };
  return (
    <div className="flex flex-col justify-center">
    <div className="flex flex-col justify-center items-center p-5 w-3/5 self-center">
        <ErrorModal error={error}/>
      <h2 className="font-bold text-3xl text-blue-500 uppercase">
        Verify Email Account
      </h2>
      <h3 className="font-bold text-xl text-blue-700">
         Please enter the token sent to {email}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-4/5 h-auto p-5 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg"
      >
        <TextField
          required
          id="filled-required"
          variant="filled"
          label="Enter Token"
          type="text"
          placeholder="999999"
          onChange={(e) => setToken(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: "5px",
          }}
          color="primary"
        />

        <Button
          type="submit"
          className="w-full"
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: "white", color: "black" }}
        >
          Verify Email
        </Button>
      </form>
    </div>
    </div>
  );
}
export default VerifyEmailAccount;
