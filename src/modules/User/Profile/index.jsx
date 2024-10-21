import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import userService from "~/services/api/userService";
import ErrorModal from "~/pages/ErrorModal";
import '~/index.css';
import { useNavigate } from "react-router-dom";
import background from '~/assets/backgroundDefault.jpg';
import { Button, Divider, TextField, Typography } from "@mui/material";
import SliderCourses from "~/components/SliderCourses";
import ModalEditProfile from "./ModalEditProfile";
function Profile() {
    const path = window.location.pathname;

    const id = path.split('/').pop(); // Tách và lấy phần cuối là ID
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        profile: {
            fullname: '',
        },
    });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await userService.getUserById(id, token);
                setUser(response.data);
            } catch (error) {
                if(error.status === 401) {
                    // Gọi API để lấy access token mới
                    try {
                        const response = await userService.getResetAccessToken();
                        localStorage.setItem('token', response.data.newToken);
                        // Thử gọi lại API
                        fetchUser();
                    } catch (error) {
                        setError('You must login again to continue');
                        return error
                    }
                    return;
                }
                else {
                setUser({
                    username: '',
                    email: '',
                    profile: {
                        fullname: '',
                    }
                });
                setError(error.message);
                return;
            }
            }
        };
        if (id) {
            fetchUser();
        }
    }, [dispatch, id, navigate, error, open]);

    return (
        <div className="w-full h-auto flex flex-col items-center shadow-xl rounded-3xl bg-red-100 p-5">
            <ErrorModal error={error}/>
            {open && <ModalEditProfile user={user} setOpen={setOpen}/>}
            <div className="flex justify-center items-center w-5/6 rounded-3xl overflow-hidden">
                <img src={background} className="w-full h-full"/>
            </div>
            {/* Thong tin ca nhan */}
            <div className="flex flex-row justify-center items-center gap-4 w-5/6 mt-4 shadow-xl rounded-3xl bg-white">
                <div className="flex flex-col justify-center items-center w-1/5">
                    <img src={user.profile.picture || 'https://i.pinimg.com/564x/bc/43/98/bc439871417621836a0eeea768d60944.jpg'} alt={user.username} className="size-10 object-cover rounded-full "/>
                </div>
                <div className="flex flex-col w-1/3 gap-2 pt-5 pb-5">
                    <h1 className="text-2xl font-bold">{user.profile.fullname}</h1>
                    <h5 className="text-lg font-semibold">User name: {user.username}</h5>
                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="Bio"
                        multiline
                        sx={{width: '100%'}}
                        defaultValue="Hello, I'm a developer"
                        value={user.profile.bio}
                        />
                    <Button onClick={() => setOpen(true)} variant="contained">Edit Profile</Button>    
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div className="flex flex-col w-1/3 gap-3">
                    <div className="flex flex-row gap-2 w-full justify-between">
                        <h5 className="font-semibold">Email: </h5>
                        <Typography>{user.email}</Typography>
                    </div>
                    <div className="flex flex-row gap-2 w-full justify-between">
                        <h5 className="font-semibold">Phone number: </h5>
                        <Typography>{user.profile.phone || '---'}</Typography>
                    </div>
                    <div className="flex flex-row gap-2 w-full justify-between">
                        <h5 className="font-semibold">Role: </h5>
                        <Typography>{user.role || '---'}</Typography>
                    </div>
                    <div className="flex flex-row gap-2 w-full justify-between">
                        <h5 className="font-semibold">Level: </h5>
                        <Typography>{user.level || '---'}</Typography>
                    </div>
                </div>
                        
            </div>
            <Divider className="pt-2 w-5/6 self-center" variant="middle" />
            {/* Khoa hoc */}
            <SliderCourses className="w-5/6" title="Khóa học gần đây" user={user} colunms={3}/>

        </div>
      );
}

export default Profile;