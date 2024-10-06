import { Route, Routes } from 'react-router-dom'



import HomeSection from './Home'
// import ErrorPage from './ErrorPage'
// import EnrollToCourse from '~/Components/MainSection/EnrollToCourse'

import Login from '~/modules/Authentication/Login'
import HomeUser from '~/modules/User/HomeUser'
import DashboardLayout from '~/components/Layout/DashBoardLayout'
import DefaultLayout from '~/components/Layout/DefaultLayout'
import Profile from '~/modules/User/Profile'
import VerifyEmailAccount from '~/modules/Authentication/VerifyEmailAccout'
import ForgetPassword from '~/modules/Authentication/ForgetPassword'

const HomePage = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/home" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                {/* <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/specializations" element={<EnrollToCourse />}></Route> */}
                <Route path="/account" element={<HomeSection />}></Route>
                <Route path="/login" element={<Login isLoginForm={true}/>}></Route>
                <Route path="/signup" element={<Login isLoginForm={false}/>}></Route>
                <Route path="/homeuser" element={<DashboardLayout><HomeUser /></DashboardLayout>}></Route>
                <Route path="/profile/:id" element={<DashboardLayout><Profile /></DashboardLayout>}></Route>
                <Route path="/verify-account" element={<VerifyEmailAccount/>}></Route>
                <Route path="/forgot-password" element={<ForgetPassword/>}></Route>
            </Routes>
        </div>
    )
}

export default HomePage
