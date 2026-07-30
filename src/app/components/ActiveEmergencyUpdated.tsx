import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  MapPin,
  Phone,
  MessageCircle,
  Video,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Camera,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ActiveEmergencyUpdated() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addReport } = useAuth();
  const reportSaved = useRef(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('pending');
  const [unitDistance, setUnitDistance] = useState(2.5);
  const [eta, setEta] = useState(4);
  const [unreadMessages, setUnreadMessages] = useState(2);

  useEffect(() => {
    if (!reportSaved.current) {
      reportSaved.current = true;
      const state = (location.state as { category?: string; subcategory?: string }) ?? {};
      const now = new Date();
      addReport({
        category: state.category ?? 'Emergencia',
        subcategory: state.subcategory ?? 'General',
        status: 'active',
        date: now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        location: 'Av. Juárez #123, Centro, Cabada',
        responseTime: '-',
        unit: 'Asignando...',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Simular actualización de distancia en tiempo real
  useEffect(() => {
    if (status === 'enroute') {
      const distanceTimer = setInterval(() => {
        setUnitDistance((prev) => {
          const newDistance = prev - 0.1;
          return newDistance > 0 ? newDistance : 0;
        });
        setEta((prev) => {
          const newEta = prev - 0.1;
          return newEta > 0 ? Math.ceil(newEta) : 0;
        });
      }, 2000);

      return () => clearInterval(distanceTimer);
    }
  }, [status]);

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
        {/* Mapa de seguimiento en tiempo real */}
        <div className="relative h-72 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
          {/* Marcador de usuario */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-40 h-40 bg-[#9C2082] rounded-full opacity-20"
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MapPin className="w-14 h-14 text-[#7B1068] drop-shadow-lg" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Marcador de unidad de emergencia */}
          {status === 'enroute' && (
            <motion.div
              initial={{ x: -120, y: 120, scale: 0.8 }}
              animate={{ x: -20, y: 20, scale: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute top-16 right-16 bg-blue-600 rounded-full p-3 shadow-xl border-4 border-white"
            >
              <Navigation className="w-7 h-7 text-white" fill="white" />
            </motion.div>
          )}

          {/* Línea de ruta simulada */}
          {status === 'enroute' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d="M 80 240 Q 150 180, 280 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="10,5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          )}

          {/* Información de ubicación */}
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
            <Typography variant="caption" className="text-gray-700 block" sx={{ fontWeight: 600 }}>
              📍 Tu ubicación
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Av. Juárez #123, Centro
            </Typography>
          </div>

          {/* ETA y distancia */}
          {status === 'enroute' && (
            <div className="absolute top-4 left-4 bg-green-600 px-4 py-2 rounded-lg shadow-lg">
              <Typography variant="body2" className="text-white" sx={{ fontWeight: 700 }}>
                ⏱️ {eta} min - {unitDistance.toFixed(1)} km
              </Typography>
            </div>
          )}

          {/* Botón de centrar mapa */}
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'white',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: '#F9FAFB',
              }
            }}
          >
            <MapPin className="w-5 h-5 text-[#7B1068]" />
          </IconButton>
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Estado de la emergencia */}
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
                La unidad se encuentra a <strong>{unitDistance.toFixed(1)} km</strong> de tu ubicación
              </Typography>
            )}
          </Paper>

          {/* Información de la unidad asignada */}
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

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/emergency-call')}
                  sx={{
                    borderColor: '#059669',
                    color: '#059669',
                    minWidth: 0,
                    px: 1,
                    flexDirection: 'column',
                    gap: 0.5,
                    '&:hover': {
                      borderColor: '#047857',
                      backgroundColor: '#F0FDF4',
                    }
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <Typography variant="caption">Llamar</Typography>
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate('/chat')}
                  sx={{
                    borderColor: '#1E40AF',
                    color: '#1E40AF',
                    minWidth: 0,
                    px: 1,
                    flexDirection: 'column',
                    gap: 0.5,
                    position: 'relative',
                    '&:hover': {
                      borderColor: '#1E3A8A',
                      backgroundColor: '#EFF6FF',
                    }
                  }}
                >
                  <Badge badgeContent={unreadMessages} color="error">
                    <MessageCircle className="w-5 h-5" />
                  </Badge>
                  <Typography variant="caption">Chat</Typography>
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#7C3AED',
                    color: '#7C3AED',
                    minWidth: 0,
                    px: 1,
                    flexDirection: 'column',
                    gap: 0.5,
                    '&:hover': {
                      borderColor: '#6D28D9',
                      backgroundColor: '#F5F3FF',
                    }
                  }}
                >
                  <Video className="w-5 h-5" />
                  <Typography variant="caption">Video</Typography>
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate('/emergency-media')}
                  sx={{
                    borderColor: '#7B1068',
                    color: '#7B1068',
                    minWidth: 0,
                    px: 1,
                    flexDirection: 'column',
                    gap: 0.5,
                    '&:hover': {
                      borderColor: '#5A0B4D',
                      backgroundColor: '#FEF2F2',
                    }
                  }}
                >
                  <Camera className="w-5 h-5" />
                  <Typography variant="caption">Media</Typography>
                </Button>
              </div>
            </Paper>
          )}

          {/* Detalles del reporte */}
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

          {/* Contactos de emergencia notificados */}
          <Paper elevation={0} sx={{ p: 3, backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 2 }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E40AF' }}>
                Contactos de emergencia notificados
              </Typography>
            </div>
            <Typography variant="caption" className="text-blue-700">
              María Rodríguez y Pedro García han sido notificados automáticamente
            </Typography>
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
