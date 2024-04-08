import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Dashboard } from "./components/Dashboard";

const AppRoutes = [
  //{
  //  index: true,
  //  element: <Dashboard />
  // },
   {
    path: '/dashboard',
    element: <Dashboard />
   },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  }
];

export default AppRoutes;
