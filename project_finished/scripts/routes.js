import HomePage from '../pages/home.js';
import NewPage from '../pages/new.js';

export let routes = [
  {
    path: "/",
    component: new HomePage(),
    default: true
  },
  {
    path: "/new",
    component: new NewPage()
  }
];