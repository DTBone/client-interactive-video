/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './modules/Authentication/Authentication';
import { checkAuthStatus } from '~/store/slices/Auth/action'; // You'll need to create this action

import HomeSection from './pages/Home/index';
import HomeUser from '~/modules/User/HomeUser'
import DashboardLayout from '~/components/Layout/DashBoardLayout'
import DefaultLayout from '~/components/Layout/DefaultLayout'
import Profile from '~/modules/User/Profile'
import VerifyEmailAccount from '~/modules/Authentication/VerifyEmailAccout'
import ForgetPassword from '~/modules/Authentication/ForgetPassword'
import ErrorPage from '~/Pages/ErrorPage'
import EnrollToCourse from '~/modules/EnrollToCourse/EnrollToCourse';
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
import RoadMap from '~/modules/User/RoadMap'
import Overview from '~/modules/CourseDetail/MainSection/Overview'
import InstructorSection from '~/modules/Instructor/InstructorSection'
import CourseSection from '~/modules/Instructor/Courses/CourseSection'
import UnauthorizedPage from './Pages/UnauthorizedPage';
import Payment from './modules/EnrollToCourse/Payment';
import PaymentStatus from './modules/EnrollToCourse/Payment/PaymentStatus';
import DefaultLayoutV2 from '~/components/Layout/DefaultLayoutV2';
import ProtectedRoute from '~/components/ProtectedRoute';
import HomeAdmin from '~/modules/Admin/Home';
import AccountManager from './modules/Admin/AccountMg';
import CourseManager from './modules/Admin/CourseMg';
import InstructorManager from './modules/Admin/IntructorMg';
import Chat from './modules/Admin/Chat';
import VideoCall from './modules/Chat/VideoCall';
import { clearState } from './store/slices/Auth/authSlice';
import ListStudent from './modules/Instructor/Statistical/ListStudent';
import ModuleSection from './modules/Instructor/Modules/ModuleSection';
import Module from './modules/CourseDetail/MainSection/Modules/Module';

import EditModule from './modules/Instructor/Modules/MainSection/EditModule';
import EditModuleItem from './modules/Instructor/Modules/MainSection/EditModuleItem';
import NewModule from './modules/Instructor/Modules/MainSection/NewModule';
import NewModuleItem from './modules/Instructor/Modules/MainSection/NewModuleItem';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainSection from './modules/Instructor/Modules/MainSection/MainSection';
import Blogs from "~/modules/User/Blogs/index.jsx";
import HomeIntructor from './modules/Instructor/HomeIntructor';
import Editor from './testFile';
import CourseCertificate from './modules/CourseDetail/CourseCertificate ';
import DetailedStatistic from './modules/Instructor/Statistical/DetailedStatistic';

import MyLearning from './modules/User/MyLearning/MyLearning';
import SearchPage from './modules/User/SearchPage/SearchPage';
import Message from './modules/Instructor/Messages';
import ScrollToTop from './Utils/scrollToTop';
import ChatBot from './components/ChatBot/chatbot';
// import Certificate from './modules/User/Certificate/Certificate';


function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const resultAction = await dispatch(checkAuthStatus());
          if (checkAuthStatus.fulfilled.match(resultAction)) {
            console.log('Auth check success:', resultAction.payload, auth.isAuthenticated);

          }
          else {
            throw new Error('Auth check failed');
          }
        } catch (error) {
          console.log('Auth check failed:', error);
          dispatch(clearState)
          //navigate('/signin');
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/home');
  //   }
  //   if (!isAuthenticated) {
  //     navigate('/signin');
  //   }
  // }, [isAuthenticated, navigate]);


  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-account" element={<VerifyEmailAccount />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />


        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DefaultLayout>
              <HomeUser />
            </DefaultLayout>
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DefaultLayout>
              <HomeUser />
            </DefaultLayout>
          </ProtectedRoute>
        } />
        <Route path="/homeuser" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <HomeUser />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-learning" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <MyLearning />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/roadmap" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <RoadMap />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/blogs" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <Blogs />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <SearchPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Course routes */}
        <Route path="/course/:id" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <EnrollToCourse />
          </ProtectedRoute>
        } />
        <Route path="/payment/:userid" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DefaultLayoutV2>
              <Payment />
            </DefaultLayoutV2>
          </ProtectedRoute>
        }></Route>
        <Route path="/vnpay_return" element={<PaymentStatus />}></Route>
        <Route path="/learns/:courseId" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <CourseDetail />
          </ProtectedRoute>
        }>
          <Route path="welcome" element={<Overview />} />
          <Route index element={<Overview />} />
          <Route path="assignments" element={<Grades />} />
          <Route path="course-inbox" element={<Messages />} />
          <Route path="info" element={<CourseInfo />} />
          <Route path="module/:moduleId" element={<Module />}></Route>
        </Route>

        <Route path="learns/lessons" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <GeneralLessons />
          </ProtectedRoute>
        }>
          <Route index element={<Supplement />} />

          <Route path="supplement/:itemId" element={<Supplement />} />
          <Route path="lecture/:itemId" element={<Lecture />} />
          <Route path="quiz/:itemId" element={<Quiz />} />
          <Route path="programming/:itemId" element={<Programming />} />

        </Route>

        <Route path="problems/" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <CodeCompiler />
          </ProtectedRoute>
        }>
          <Route index element={<CodeCompiler />} />
          <Route path=":problemId" element={<CodeCompiler />} />
        </Route>

        {/* Instructor routes */}
        <Route path="instructor" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <HomeIntructor />
          </ProtectedRoute>
        }>
          <Route index element={<InstructorSection />} />
          <Route path="course-management" element={<InstructorSection />} />
          {/* <Route path="course-management/:courseId" element={<CourseSection state={'edit'} />} />
          <Route path="course-management/new-course" element={<CourseSection state={'new'} />} /> */}
        </Route>
        {/* <Route path="/course-management" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorSection />
          </ProtectedRoute>
        } /> */}
        <Route path="/course-management/:courseId" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseSection state={'edit'} />
          </ProtectedRoute>
        } />
        <Route path="instructor/instructor-chat" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            {/* <Message /> */}

          </ProtectedRoute>
        } ></Route>
        <Route path="/instructor/student-management" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <ListStudent />

          </ProtectedRoute>
        } >

          <Route path="course/:courseId" element={<DetailedStatistic />} />
        </Route>
        <Route path="/course-management/new-course" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseSection state={'new'} />
          </ProtectedRoute>
        } />


        <Route path="/course-management/student/:courseId" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <ListStudent />
          </ProtectedRoute>
        } />

        <Route path="/course-management/:courseId/module" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <ModuleSection />
          </ProtectedRoute>
        } >
          <Route index element={<MainSection />} />
          <Route path="new-module" element={<NewModule />} />
          <Route path=":moduleId" element={<EditModule />} />
          <Route path=":moduleId/new-module-item" element={<NewModuleItem />} />
          <Route path=":moduleId/moduleitem/:moduleItemId" element={<EditModuleItem />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <HomeAdmin />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/account-manager" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AccountManager />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/course-manager" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <CourseManager />
            </DashboardLayout>
          </ProtectedRoute>
        } > </Route>
        <Route path="/instructor-manager" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <InstructorManager />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/video-call" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <VideoCall />
          </ProtectedRoute>
        } />
        {/* <Route path="/test" element={

          // <Certificate />

        } /> */}

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/error" replace />} />
        <Route path='/test' element={<Editor />} />

        <Route path="/certificate/:courseId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseCertificate />
          </ProtectedRoute>
        } />
      </Routes>
      <ChatBot />
    </div>
  );
}

export default App;