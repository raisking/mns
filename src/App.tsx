import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Objectives from './pages/Objectives';
import Leadership from './pages/Leadership';
import President from './pages/Leadership/President';
import PastPresidents from './pages/Leadership/PastPresidents';
import School from './pages/School';
import SchoolAbout from './pages/School/About';
import SchoolTeam from './pages/School/Team';
import Events from './pages/Events';
import EventDetail from './pages/Events/EventDetail';
import Gallery from './pages/Gallery';
import AlbumDetail from './pages/Gallery/AlbumDetail';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import DonationSuccess from './pages/DonationSuccess';
import DonationCancelled from './pages/DonationCancelled';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="objectives" element={<Objectives />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="leadership/president" element={<President />} />
          <Route path="leadership/past-presidents" element={<PastPresidents />} />
          <Route path="nepali-school" element={<School />} />
          <Route path="nepali-school/about" element={<SchoolAbout />} />
          <Route path="nepali-school/team" element={<SchoolTeam />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:slug" element={<AlbumDetail />} />
          <Route path="donate" element={<Donate />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donation-success" element={<DonationSuccess />} />
          <Route path="donation-cancelled" element={<DonationCancelled />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
