import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  MapPin,
  Phone,
  MessageCircle,
  Video,
  AlertCircle,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ActiveEmergency() {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    const statusTimer = setTimeout(() => {
      setStatus('assigned');
    }, 3000);

    const arrivedTimer = setTimeout(() => {
      setStatus('enroute');
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
      clearTimeout(arrivedTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { text: 'Conectando con central...', color: '#D97706', icon: AlertCircle };
      case 'assigned':
        return { text: 'Unidad asignada', color: '#1E40AF', icon: CheckCircle2 };
      case 'enroute':
        return { text: 'En camino a tu ubicación', color: '#059669', icon: Navigation };
      default:
        return { text: 'Procesando...', color: '#6B7280', icon: AlertCircle };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Emergencia Activa
          </Typography>
          <Chip
            label={formatTime(elapsedTime)}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 700,
            }}
          />
        </Toolbar>
        <LinearProgress
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'white',
            }
          }}
        />
      </AppBar>

      <div className="flex-1 overflow-y-auto">
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-32 h-32 bg-[#9C2082] rounded-full opacity-20"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MapPin className="w-12 h-12 text-[#7B1068]" strokeWidth={3} />
            </motion.div>
          </div>

          {status === 'enroute' && (
            <motion.div
              initial={{ x: -100, y: 100 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 2 }}
              className="absolute top-20 right-20 bg-blue-600 rounded-full p-3 shadow-lg"
            >
              <Navigation className="w-6 h-6 text-white" />
            </motion.div>
          )}

          <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow-md">
            <Typography variant="caption" className="text-gray-700" sx={{ fontWeight: 600 }}>
              📍 Av. Juárez #123, Centro
            </Typography>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: `${statusInfo.color}08`,
              border: `2px solid ${statusInfo.color}`,
              borderRadius: 2,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className="w-6 h-6" style={{ color: statusInfo.color }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: statusInfo.color }}>
                {statusInfo.text}
              </Typography>
            </div>
            {status === 'enroute' && (
              <Typography variant="body2" className="text-gray-600">
                Tiempo estimado de llegada: <strong>4 minutos</strong>
              </Typography>
            )}
          </Paper>

          {status !== 'pending' && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  sx={{
                    backgroundColor: '#1E40AF',
                    width: 48,
                    height: 48,
                  }}
                >
                  PC
                </Avatar>
                <div className="flex-1">
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Unidad Patrulla 042
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Oficial: Martínez García
                  </Typography>
                </div>
                <Chip label="Activo" size="small" color="success" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outlined"
                  startIcon={<Phone className="w-4 h-4" />}
                  sx={{
                    borderColor: '#059669',
                    color: '#059669',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#047857',
                      backgroundColor: '#F0FDF4',
                    }
                  }}
                >
                  Llamar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MessageCircle className="w-4 h-4" />}
                  sx={{
                    borderColor: '#1E40AF',
                    color: '#1E40AF',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#1E3A8A',
                      backgroundColor: '#EFF6FF',
                    }
                  }}
                >
                  Chat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Video className="w-4 h-4" />}
                  sx={{
                    borderColor: '#7C3AED',
                    color: '#7C3AED',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#6D28D9',
                      backgroundColor: '#F5F3FF',
                    }
                  }}
                >
                  Video
                </Button>
              </div>
            </Paper>
          )}

          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
              Detalles del Reporte
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-semibold">Seguridad Pública</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID Reporte:</span>
                <span className="font-semibold">#SOS-2026-0607-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-semibold">14:32 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prioridad:</span>
                <Chip label="ALTA" size="small" color="error" />
              </div>
            </div>
          </Paper>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <Typography variant="caption" className="text-yellow-800">
              ⚠️ Mantente en un lugar seguro. Los servicios de emergencia están en camino.
            </Typography>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => navigate('/home')}
          sx={{
            borderColor: '#7B1068',
            color: '#7B1068',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#5A0B4D',
              backgroundColor: '#FEF2F2',
            }
          }}
        >
          Cancelar Emergencia
        </Button>
      </div>
    </div>
  );
}
