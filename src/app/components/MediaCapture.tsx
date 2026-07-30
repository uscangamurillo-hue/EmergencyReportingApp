import { useState, useRef } from 'react';
import { Paper, IconButton, Typography, Box, Chip } from '@mui/material';
import { Camera, Video, Mic, X, Play, Pause, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  timestamp: Date;
  name: string;
}

interface MediaCaptureProps {
  onMediaCaptured?: (files: MediaFile[]) => void;
}

export default function MediaCapture({ onMediaCaptured }: MediaCaptureProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecordingTime, setAudioRecordingTime] = useState(0);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newMedia: MediaFile = {
            id: `photo-${Date.now()}-${Math.random()}`,
            type: 'photo',
            url: reader.result as string,
            timestamp: new Date(),
            name: file.name,
          };
          setMediaFiles((prev) => {
            const updated = [...prev, newMedia];
            onMediaCaptured?.(updated);
            return updated;
          });
          toast.success('Foto capturada');
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia: MediaFile = {
          id: `video-${Date.now()}`,
          type: 'video',
          url: reader.result as string,
          timestamp: new Date(),
          name: file.name,
        };
        setMediaFiles((prev) => {
          const updated = [...prev, newMedia];
          onMediaCaptured?.(updated);
          return updated;
        });
        toast.success('Video capturado');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioRecording = () => {
    if (isRecordingAudio) {
      // Detener grabación
      setIsRecordingAudio(false);
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }

      // Simular audio capturado
      const newMedia: MediaFile = {
        id: `audio-${Date.now()}`,
        type: 'audio',
        url: 'data:audio/mp3;base64,simulated',
        timestamp: new Date(),
        name: `Audio-${audioRecordingTime}s.mp3`,
      };
      setMediaFiles((prev) => {
        const updated = [...prev, newMedia];
        onMediaCaptured?.(updated);
        return updated;
      });
      setAudioRecordingTime(0);
      toast.success(`Audio grabado (${audioRecordingTime}s)`);
    } else {
      // Iniciar grabación
      setIsRecordingAudio(true);
      setAudioRecordingTime(0);
      audioIntervalRef.current = setInterval(() => {
        setAudioRecordingTime((prev) => prev + 1);
      }, 1000);
      toast.info('Grabando audio...');
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      onMediaCaptured?.(updated);
      return updated;
    });
    toast.info('Evidencia eliminada');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
        Evidencia Multimedia
      </Typography>

      <div className="flex gap-3">
        <Paper
          elevation={0}
          onClick={() => photoInputRef.current?.click()}
          sx={{
            flex: 1,
            p: 2.5,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px solid #E5E7EB',
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#3B82F6',
              backgroundColor: '#EFF6FF',
            }
          }}
        >
          <Camera className="w-8 h-8 mx-auto mb-1 text-blue-600" />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Foto
          </Typography>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handlePhotoCapture}
            style={{ display: 'none' }}
          />
        </Paper>

        <Paper
          elevation={0}
          onClick={() => videoInputRef.current?.click()}
          sx={{
            flex: 1,
            p: 2.5,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px solid #E5E7EB',
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#8B5CF6',
              backgroundColor: '#F5F3FF',
            }
          }}
        >
          <Video className="w-8 h-8 mx-auto mb-1 text-purple-600" />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Video
          </Typography>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleVideoCapture}
            style={{ display: 'none' }}
          />
        </Paper>

        <Paper
          elevation={0}
          onClick={handleAudioRecording}
          sx={{
            flex: 1,
            p: 2.5,
            textAlign: 'center',
            cursor: 'pointer',
            border: isRecordingAudio ? '2px solid #7B1068' : '2px solid #E5E7EB',
            borderRadius: 2,
            backgroundColor: isRecordingAudio ? '#FEE2E2' : 'white',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: isRecordingAudio ? '#5A0B4D' : '#9C2082',
              backgroundColor: isRecordingAudio ? '#FEE2E2' : '#FEF2F2',
            }
          }}
        >
          {isRecordingAudio ? (
            <>
              <StopCircle className="w-8 h-8 mx-auto mb-1 text-[#7B1068] animate-pulse" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#7B1068' }}>
                {formatTime(audioRecordingTime)}
              </Typography>
            </>
          ) : (
            <>
              <Mic className="w-8 h-8 mx-auto mb-1 text-[#7B1068]" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Audio
              </Typography>
            </>
          )}
        </Paper>
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          <Typography variant="caption" className="text-gray-600">
            Evidencias adjuntas ({mediaFiles.length})
          </Typography>

          <div className="grid grid-cols-2 gap-2">
            {mediaFiles.map((media) => (
              <Paper
                key={media.id}
                elevation={0}
                sx={{
                  position: 'relative',
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {media.type === 'photo' && (
                  <img
                    src={media.url}
                    alt="Evidencia"
                    className="w-full h-32 object-cover"
                  />
                )}

                {media.type === 'video' && (
                  <div className="w-full h-32 bg-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}

                {media.type === 'audio' && (
                  <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-purple-200 flex flex-col items-center justify-center">
                    <Mic className="w-10 h-10 text-[#7B1068] mb-2" />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {media.name}
                    </Typography>
                  </div>
                )}

                <IconButton
                  size="small"
                  onClick={() => removeMedia(media.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </IconButton>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    p: 0.5,
                  }}
                >
                  <Typography variant="caption" className="text-white text-xs">
                    {media.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
