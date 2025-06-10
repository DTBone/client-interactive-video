import AdminDashboard from './Dashboard';
import AccountManager from './AccountMg';
import InstructorManager from './IntructorMg';
import CourseManager from './CourseMg';
import Chat from './Chat';
import ReportsAnalytics from './Reports';
import NotificationsAdmin from './Notifications';
import SettingsAdmin from './Settings';
import Payment from './Payment/payment';
import CategoryManager from './CourseMg/Category/category';
import AddAccountByExcel from './AddAccountByExcel';
// Import new sections as they are developed

const adminRoutes = [
  {
    path: '/admin/dashboard',
    element: AdminDashboard,
  },
  {
    path: '/admin/accounts',
    element: AccountManager,
  },
  {
    path: '/admin/instructors',
    element: InstructorManager,
  },
  {
    path: '/admin/courses',
    element: CourseManager,
  },
  {
    path: '/admin/chat',
    element: Chat,
  },
  {
    path: '/admin/reports',
    element: ReportsAnalytics,
  },
  {
    path: '/admin/notifications',
    element: NotificationsAdmin,
  },
  {
    path: '/admin/settings',
    element: SettingsAdmin,
  },
  {
    path: '/admin/payments',
    element: Payment,
  },
  {
    path: '/admin/courses/categories',
    element: CategoryManager,
  },
  {
    path: '/admin/accounts/add-by-excel',
    element: AddAccountByExcel,
  },
  // etc.
];

export default adminRoutes; 