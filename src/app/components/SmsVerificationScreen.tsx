import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button, Box, Typography, AppBar, Toolbar, IconButton, Paper } from '@mui/material';
import { ArrowLeft, ShieldAlert, Smartphone } from 'lucide-react';
import { OTPInput } from 'input-otp';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function SmsVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithProfile } = useAuth();
  const phoneNumber = location.state?.phone || '55 1234 5678';
  const isNewUser = location.state?.isNewUser || false;
  const registrationProfile = location.state?.profile ?? null;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length === 6) {
      if (otp === '123456') {
        if (isNewUser && registrationProfile) {
          loginWithProfile(registrationProfile);
          toast.success('¡Registro completado! Bienvenido a CABADA CONECTA');
        } else {
          login(phoneNumber);
        }
        navigate('/home');
      } else {
        setError('Código incorrecto. Intenta nuevamente.');
        setOtp('');
      }
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCountdown(60);
      setCanResend(false);
      setError('');
      setOtp('');
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <ShieldAlert className="w-6 h-6 mr-2" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Verificación
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="bg-purple-100 rounded-full p-6 mb-8">
          <Smartphone className="w-16 h-16 text-[#7B1068]" />
        </div>

        <Typography variant="h5" className="mb-2 text-center" sx={{ fontWeight: 700 }}>
          Verifica tu número
        </Typography>

        <Typography variant="body1" className="text-gray-600 text-center mb-2">
          Ingresa el código de 6 dígitos enviado a
        </Typography>

        <Typography variant="body1" className="text-gray-900 text-center mb-8" sx={{ fontWeight: 700 }}>
          {phoneNumber}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            border: error ? '2px solid #7B1068' : '1px solid #E5E7EB',
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          <OTPInput
            value={otp}
            onChange={setOtp}
            maxLength={6}
            render={({ slots }) => (
              <div className="flex gap-2 justify-center">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-14 flex items-center justify-center border-2 rounded-lg text-2xl font-bold transition-all"
                    style={{
                      borderColor: slot.isActive ? '#7B1068' : '#E5E7EB',
                      backgroundColor: slot.char ? '#FEE2E2' : 'white',
                      color: '#1F2937',
                    }}
                  >
                    {slot.char}
                  </div>
                ))}
              </div>
            )}
          />
        </Paper>

        {error && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: 2,
              width: '100%',
            }}
          >
            <Typography variant="body2" className="text-[#5A0B4D] text-center">
              {error}
            </Typography>
          </Paper>
        )}

        <Typography variant="body2" className="text-gray-600 text-center mb-3">
          {canResend ? (
            <span
              onClick={handleResend}
              className="text-[#7B1068] font-semibold cursor-pointer hover:underline"
            >
              Reenviar código
            </span>
          ) : (
            <>
              Reenviar código en{' '}
              <span className="font-semibold text-[#7B1068]">{countdown}s</span>
            </>
          )}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Typography variant="caption" className="text-blue-700 text-center block">
            💡 Para pruebas, usa el código: <strong>123456</strong>
          </Typography>
        </Paper>
      </div>

      <div className="px-8 pb-8">
        <Typography variant="caption" className="text-gray-500 text-center block">
          ¿No recibiste el código? Verifica tu número o intenta reenviar
        </Typography>
      </div>
    </div>
  );
}
