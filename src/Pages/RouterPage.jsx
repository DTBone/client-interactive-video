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
import GeneralLessons from '~/modules/Lesson/GeneralLessons'
import Supplement from '~/modules/Lesson/MainSection/Supplement'
import Lecture from '~/modules/Lesson/MainSection/Lecture'
import Quiz from '~/modules/Lesson/MainSection/Quiz'
import Programming from '~/modules/Lesson/MainSection/Programming'
import CodeCompiler from '~/modules/OnlineCodeCompiler/CodeCompiler'

const HomePage = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/home" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/profile" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/account" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/login" element={<Login isLoginForm={true} />}></Route>
                <Route path="/signup" element={<Login isLoginForm={false} />}></Route>
                <Route path="/homeuser" element={<DashboardLayout><HomeUser /></DashboardLayout>}></Route>

                <Route path="/course" element={<EnrollToCourse />}></Route>

                <Route path="/learn/:courseID/home" element={<CourseDetail />}>
                    <Route path="welcome" element={<CourseDetail />} />
                    <Route path="assignments" element={<Grades />}></Route>
                    <Route path="course-inbox" element={<Messages />}></Route>
                    <Route path="info" element={<CourseInfo />}></Route>
                    <Route path="module/:moduleID" element={<Module />}></Route>
                </Route>

                <Route path="learn/:courseID/lessons" element={<GeneralLessons />}>
                    <Route path="supplement/:supplementID" element={<Supplement />} />
                    <Route path="lecture/:lectureID" element={<Lecture />} />
                    <Route path="quiz/:quizID" element={<Quiz />} />
                    <Route path="programming/:programmingID" element={<Programming />} />
                </Route>

                <Route path="compiler/problems/:problemsID" element={<CodeCompiler />} />

            </Routes>
        </div>
    )
}

export default HomePage
