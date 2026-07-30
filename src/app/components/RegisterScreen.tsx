import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TextField,
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ArrowLeft, ShieldAlert, User, MapPin, Heart, Users } from 'lucide-react';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Datos personales
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Ubicación
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Cabada');
  const [state, setState] = useState('Nuevo León');

  // Información médica
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  // Contactos de emergencia
  const [emergencyName1, setEmergencyName1] = useState('');
  const [emergencyPhone1, setEmergencyPhone1] = useState('');
  const [emergencyRelation1, setEmergencyRelation1] = useState('');
  const [emergencyName2, setEmergencyName2] = useState('');
  const [emergencyPhone2, setEmergencyPhone2] = useState('');
  const [emergencyRelation2, setEmergencyRelation2] = useState('');

  const [acceptTerms, setAcceptTerms] = useState(false);

  const steps = ['Datos Personales', 'Ubicación', 'Info. Médica', 'Contactos'];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relations = ['Padre/Madre', 'Hijo/Hija', 'Hermano/Hermana', 'Esposo/Esposa', 'Pareja', 'Amigo/Amiga', 'Otro'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      navigate('/verify-sms', {
        state: {
          phone,
          isNewUser: true,
          profile: {
            phone,
            firstName,
            lastName,
            email,
            street,
            neighborhood,
            city,
            state,
            bloodType,
            allergies,
            medicalConditions,
            emergencyContacts: [
              ...(emergencyName1 ? [{ name: emergencyName1, phone: emergencyPhone1, relation: emergencyRelation1 }] : []),
              ...(emergencyName2 ? [{ name: emergencyName2, phone: emergencyPhone2, relation: emergencyRelation2 }] : []),
            ],
          },
        },
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/login');
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return firstName && lastName && phone.length >= 10 && email;
      case 1:
        return street && neighborhood && city && state;
      case 2:
        return bloodType;
      case 3:
        return emergencyName1 && emergencyPhone1.length >= 10 && emergencyRelation1 && acceptTerms;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="w-8 h-8 text-[#7B1068]" />
              </div>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Datos Personales
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Información básica para tu cuenta
                </Typography>
              </div>
            </div>

            <TextField
              fullWidth
              label="Nombre(s)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Número de teléfono"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="55 1234 5678"
              required
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </Box>
        );

      case 1:
        return (
          <Box className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Ubicación
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Tu dirección de residencia
                </Typography>
              </div>
            </div>

            <TextField
              fullWidth
              label="Calle y número"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Av. Juárez #123"
              required
            />
            <TextField
              fullWidth
              label="Colonia"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                fullWidth
                label="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

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
                💡 Esta dirección se usará como ubicación predeterminada en tus reportes
              </Typography>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Información Médica
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Datos importantes para emergencias
                </Typography>
              </div>
            </div>

            <TextField
              fullWidth
              select
              label="Tipo de sangre"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              required
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
              placeholder="Ej: Penicilina, mariscos, polen..."
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="Condiciones médicas"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="Ej: Diabetes, hipertensión, asma..."
              multiline
              rows={2}
            />

            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" className="text-yellow-800">
                ⚕️ Esta información será compartida con paramédicos en caso de emergencia médica
              </Typography>
            </Paper>
          </Box>
        );

      case 3:
        return (
          <Box className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Contactos de Emergencia
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Personas a notificar en caso de emergencia
                </Typography>
              </div>
            </div>

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
              Contacto Principal
            </Typography>
            <TextField
              fullWidth
              label="Nombre completo"
              value={emergencyName1}
              onChange={(e) => setEmergencyName1(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Teléfono"
              type="tel"
              value={emergencyPhone1}
              onChange={(e) => setEmergencyPhone1(e.target.value)}
              required
            />
            <TextField
              fullWidth
              select
              label="Parentesco"
              value={emergencyRelation1}
              onChange={(e) => setEmergencyRelation1(e.target.value)}
              required
            >
              {relations.map((rel) => (
                <MenuItem key={rel} value={rel}>
                  {rel}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151', mt: 3 }}>
              Contacto Secundario (Opcional)
            </Typography>
            <TextField
              fullWidth
              label="Nombre completo"
              value={emergencyName2}
              onChange={(e) => setEmergencyName2(e.target.value)}
            />
            <TextField
              fullWidth
              label="Teléfono"
              type="tel"
              value={emergencyPhone2}
              onChange={(e) => setEmergencyPhone2(e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="Parentesco"
              value={emergencyRelation2}
              onChange={(e) => setEmergencyRelation2(e.target.value)}
            >
              {relations.map((rel) => (
                <MenuItem key={rel} value={rel}>
                  {rel}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  sx={{
                    color: '#7B1068',
                    '&.Mui-checked': {
                      color: '#7B1068',
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" className="text-gray-700">
                  Acepto los Términos de Servicio y la Política de Privacidad de Cabada CONECTA
                </Typography>
              }
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <ShieldAlert className="w-6 h-6 mr-2" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Registro
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: 'white', px: 2, pt: 3, pb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {renderStepContent()}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 space-y-3">
        <div className="flex gap-3">
          <Button
            variant="outlined"
            size="large"
            onClick={handleBack}
            sx={{
              flex: 1,
              borderColor: '#E5E7EB',
              color: '#6B7280',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              }
            }}
          >
            {activeStep === 0 ? 'Volver' : 'Anterior'}
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            disabled={!isStepValid()}
            sx={{
              flex: 2,
              backgroundColor: '#7B1068',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#5A0B4D',
              },
              '&:disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Completar Registro' : 'Siguiente'}
          </Button>
        </div>

        <Typography variant="caption" className="text-center text-gray-500 block">
          Paso {activeStep + 1} de {steps.length}
        </Typography>
      </div>
    </div>
  );
}
