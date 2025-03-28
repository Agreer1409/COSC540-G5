import Home from './components/Home';
import Profile from './components/Profile';
import WorkoutsPage from './components/WorkoutsPage';

const routes = [
    {path:'/' , element:<Home />},        // Home.js is the main page for now 
    {path:'/profile' , element:<Profile />},  // App.js as profile for now and move to component
    {path:'/workouts' , element:<WorkoutsPage />},//workouts history and chart
    {path:'/library' , element:<div>Library Page</div>},
    {path:'/progress' , element:<div>Progress Page</div>},
    {path:'/about', element: <div> About Page </div>}, 
    {path:'/admin' , element:<div>Admin Page</div>},
];
export default routes