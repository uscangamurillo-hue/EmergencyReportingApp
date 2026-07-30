import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ArrowLeft,
  User,
  MapPin,
  Heart,
  Users,
  Camera,
  FileText,
  ChevronDown,
  Edit,
  Check,
  Upload,
  Shield,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { logout, profile, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);

  // Datos personales — inicializados desde el perfil guardado
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(profile?.email || '');

  const [street, setStreet] = useState(profile?.street || '');
  const [neighborhood, setNeighborhood] = useState(profile?.neighborhood || '');
  const [city, setCity] = useState(profile?.city || 'Cabada');
  const [state, setState] = useState(profile?.state || 'Nuevo León');

  const [bloodType, setBloodType] = useState(profile?.bloodType || '');
  const [allergies, setAllergies] = useState(profile?.allergies || '');
  const [medicalConditions, setMedicalConditions] = useState(profile?.medicalConditions || '');

  const contact1 = profile?.emergencyContacts?.[0];
  const contact2 = profile?.emergencyContacts?.[1];
  const [emergencyName1, setEmergencyName1] = useState(contact1?.name || '');
  const [emergencyPhone1, setEmergencyPhone1] = useState(contact1?.phone || '');
  const [emergencyRelation1, setEmergencyRelation1] = useState(contact1?.relation || 'Padre/Madre');
  const [emergencyName2, setEmergencyName2] = useState(contact2?.name || '');
  const [emergencyPhone2, setEmergencyPhone2] = useState(contact2?.phone || '');
  const [emergencyRelation2, setEmergencyRelation2] = useState(contact2?.relation || 'Amigo/Amiga');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relations = ['Padre/Madre', 'Hijo/Hija', 'Hermano/Hermana', 'Esposo/Esposa', 'Pareja', 'Amigo/Amiga', 'Otro'];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setIdFront(reader.result as string);
          toast.success('Documento frontal cargado');
        } else {
          setIdBack(reader.result as string);
          toast.success('Documento reverso cargado');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSection = (section: string) => {
    const updates: Record<string, unknown> = {};
    if (section === 'personal') {
      Object.assign(updates, { firstName, lastName, email });
    } else if (section === 'location') {
      Object.assign(updates, { street, neighborhood, city, state });
    } else if (section === 'medical') {
      Object.assign(updates, { bloodType, allergies, medicalConditions });
    } else if (section === 'contacts') {
      Object.assign(updates, {
        emergencyContacts: [
          ...(emergencyName1 ? [{ name: emergencyName1, phone: emergencyPhone1, relation: emergencyRelation1 }] : []),
          ...(emergencyName2 ? [{ name: emergencyName2, phone: emergencyPhone2, relation: emergencyRelation2 }] : []),
        ],
      });
    }
    updateProfile(updates as Parameters<typeof updateProfile>[0]);
    setEditingSection(null);
    toast.success('Cambios guardados exitosamente');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Mi Perfil
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => { logout(); navigate('/login'); }}
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="flex-1 overflow-y-auto">
        {/* Foto de perfil */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div className="relative inline-block mb-3">
            <Avatar
              src={profilePhoto || undefined}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: '#7B1068',
                fontSize: '3rem',
              }}
            >
              {!profilePhoto && ((firstName[0] ?? '') + (lastName[0] ?? '')) || '?'}
            </Avatar>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#7B1068',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#5A0B4D',
                },
              }}
            >
              <Camera className="w-5 h-5" />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2">
            {email}
          </Typography>
          <Chip
            label="Verificado"
            size="small"
            color="success"
            icon={<Check className="w-4 h-4" />}
          />
        </Paper>

        <div className="px-4 py-4 space-y-3">
          {/* Datos Personales */}
          <Accordion
            expanded={editingSection === 'personal'}
            onChange={(_, isExpanded) => setEditingSection(isExpanded ? 'personal' : null)}
            sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-[#7B1068]" />
                </div>
                <div>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Datos Personales
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    Nombre, teléfono, correo
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-3">
                <TextField
                  fullWidth
                  label="Nombre(s)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="small"
                  disabled
                  helperText="Verificado ✓"
                />
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSaveSection('personal')}
                  sx={{
                    backgroundColor: '#7B1068',
                    '&:hover': { backgroundColor: '#5A0B4D' },
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Ubicación */}
          <Accordion
            expanded={editingSection === 'location'}
            onChange={(_, isExpanded) => setEditingSection(isExpanded ? 'location' : null)}
            sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Ubicación
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {street}, {neighborhood}
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-3">
                <TextField
                  fullWidth
                  label="Calle y número"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Colonia"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  size="small"
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    fullWidth
                    label="Ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Estado"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    size="small"
                  />
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSaveSection('location')}
                  sx={{
                    backgroundColor: '#7B1068',
                    '&:hover': { backgroundColor: '#5A0B4D' },
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Información Médica */}
          <Accordion
            expanded={editingSection === 'medical'}
            onChange={(_, isExpanded) => setEditingSection(isExpanded ? 'medical' : null)}
            sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Información Médica
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    Tipo de sangre: {bloodType}
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-3">
                <TextField
                  fullWidth
                  select
                  label="Tipo de sangre"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  size="small"
                >
                  {bloodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Alergias"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Condiciones médicas"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSaveSection('medical')}
                  sx={{
                    backgroundColor: '#7B1068',
                    '&:hover': { backgroundColor: '#5A0B4D' },
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Contactos de Emergencia */}
          <Accordion
            expanded={editingSection === 'contacts'}
            onChange={(_, isExpanded) => setEditingSection(isExpanded ? 'contacts' : null)}
            sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Contactos de Emergencia
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {emergencyName1}, {emergencyName2}
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-3">
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
                  Contacto Principal
                </Typography>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={emergencyName1}
                  onChange={(e) => setEmergencyName1(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={emergencyPhone1}
                  onChange={(e) => setEmergencyPhone1(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  select
                  label="Parentesco"
                  value={emergencyRelation1}
                  onChange={(e) => setEmergencyRelation1(e.target.value)}
                  size="small"
                >
                  {relations.map((rel) => (
                    <MenuItem key={rel} value={rel}>
                      {rel}
                    </MenuItem>
                  ))}
                </TextField>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
                  Contacto Secundario
                </Typography>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={emergencyName2}
                  onChange={(e) => setEmergencyName2(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={emergencyPhone2}
                  onChange={(e) => setEmergencyPhone2(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  select
                  label="Parentesco"
                  value={emergencyRelation2}
                  onChange={(e) => setEmergencyRelation2(e.target.value)}
                  size="small"
                >
                  {relations.map((rel) => (
                    <MenuItem key={rel} value={rel}>
                      {rel}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSaveSection('contacts')}
                  sx={{
                    backgroundColor: '#7B1068',
                    '&:hover': { backgroundColor: '#5A0B4D' },
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Documentos de Identificación */}
          <Accordion
            expanded={editingSection === 'documents'}
            onChange={(_, isExpanded) => setEditingSection(isExpanded ? 'documents' : null)}
            sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Documentos de Identificación
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    INE, Licencia o Pasaporte
                  </Typography>
                </div>
                {(idFront && idBack) && (
                  <Chip
                    label="Completo"
                    size="small"
                    color="success"
                    icon={<Shield className="w-3 h-3" />}
                  />
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-4">
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption" className="text-blue-700">
                    🔒 Tus documentos están encriptados y solo se comparten con autoridades verificadas en caso de emergencia
                  </Typography>
                </Paper>

                {/* Documento Frontal */}
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                    Lado Frontal
                  </Typography>
                  {idFront ? (
                    <div className="relative">
                      <img
                        src={idFront}
                        alt="ID Frontal"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Camera className="w-4 h-4" />}
                        onClick={() => idFrontInputRef.current?.click()}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: '#7B1068',
                          '&:hover': { backgroundColor: '#5A0B4D' },
                        }}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <Paper
                      elevation={0}
                      onClick={() => idFrontInputRef.current?.click()}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '2px dashed #D1D5DB',
                        borderRadius: 2,
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          borderColor: '#7B1068',
                          backgroundColor: '#FEE2E2',
                        }
                      }}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Subir lado frontal
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        JPG, PNG (máx. 5MB)
                      </Typography>
                    </Paper>
                  )}
                  <input
                    ref={idFrontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIdUpload(e, 'front')}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Documento Reverso */}
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                    Lado Reverso
                  </Typography>
                  {idBack ? (
                    <div className="relative">
                      <img
                        src={idBack}
                        alt="ID Reverso"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Camera className="w-4 h-4" />}
                        onClick={() => idBackInputRef.current?.click()}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: '#7B1068',
                          '&:hover': { backgroundColor: '#5A0B4D' },
                        }}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <Paper
                      elevation={0}
                      onClick={() => idBackInputRef.current?.click()}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '2px dashed #D1D5DB',
                        borderRadius: 2,
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          borderColor: '#7B1068',
                          backgroundColor: '#FEE2E2',
                        }
                      }}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Subir lado reverso
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        JPG, PNG (máx. 5MB)
                      </Typography>
                    </Paper>
                  )}
                  <input
                    ref={idBackInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIdUpload(e, 'back')}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="px-4 pb-6">
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogOut className="w-4 h-4" />}
            onClick={() => { logout(); navigate('/login'); }}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
