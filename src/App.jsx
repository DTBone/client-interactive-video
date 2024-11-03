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

  useEffect(() => {
    console.log('Updated auth status: ', auth.user, auth.isAuthenticated);
  }, [auth.user]);

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
              <HomeSection />
            </DefaultLayout>
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DefaultLayout>
              <HomeSection />
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
        <Route path="/roadmap" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout>
              <RoadMap />
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
        <Route path="/learns/:courseId/" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <CourseDetail />
          </ProtectedRoute>
        }>
          <Route path="welcome" element={<Overview />} />
          <Route index element={<Overview />} />
          <Route path="assignments" element={<Grades />} />
          <Route path="course-inbox" element={<Messages />} />
          <Route path="info" element={<CourseInfo />} />
          <Route path="module/:moduleID" element={<Module />}></Route>
        </Route>

        <Route path="learns/:courseId/lessons" element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <GeneralLessons />
          </ProtectedRoute>
        }>
          <Route index element={<Supplement />} />
          <Route path="supplement/:supplementId" element={<Supplement />} />
          <Route path="lecture/:lectureId" element={<Lecture />} />
          <Route path="quiz/:quizId" element={<Quiz />} />
          <Route path="programming/:programmingId" element={<Programming />} />
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
        <Route path="/course-management" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorSection />
          </ProtectedRoute>
        } />
        <Route path="/course-management/:courseId" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <CourseSection state={'edit'} />
          </ProtectedRoute>
        } />
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


        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </div>
  );
}

export default App;