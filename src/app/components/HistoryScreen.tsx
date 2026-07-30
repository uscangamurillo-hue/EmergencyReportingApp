import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Chip,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  ArrowLeft,
  Siren,
  Flame,
  Stethoscope,
  Car,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

import type { EmergencyReport } from '../context/AuthContext';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { history: authHistory } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const reports = authHistory;

  const getTypeInfo = (category: string) => {
    if (category.includes('Médica') || category.includes('Médic')) return { icon: Stethoscope, label: category, color: '#059669' };
    if (category.includes('Incendio') || category.includes('Fuego')) return { icon: Flame, label: category, color: '#DC2626' };
    if (category.includes('Violencia') || category.includes('Delito') || category.includes('Seguridad')) return { icon: Siren, label: category, color: '#1E40AF' };
    if (category.includes('Tránsito') || category.includes('Accidente') || category.includes('Vial')) return { icon: Car, label: category, color: '#7C3AED' };
    return { icon: Siren, label: category, color: '#7B1068' };
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle2, label: 'Completado', color: 'success' as const };
      case 'cancelled':
        return { icon: XCircle, label: 'Cancelado', color: 'default' as const };
      case 'active':
        return { icon: Clock, label: 'Activo', color: 'warning' as const };
      default:
        return { icon: Clock, label: 'Pendiente', color: 'default' as const };
    }
  };

  const filteredReports = reports.filter((report) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return report.status === 'active';
    if (tabValue === 2) return report.status === 'completed';
    if (tabValue === 3) return report.status === 'cancelled';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Historial
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            }
          }}
        >
          <Tab label="Todos" />
          <Tab label="Activos" />
          <Tab label="Completados" />
          <Tab label="Cancelados" />
        </Tabs>
      </Box>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <Typography variant="body1" className="text-gray-500">
              No hay reportes en esta categoría
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const typeInfo = getTypeInfo(report.category);
              const statusInfo = getStatusInfo(report.status);
              const TypeIcon = typeInfo.icon;
              const StatusIcon = statusInfo.icon;

              return (
                <Paper
                  key={report.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid #E5E7EB',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: typeInfo.color,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }
                  }}
                  onClick={() => report.status === 'active' && navigate('/active-emergency-updated')}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${typeInfo.color}15` }}
                    >
                      <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {typeInfo.label}
                        </Typography>
                        <Chip
                          icon={<StatusIcon className="w-3 h-3" />}
                          label={statusInfo.label}
                          size="small"
                          color={statusInfo.color}
                        />
                      </div>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {report.subcategory} · {report.id}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        📍 {report.location}
                      </Typography>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100">
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Fecha y Hora
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {report.date} • {report.time}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Tiempo de Respuesta
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {report.responseTime}
                      </Typography>
                    </div>
                    {report.unit !== '-' && (
                      <>
                        <div className="col-span-2">
                          <Typography variant="caption" className="text-gray-500 block">
                            Unidad Asignada
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {report.unit}
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>
                </Paper>
              );
            })}
          </div>
        )}
      </div>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 0,
          backgroundColor: '#EFF6FF',
          borderTop: '2px solid #DBEAFE',
        }}
      >
        <Typography variant="body2" className="text-center text-blue-700">
          📊 Has realizado <strong>{reports.length} reportes</strong> en total
        </Typography>
        <Typography variant="caption" className="text-center text-blue-600 block mt-1">
          Tiempo promedio de respuesta: <strong>3m 54s</strong>
        </Typography>
      </Paper>
    </div>
  );
}
