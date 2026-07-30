import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Paper,
} from '@mui/material';
import { ArrowLeft, Send } from 'lucide-react';
import MediaCapture from './MediaCapture';
import { toast } from 'sonner';

export default function EmergencyMediaScreen() {
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);

  const handleSendEvidence = () => {
    if (mediaFiles.length > 0) {
      toast.success(`${mediaFiles.length} evidencia(s) enviada(s) al operador`);
      navigate('/active-emergency-updated');
    } else {
      toast.error('Agrega al menos una evidencia');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/active-emergency-updated')}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Enviar Evidencia
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" className="text-yellow-800">
            📸 Captura fotos, videos o graba audio de la situación para ayudar a los operadores a evaluar mejor la emergencia
          </Typography>
        </Paper>

        <MediaCapture onMediaCaptured={setMediaFiles} />

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" className="text-blue-700">
            🔒 Tu privacidad es importante. Las evidencias solo serán vistas por personal autorizado y se eliminarán después de resolverse el caso.
          </Typography>
        </Paper>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSendEvidence}
          startIcon={<Send className="w-5 h-5" />}
          sx={{
            backgroundColor: '#7B1068',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#5A0B4D',
            }
          }}
        >
          Enviar Evidencia al Operador
        </Button>
      </div>
    </div>
  );
}
