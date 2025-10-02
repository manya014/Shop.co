import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import { AuthProvider } from './Context/AuthProvider';
export default function App(){
  return (
     <div className="font-sans">
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage/>} />
          </Routes>
      </AuthProvider>
    </div>
  );
}
