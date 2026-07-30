import { useNavigate } from 'react-router';
import { AppBar, Toolbar, Typography, IconButton, Box, Paper } from '@mui/material';
import { History, User, ShieldAlert, Phone, Siren, Flame, Stethoscope, AlertTriangle, PhoneCall, Cloud } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

function OperadoraIllustration() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body / uniform */}
      <ellipse cx="60" cy="88" rx="28" ry="14" fill="#5A0B4D" opacity="0.15" />
      <path d="M38 98 Q44 72 60 70 Q76 72 82 98Z" fill="#7B1068" />
      {/* Collar / lapel detail */}
      <path d="M56 70 L60 78 L64 70" fill="#C9A535" opacity="0.8" />
      {/* Neck */}
      <rect x="56" y="60" width="8" height="12" rx="4" fill="#F9C89B" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="16" ry="18" fill="#F9C89B" />
      {/* Hair */}
      <path d="M44 46 Q44 28 60 27 Q76 28 76 46 Q74 36 60 34 Q46 36 44 46Z" fill="#4A2040" />
      <path d="M44 46 Q42 54 44 58 Q43 52 45 50Z" fill="#4A2040" />
      <path d="M76 46 Q78 54 76 58 Q77 52 75 50Z" fill="#4A2040" />
      {/* Eyes */}
      <ellipse cx="53" cy="50" rx="2.5" ry="2.8" fill="white" />
      <ellipse cx="67" cy="50" rx="2.5" ry="2.8" fill="white" />
      <circle cx="53.8" cy="50.5" r="1.5" fill="#3D1A30" />
      <circle cx="67.8" cy="50.5" r="1.5" fill="#3D1A30" />
      <circle cx="54.4" cy="49.8" r="0.5" fill="white" />
      <circle cx="68.4" cy="49.8" r="0.5" fill="white" />
      {/* Eyebrows */}
      <path d="M50 46.5 Q53 45 56 46.5" stroke="#4A2040" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M64 46.5 Q67 45 70 46.5" stroke="#4A2040" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M55 55 Q60 59 65 55" stroke="#C97B7B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Headset band */}
      <path d="M44 48 Q44 30 60 30 Q76 30 76 48" stroke="#C9A535" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Ear cups */}
      <rect x="40" y="46" width="7" height="10" rx="3.5" fill="#C9A535" />
      <rect x="73" y="46" width="7" height="10" rx="3.5" fill="#C9A535" />
      {/* Mic boom */}
      <path d="M73 54 Q82 60 80 66" stroke="#C9A535" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="67" r="3" fill="#C9A535" />
      <circle cx="80" cy="67" r="1.5" fill="#7B1068" />
      {/* Shoulders / arms suggestion */}
      <path d="M38 98 Q34 82 36 74 Q40 70 44 72" stroke="#5A0B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M82 98 Q86 82 84 74 Q80 70 76 72" stroke="#5A0B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Badge on uniform */}
      <rect x="52" y="78" width="16" height="10" rx="2" fill="#C9A535" opacity="0.9" />
      <text x="60" y="86" textAnchor="middle" fontSize="5" fill="#3D1A30" fontWeight="bold">911</text>
    </svg>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { syncing, profile } = useAuth();

  const quickActions = [
    { icon: Siren, label: 'Policía', color: '#1E40AF', category: 'Violencia o Delitos' },
    { icon: Flame, label: 'Bomberos', color: '#7B1068', category: 'Incendios' },
    { icon: Stethoscope, label: 'Ambulancia', color: '#059669', category: 'Emergencias Médicas' },
    { icon: AlertTriangle, label: 'Protección Civil', color: '#D97706', category: 'Protección Civil' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <ShieldAlert className="w-6 h-6 mr-2" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CABADA CONECTA
          </Typography>
          {syncing && (
            <Cloud className="w-4 h-4 mr-1 opacity-70 animate-pulse" />
          )}
          <IconButton color="inherit" onClick={() => navigate('/history')}>
            <History className="w-6 h-6" />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <User className="w-6 h-6" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <Typography variant="h5" className="mb-2 text-center" sx={{ fontWeight: 600, color: '#374151' }}>
          ¿Necesitas ayuda?
        </Typography>
        <Typography variant="body2" className="mb-12 text-center text-gray-500">
          Mantén presionado el botón de emergencia
        </Typography>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="mb-12"
        >
          <Box
            onClick={() => navigate('/emergency-type')}
            sx={{
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7B1068 0%, #5A0B4D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 20px 60px rgba(123, 16, 104, 0.4)',
              border: '8px solid #FEE2E2',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 25px 70px rgba(123, 16, 104, 0.5)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <div className="text-center">
              <Phone className="w-20 h-20 text-white mb-2 mx-auto" />
              <Typography variant="h6" className="text-white" sx={{ fontWeight: 700 }}>
                SOS
              </Typography>
            </div>
          </Box>
        </motion.div>

        <Typography variant="body2" className="mb-4 text-gray-700" sx={{ fontWeight: 600 }}>
          Acceso rápido
        </Typography>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {quickActions.map((action, index) => (
            <Paper
              key={index}
              elevation={0}
              onClick={() => navigate('/emergency-type', { state: { preselect: action.category } })}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: action.color,
                  backgroundColor: `${action.color}08`,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <action.icon
                className="w-10 h-10 mx-auto mb-2"
                style={{ color: action.color }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                {action.label}
              </Typography>
            </Paper>
          ))}
        </div>

        {/* Operadora — full-width featured card */}
        <motion.div whileTap={{ scale: 0.98 }} className="w-full max-w-sm mt-3">
          <Paper
            elevation={0}
            onClick={() => navigate('/emergency-call')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 3,
              py: 1.5,
              cursor: 'pointer',
              border: '2px solid #C9A535',
              borderRadius: 3,
              background: 'linear-gradient(110deg, #5A0B4D 0%, #7B1068 55%, #9C2082 100%)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(123,16,104,0.35)',
              },
            }}
          >
            {/* Illustration */}
            <div className="w-20 h-16 flex-shrink-0">
              <OperadoraIllustration />
            </div>

            {/* Text */}
            <div className="flex-1">
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#F5E5A3', letterSpacing: 0.5 }}>
                Operadora
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(245,229,163,0.75)', display: 'block', lineHeight: 1.3 }}>
                Habla con una operadora municipal disponible 24/7
              </Typography>
            </div>

            {/* Call icon */}
            <div
              className="flex-shrink-0 rounded-full p-2"
              style={{ backgroundColor: '#C9A535' }}
            >
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
          </Paper>
        </motion.div>
      </div>

      <Box className="px-6 py-4 bg-blue-50 border-t border-blue-100">
        <Typography variant="caption" className="text-blue-700 text-center block">
          📍 Tu ubicación será compartida automáticamente al reportar una emergencia
        </Typography>
      </Box>
    </div>
  );
}
