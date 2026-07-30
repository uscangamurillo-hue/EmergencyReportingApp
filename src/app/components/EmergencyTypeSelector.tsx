import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  Collapse,
} from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import MediaCapture from './MediaCapture';

interface Category {
  id: string;
  emoji: string;
  label: string;
  color: string;
  subcategories: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 'medical',
    emoji: '🚑',
    label: 'Emergencias Médicas',
    color: '#059669',
    subcategories: [
      'Infartos',
      'Convulsiones',
      'Caídas',
      'Accidentes domésticos',
      'Problemas respiratorios',
      'Personas inconscientes',
    ],
  },
  {
    id: 'crime',
    emoji: '🚓',
    label: 'Violencia o Delitos',
    color: '#1E40AF',
    subcategories: [
      'Robo',
      'Asalto',
      'Violencia familiar',
      'Personas sospechosas',
      'Alteración del orden público',
      'Amenazas',
    ],
  },
  {
    id: 'trash',
    emoji: '🗑️',
    label: 'Limpia Pública',
    color: '#6B7280',
    subcategories: [
      'Recolección no realizada',
      'Basurero clandestino',
      'Contenedor dañado',
      'Acumulación de basura',
    ],
  },
  {
    id: 'parks',
    emoji: '🌳',
    label: 'Parques y Jardines',
    color: '#16A34A',
    subcategories: [
      'Árbol caído',
      'Poda requerida',
      'Áreas verdes abandonadas',
      'Juegos infantiles dañados',
      'Falta de mantenimiento',
    ],
  },
  {
    id: 'lighting',
    emoji: '💡',
    label: 'Alumbrado Público',
    color: '#CA8A04',
    subcategories: [
      'Lámpara apagada',
      'Poste dañado',
      'Cableado expuesto',
      'Lámpara fundida',
    ],
  },
  {
    id: 'obras',
    emoji: '🚧',
    label: 'Obras Públicas',
    color: '#EA580C',
    subcategories: [
      'Baches',
      'Calles dañadas',
      'Banquetas rotas',
      'Alcantarillas abiertas',
    ],
  },
  {
    id: 'water',
    emoji: '🚰',
    label: 'Agua y Drenaje',
    color: '#0284C7',
    subcategories: [
      'Fugas de agua',
      'Drenaje colapsado',
      'Alcantarilla tapada',
    ],
  },
  {
    id: 'animals',
    emoji: '🐕',
    label: 'Bienestar Animal',
    color: '#92400E',
    subcategories: [
      'Maltrato animal',
      'Animal lesionado',
      'Animal agresivo',
    ],
  },
  {
    id: 'transit',
    emoji: '🚦',
    label: 'Tránsito y Vialidad',
    color: '#7C3AED',
    subcategories: [
      'Choques vehiculares',
      'Atropellamientos',
      'Vehículos volcados',
      'Personas atrapadas',
      'Derrames de combustible',
      'Señalización dañada',
      'Semáforo fuera de servicio',
      'Vehículos abandonados',
    ],
  },
  {
    id: 'civil',
    emoji: '🌊',
    label: 'Protección Civil',
    color: '#0E7490',
    subcategories: [
      'Inundaciones',
      'Riesgo estructural',
      'Deslaves',
      'Árboles en riesgo',
      'Huracanes',
      'Sismos',
      'Derrumbes',
    ],
  },
  {
    id: 'fire',
    emoji: '🔥',
    label: 'Incendios',
    color: '#DC2626',
    subcategories: [
      'Incendios en casa habitación',
      'Incendios en comercios',
      'Incendios de vehículos',
      'Incendios forestales',
      'Fugas de gas',
    ],
  },
  {
    id: 'communications',
    emoji: '📢',
    label: 'Comunicación Ciudadana',
    color: '#7B1068',
    subcategories: [
      'Noticias del Ayuntamiento',
      'Avisos importantes',
      'Alertas meteorológicas',
      'Eventos municipales',
      'Notificaciones push',
    ],
  },
  {
    id: 'directory',
    emoji: '📍',
    label: 'Directorio Municipal',
    color: '#5A0B4D',
    subcategories: [
      'Presidencia Municipal',
      'DIF',
      'Protección Civil',
      'Seguridad Pública',
      'Obras Públicas',
      'Limpia Pública',
      'Agua Potable',
      'Desarrollo Social',
    ],
  },
];

