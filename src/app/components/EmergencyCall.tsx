import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Paper,
} from '@mui/material';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function EmergencyCall() {
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigate('/active-emergency');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleEndCall}>
            <X className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Llamada de Emergencia
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Avatar
            sx={{
              width: 140,
              height: 140,
              backgroundColor: '#7B1068',
              fontSize: '3.5rem',
              mb: 4,
              boxShadow: '0 0 40px rgba(123, 16, 104, 0.4)',
            }}
          >
            OM
          </Avatar>
        </motion.div>

        <Typography variant="h4" className="text-white mb-2" sx={{ fontWeight: 700 }}>
          Operador Martínez
        </Typography>

        <Typography variant="body1" className="text-gray-300 mb-1">
          Central de Emergencias 911
        </Typography>

        <Paper
          elevation={0}
          sx={{
            px: 3,
            py: 1,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderRadius: 3,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            mb: 8,
          }}
        >
          <Typography variant="h5" className="text-green-400" sx={{ fontWeight: 700 }}>
            {formatTime(callDuration)}
          </Typography>
        </Paper>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <IconButton
              onClick={() => setIsSpeaker(!isSpeaker)}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: isSpeaker ? '#7B1068' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                mb: 1,
                '&:hover': {
                  backgroundColor: isSpeaker ? '#5A0B4D' : 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {isSpeaker ? (
                <Volume2 className="w-7 h-7" />
              ) : (
                <VolumeX className="w-7 h-7" />
              )}
            </IconButton>
            <Typography variant="caption" className="text-gray-400">
              {isSpeaker ? 'Altavoz' : 'Auricular'}
            </Typography>
          </div>

          <div className="text-center">
            <IconButton
              onClick={() => setIsMuted(!isMuted)}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: isMuted ? '#7B1068' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                mb: 1,
                '&:hover': {
                  backgroundColor: isMuted ? '#5A0B4D' : 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {isMuted ? (
                <MicOff className="w-7 h-7" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </IconButton>
            <Typography variant="caption" className="text-gray-400">
              {isMuted ? 'Silenciado' : 'Micrófono'}
            </Typography>
          </div>

          <div className="text-center">
            <IconButton
              onClick={handleEndCall}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: '#7B1068',
                color: 'white',
                mb: 1,
                '&:hover': {
                  backgroundColor: '#5A0B4D',
                }
              }}
            >
              <PhoneOff className="w-7 h-7" />
            </IconButton>
            <Typography variant="caption" className="text-gray-400">
              Colgar
            </Typography>
          </div>
        </div>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Typography variant="body2" className="text-blue-300 text-center">
            📞 Llamada conectada con el centro de emergencias
          </Typography>
          <Typography variant="caption" className="text-blue-400 text-center block mt-1">
            Tu ubicación se está compartiendo en tiempo real
          </Typography>
        </Paper>
      </div>

      <div className="px-8 pb-8">
        <Typography variant="caption" className="text-gray-500 text-center block">
          La llamada está siendo grabada para garantizar tu seguridad
        </Typography>
      </div>
    </div>
  );
}
