import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { MyResearch } from './pages/MyResearch';
import { CreateResearch } from './pages/CreateResearch';
import { TopicDetails } from './pages/TopicDetails';
import { Updates } from './pages/Updates';
import { SavedResearch } from './pages/SavedResearch';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="research" element={<MyResearch />} />
            <Route path="research/new" element={<CreateResearch />} />
            <Route path="research/:id" element={<TopicDetails />} />
            <Route path="updates" element={<Updates />} />
            <Route path="saved" element={<SavedResearch />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
