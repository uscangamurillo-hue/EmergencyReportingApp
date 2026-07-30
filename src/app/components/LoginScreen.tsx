import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, Box, Typography } from '@mui/material';
import logoImg from '../../imports/609174010_898805512680962_7500515025338287713_n.jpg';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (phone.length >= 10) {
      login(phone);
      navigate('/verify-sms', { state: { phone, isNewUser: false } });
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(160deg, #5A0B4D 0%, #7B1068 45%, #C9A535 100%)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-xl" style={{ border: '3px solid #C9A535' }}>
          <img
            src={logoImg}
            alt="Cabada Conecta"
            className="w-28 h-28 object-contain"
          />
        </div>

        <Typography
          variant="h4"
          className="text-white mb-1 text-center"
          sx={{ fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          CABADA CONECTA
        </Typography>

        <Typography
          variant="body1"
          className="text-center mb-10"
          sx={{ color: '#F5E5A3', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          Escuchar. Servir. Cumplir.
        </Typography>

        <Box className="w-full space-y-4">
          <TextField
            fullWidth
            variant="outlined"
            label="Número de teléfono"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="55 1234 5678"
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={phone.length < 10}
            sx={{
              backgroundColor: '#C9A535',
              color: '#3D0030',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#DFC05A',
              },
              '&:disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              }
            }}
          >
            Iniciar Sesión
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              borderColor: '#C9A535',
              borderWidth: 2,
              color: '#F5E5A3',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#DFC05A',
                backgroundColor: 'rgba(201,165,53,0.15)',
              }
            }}
          >
            Crear Cuenta Nueva
          </Button>
        </Box>
      </div>

      <div className="px-8 pb-8">
        <Typography
          variant="caption"
          className="text-center block"
          sx={{ color: 'rgba(245,229,163,0.7)' }}
        >
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
        </Typography>
      </div>
    </div>
  );
}