export default function EmergencyTypeSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [expandedId, setExpandedId] = useState<string | null>(() => {
    const preselect = (location.state as { preselect?: string })?.preselect;
    if (!preselect) return null;
    return CATEGORIES.find((c) => c.label === preselect)?.id ?? null;
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);

  // Scroll to pre-selected category on mount
  useEffect(() => {
    if (!expandedId) return;
    const el = cardRefs.current[expandedId];
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }, []);

  const handleCategoryPress = (cat: Category) => {
    if (expandedId === cat.id) {
      setExpandedId(null);
    } else {
      setExpandedId(cat.id);
    }
  };

  const handleSubSelect = (cat: Category, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSub(sub);
    setExpandedId(null);
  };

  const handleSubmit = () => {
    if (selectedCategory && selectedSub) {
      navigate('/active-emergency-updated', {
        state: { category: selectedCategory.label, subcategory: selectedSub },
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Tipo de Reporte
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        {/* Selected summary banner */}
        {selectedCategory && selectedSub && (
          <div
            className="mx-4 mt-4 p-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: `${selectedCategory.color}15`, border: `1.5px solid ${selectedCategory.color}40` }}
          >
            <span className="text-2xl">{selectedCategory.emoji}</span>
            <div className="flex-1 min-w-0">
              <Typography variant="caption" sx={{ color: selectedCategory.color, fontWeight: 700, display: 'block' }}>
                {selectedCategory.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }} noWrap>
                {selectedSub}
              </Typography>
            </div>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSub(null); }}
              className="text-xs px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200"
            >
              Cambiar
            </button>
          </div>
        )}

        <div className="px-4 pt-4 pb-2">
          <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
            {selectedCategory ? 'Detalla tu reporte:' : 'Selecciona una categoría:'}
          </Typography>
        </div>

        {/* Category accordion list */}
        {!selectedSub && (
          <div className="px-4 space-y-2 pb-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => { cardRefs.current[cat.id] = el; }}
                className="bg-white rounded-xl overflow-hidden"
                style={{ border: expandedId === cat.id ? `1.5px solid ${cat.color}` : '1px solid #E5E7EB' }}
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => handleCategoryPress(cat)}
                >
                  <span className="text-2xl w-8 text-center">{cat.emoji}</span>
                  <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 600, color: '#1F2937' }}>
                    {cat.label}
                  </Typography>
                  <span style={{ color: cat.color }}>
                    {expandedId === cat.id
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />
                    }
                  </span>
                </button>

                <Collapse in={expandedId === cat.id}>
                  <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => handleSubSelect(cat, sub)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                        style={{
                          backgroundColor: `${cat.color}12`,
                          color: cat.color,
                          border: `1px solid ${cat.color}40`,
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </Collapse>
              </div>
            ))}
          </div>
        )}

        {/* Detail form after subcategory selected */}
        {selectedSub && (
          <div className="px-4 space-y-4 pb-6">
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Describe la situación (opcional)"
              placeholder="Proporciona más detalles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 2 }}
            />

            <MediaCapture onMediaCaptured={setMediaFiles} />

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Typography variant="caption" className="text-blue-700">
                📍 <strong>Ubicación detectada:</strong><br />
                Av. Juárez #123, Centro, Cabada, Nuevo León
              </Typography>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Chip label="Ubicación compartida" size="small" color="success" />
              <Chip label="Audio de fondo: activado" size="small" />
              {mediaFiles.length > 0 && (
                <Chip
                  label={`${mediaFiles.length} evidencia(s) adjunta(s)`}
                  size="small"
                  color="primary"
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!selectedSub}
          sx={{
            backgroundColor: '#7B1068',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#5A0B4D' },
            '&:disabled': { backgroundColor: '#E5E7EB', color: '#9CA3AF' },
          }}
        >
          Enviar Reporte
        </Button>
      </div>
    </div>
  );
}
