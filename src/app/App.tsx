import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import SmsVerificationScreen from './components/SmsVerificationScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import EmergencyTypeSelector from './components/EmergencyTypeSelector';
import ActiveEmergency from './components/ActiveEmergency';
import ActiveEmergencyUpdated from './components/ActiveEmergencyUpdated';
import ChatScreen from './components/ChatScreen';
import EmergencyCall from './components/EmergencyCall';
import EmergencyMediaScreen from './components/EmergencyMediaScreen';
import HistoryScreen from './components/HistoryScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7B1068',
      light: '#9C2082',
      dark: '#5A0B4D',
    },
    secondary: {
      main: '#C9A535',
      light: '#DFC05A',
      dark: '#A07E20',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

function AppInner() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors />
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md h-full bg-white shadow-2xl overflow-hidden">
          <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/verify-sms" element={<SmsVerificationScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/emergency-type" element={<EmergencyTypeSelector />} />
              <Route path="/active-emergency" element={<ActiveEmergency />} />
              <Route path="/active-emergency-updated" element={<ActiveEmergencyUpdated />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/emergency-call" element={<EmergencyCall />} />
              <Route path="/emergency-media" element={<EmergencyMediaScreen />} />
              <Route path="/history" element={<HistoryScreen />} />
            </Routes>
          </AuthProvider>
          </BrowserRouter>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function App(props: Record<string, unknown>) {
  const safeProps = Object.fromEntries(
    Object.entries(props).filter(([k]) => !k.startsWith('data-fg'))
  );
  return <div {...safeProps} style={{ display: 'contents' }}><AppInner /></div>;
}
