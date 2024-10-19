import { Route, Routes } from 'react-router-dom'
import HomeSection from './Home'
import Login from '~/modules/Authentication/Login'
import HomeUser from '~/modules/User/HomeUser'
import DashboardLayout from '~/components/Layout/DashBoardLayout'
import DefaultLayout from '~/components/Layout/DefaultLayout'
import Profile from '~/modules/User/Profile'
import VerifyEmailAccount from '~/modules/Authentication/VerifyEmailAccout'
import ForgetPassword from '~/modules/Authentication/ForgetPassword'
import ErrorPage from './ErrorPage'
import EnrollToCourse from '../modules/EnrollToCourse/EnrollToCourse';
import CourseDetail from '~/modules/CourseDetail/CourseDetail'
import Grades from '~/modules/CourseDetail/MainSection/Grades'
import Messages from '~/modules/CourseDetail/MainSection/Messages'
import CourseInfo from '~/modules/CourseDetail/MainSection/CourseInfo'
import GeneralLessons from '~/modules/Lesson/GeneralLessons'
import Supplement from '~/modules/Lesson/MainSection/Supplement'
import Lecture from '~/modules/Lesson/MainSection/Lecture'
import Quiz from '~/modules/Lesson/MainSection/Quiz'
import Programming from '~/modules/Lesson/MainSection/Programming'
import CodeCompiler from '~/modules/OnlineCodeCompiler/CodeCompiler'
import Overview from '~/modules/CourseDetail/MainSection/Overview'
import InstructorSection from '~/modules/Instructor/InstructorSection'
import CourseSection from '~/modules/Instructor/Courses/CourseSection'

const HomePage = () => {
    return (
        <div>
            <Routes>
                {/* <Route path="/*" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route> */}
                <Route path="/*" element={<ErrorPage />}></Route>
                <Route path="/home" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/account" element={<HomeSection />}></Route>
                <Route path="/login" element={<Login isLoginForm={true} />}></Route>
                <Route path="/signup" element={<Login isLoginForm={false} />}></Route>
                <Route path="/homeuser" element={<DashboardLayout><HomeUser /></DashboardLayout>}></Route>
                <Route path="/profile/:id" element={<DashboardLayout><Profile /></DashboardLayout>}></Route>
                <Route path="/verify-account" element={<VerifyEmailAccount />}></Route>
                <Route path="/forgot-password" element={<ForgetPassword />}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/profile" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/account" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/login" element={<Login isLoginForm={true} />}></Route>
                <Route path="/signup" element={<Login isLoginForm={false} />}></Route>
                <Route path="/homeuser" element={<DashboardLayout><HomeUser /></DashboardLayout>}></Route>

                <Route path="/course/:courseId" element={<EnrollToCourse />}></Route>

                <Route path="/learns/:courseId/" element={<CourseDetail />}>
                    <Route path="welcome" element={<Overview />} />
                    <Route index element={<Overview />} />
                    <Route path="assignments" element={<Grades />}></Route>
                    <Route path="course-inbox" element={<Messages />}></Route>
                    <Route path="info" element={<CourseInfo />}></Route>
                </Route>

                <Route path="learns/:courseId/lessons" element={<GeneralLessons />}>
                    <Route index element={<Supplement />} />
                    <Route path="supplement/:supplementId" element={<Supplement />} />
                    <Route path="lecture/:lectureId" element={<Lecture />} />
                    <Route path="quiz/:quizId" element={<Quiz />} />
                    <Route path="programming/:programmingId" element={<Programming />} />
                </Route>

                <Route path="problems/" element={<CodeCompiler />} >
                    <Route index element={<CodeCompiler />} />
                    <Route path=":problemId" element={<CodeCompiler />} />
                </Route>

                <Route path="/editcourses" element={<InstructorSection />}>  </Route>
                <Route path="/editcourses/:courseId" element={<CourseSection />} />
                <Route path="/editcourses/new-course" element={<CourseSection />} />

            </Routes>
        </div>
    )
}

export default HomePage
