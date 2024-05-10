import CreateTicket  from "./components/CreateTicket";
import { FetchData } from "./components/FetchData";
import  Dashboard  from "./components/Dashboard";  // using the Dashboard component after converting to functional component
import  Login from "./components/Login"; 
import  ViewTicket  from "./components/ViewTicket"; // Importing ViewTicket component
import AssignedTickets from "./components/AssignedTickets";
import AllTickets from "./components/AllTickets"; // Importing UnassignedTickets component

const AppRoutes = [
    // Define the routes for the login page
    {
    index: true,
    element: <Login />
    },
   // Define the routes for the dashboard page
   {
    path: '/dashboard',
    element: <Dashboard />
    },
    // Define the routes for the assigned  tickets
    {
        path: '/assignedticket',
        element: <AssignedTickets />
    },
    //  Define the routes for the unassigned tickets
    {
        path: '/allticket',
        element: <AllTickets />
    },
    // Define the routes for the create ticket page
    {
    path: '/createticket',
    element: <CreateTicket />
    },
    // Define the routes for the fetch data page
    {
    path: '/fetch-data',
    element: <FetchData />
    },
    {
    path: '/viewticket/:ticketId',   // Define a route parameter for the ticket ID
    element: <ViewTicket />
    }
];

export default AppRoutes;
