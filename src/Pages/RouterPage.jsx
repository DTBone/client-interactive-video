import { Route, Routes } from 'react-router-dom'
import HomeSection from './Home'
import ErrorPage from './ErrorPage'
import Login from '~/modules/Authentication/Login'
import HomeUser from '~/modules/User/HomeUser'
import DashboardLayout from '~/components/Layout/DashBoardLayout'
import EnrollToCourse from '../modules/EnrollToCourse/EnrollToCourse';
import DefaultLayout from '~/Components/Layout/DefaultLayout'
import CourseDetail from '~/modules/CourseDetail/CourseDetail'
import Grades from '~/modules/CourseDetail/MainSection/Grades'
import Messages from '~/modules/CourseDetail/MainSection/Messages'
import CourseInfo from '~/modules/CourseDetail/MainSection/CourseInfo'
import Module from '~/modules/CourseDetail/MainSection/Modules/Module'

const HomePage = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/home" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/course" element={<EnrollToCourse />}></Route>
                <Route path="/profile" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/account" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/login" element={<Login isLoginForm={true} />}></Route>
                <Route path="/signup" element={<Login isLoginForm={false} />}></Route>
                <Route path="/homeuser" element={<DashboardLayout><HomeUser /></DashboardLayout>}></Route>


                <Route path="/learn/:courseID/home" element={<CourseDetail />}>
                    <Route path="welcome" element={<CourseDetail />} />
                    <Route path="assignments" element={<Grades />}></Route>
                    <Route path="course-inbox" element={<Messages />}></Route>
                    <Route path="info" element={<CourseInfo />}></Route>
                    <Route path="module/:moduleID" element={<Module />}></Route>
                </Route>

            </Routes>
        </div>
    )
}

export default HomePage
