import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import userService from "~/services/api/userService";
import ErrorModal from "~/pages/ErrorModal";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await userService.getUserById(id, token);
                setUser(response.data);
            } catch (error) {
                if(error.status === 401) {
                    // Gọi API để lấy access token mới
                    try {
                        const response = await userService.getResetAccessToken();
                        localStorage.setItem('userToken', response.data.newToken);
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
    }, [dispatch, id, navigate]);

    return (
        <div>
            <ErrorModal error={error}/>
            <h1>Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Fullname: {user.profile.fullname}</p>
        </div>
      );
}

export default Profile;