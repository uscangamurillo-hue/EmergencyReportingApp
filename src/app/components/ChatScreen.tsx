import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  TextField,
  Avatar,
  Chip,
  Box,
} from '@mui/material';
import { ArrowLeft, Send, Phone, Video, Paperclip, CheckCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'operator';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export default function ChatScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola, soy el operador Martínez. He recibido tu reporte de emergencia. ¿Puedes confirmar tu ubicación actual?',
      sender: 'operator',
      timestamp: new Date(Date.now() - 120000),
      status: 'read',
    },
    {
      id: '2',
      text: 'Sí, estoy en Av. Juárez #123, cerca del centro',
      sender: 'user',
      timestamp: new Date(Date.now() - 100000),
      status: 'read',
    },
    {
      id: '3',
      text: 'Perfecto. La unidad Patrulla 042 está en camino, llegará en aproximadamente 4 minutos. ¿Estás en un lugar seguro?',
      sender: 'operator',
      timestamp: new Date(Date.now() - 80000),
      status: 'read',
    },
    {
      id: '4',
      text: 'Sí, estoy dentro de una tienda',
      sender: 'user',
      timestamp: new Date(Date.now() - 60000),
      status: 'read',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular operador escribiendo
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addOperatorMessage('Mantente ahí. La unidad llegará pronto. Si algo cambia, avísame de inmediato.');
      }, 3000);
    }, 5000);

    return () => clearTimeout(typingTimer);
  }, []);

  const addOperatorMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'operator',
      timestamp: new Date(),
      status: 'read',
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');

      // Simular estado de entrega
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
        );
      }, 500);

      // Simular estado de lectura
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
        );
      }, 1500);
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#7B1068' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/active-emergency')}>
            <ArrowLeft className="w-6 h-6" />
          </IconButton>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: '#1E40AF',
              mr: 2,
            }}
          >
            OM
          </Avatar>
          <div className="flex-1">
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Operador Martínez
            </Typography>
            <Typography variant="caption" className="text-[#F5E5A3]">
              En línea
            </Typography>
          </div>
          <IconButton color="inherit">
            <Phone className="w-5 h-5" />
          </IconButton>
          <IconButton color="inherit">
            <Video className="w-5 h-5" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          backgroundColor: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
        }}
      >
        <Typography variant="caption" className="text-yellow-800 text-center block">
          🚨 Emergencia Activa - Reporte #SOS-2026-0607-001
        </Typography>
      </Paper>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'operator' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar sx={{ width: 24, height: 24, backgroundColor: '#1E40AF' }}>
                      OM
                    </Avatar>
                    <Typography variant="caption" className="text-gray-600">
                      Operador Martínez
                    </Typography>
                  </div>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? '#7B1068' : '#F3F4F6',
                    color: message.sender === 'user' ? 'white' : '#1F2937',
                    borderRadius: 2,
                    borderTopRightRadius: message.sender === 'user' ? 0 : 2,
                    borderTopLeftRadius: message.sender === 'operator' ? 0 : 2,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>

                <div
                  className={`flex items-center gap-1 mt-1 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Typography variant="caption" className="text-gray-500">
                    {message.timestamp.toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  {message.sender === 'user' && getStatusIcon(message.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4"
          >
            <Avatar sx={{ width: 24, height: 24, backgroundColor: '#1E40AF' }}>OM</Avatar>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: '#F3F4F6',
                borderRadius: 2,
                borderTopLeftRadius: 0,
              }}
            >
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
              </div>
            </Paper>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center gap-2">
          <IconButton size="small" sx={{ color: '#6B7280' }}>
            <Paperclip className="w-5 h-5" />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#F9FAFB',
              }
            }}
          />

          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              backgroundColor: '#7B1068',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5A0B4D',
              },
              '&:disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              }
            }}
          >
            <Send className="w-5 h-5" />
          </IconButton>
        </div>
      </Paper>
    </div>
  );
}
