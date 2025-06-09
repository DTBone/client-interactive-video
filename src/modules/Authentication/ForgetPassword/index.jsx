import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import ErrorModal from "~/Pages/ErrorModal";
import ModalForm from "./ModalForm";
import axiosInstance from "~/services/api/axiosInstance";
import { useRef } from "react";
import '~/index.css';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitBtn = useRef(null);
    const checkEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        submitBtn.current.disabled = true;
        submitBtn.current.style.backgroundColor = "gray";
        if (!checkEmail(email)) {
            setError('Invalid Email ' + Date.now().toString().slice(-4));
            submitBtn.current.disabled = false;
            submitBtn.current.style.backgroundColor = "white";
            setEmail('');
            return;
        }
        if(!loading) setLoading(true);
        try {
            const response = await axiosInstance.post('/forgot-password', {
                email
            });
            if (response.data.status === "success") {
                setIsSubmitting(true);
                setLoading(false);
            }   
        }
        catch (error) {
            console.log(error);
            setError(error.response.data.error + ' ' + Date.now().toString().slice(-4));
            setLoading(false);
        }
        
  };
  return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-col justify-center items-center p-5 w-3/5 self-center">
                <ErrorModal error={error}/>
                {isSubmitting && <ModalForm />}
            <h2 className="font-bold text-3xl text-blue-500 uppercase">
                Forget Password
            </h2>
            <h3 className="font-bold text-xl text-blue-700">
                Please enter your email
            </h3>
            <form
                onSubmit={handleSubmit}
                className="w-4/5 h-auto p-5 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg"
            >
                <TextField
                required
                autoComplete="off"
                variant="filled"
                label="Enter Email"
                type="text"
                value={email}
                placeholder="johnjoe@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
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
                ref = {submitBtn}
                sx={{ backgroundColor: "white", color: "black" }}
                >
                Submit
                {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                    color: "success",
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                    }}
                />
                )}
                </Button>
            </form>
            </div>
        </div>
    );
}
export default ForgetPassword;
