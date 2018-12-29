// Pages
import HomeView from './pages/home';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import LoginView from './pages/login';
import toevoegenView from './pages/toevoegen';
import verwijderenView from './pages/verwijderen';
import bewerkenView from './pages/bewerken';
import favoritesView from './pages/favorites';
import bewerkenDetailView from './pages/bewerken-detail';
import kotdetailView from './pages/kotdetail';
import searchView from './pages/search';
import chatView from './pages/chat';
import chatsendView from './pages/chatsend';

export default [
  { path: '/', view: HomeView },
  { path: '/about', view: AboutView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/login', view: LoginView },
  { path: '/toevoegen', view: toevoegenView },
  { path: '/verwijderen', view: verwijderenView },
  { path: '/bewerken', view: bewerkenView },
  { path: '/bewerken-detail', view: bewerkenDetailView },
  { path: '/favorites', view: favoritesView },
  { path: '/kotdetail', view: kotdetailView },
  { path: '/search', view: searchView },
  { path: '/chat', view: chatView },
  { path: '/chatsend', view: chatsendView },
];

