import Home from './components/Home';
import Profile from './components/Profile';
import WorkoutsPage from './components/WorkoutsPage';
import AdminPage from './components/AdminPage';
import AboutPage from './components/AboutPage';


const routes = [
    {path:'/' , element:<Home />},        // Home.js is the main page for now 
    {path:'/profile' , element:<Profile />},  // App.js as profile for now and move to component
    {path:'/workouts' , element:<WorkoutsPage />},//workouts history and chart
    {path:'/library' , element:<div>Library Page</div>},
    {path:'/progress' , element:<div>Progress Page</div>},
    {path:'/about', element: <AboutPage />}, // for About
    {path:'/admin' , element:<AdminPage />}, // for Admin 
];
export default routes;