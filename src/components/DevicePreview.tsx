import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, AlertCircle, Settings, Volume2 } from 'lucide-react';
import { AvatarImage } from './AvatarImage';

interface DevicePreviewProps {
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  stream: MediaStream | null;
  permissionError: string | null;
  fallbackName: string;
  fallbackAvatar?: string;
  onRequestPermissions: () => void;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  stream,
  permissionError,
  fallbackName,
  fallbackAvatar,
  onRequestPermissions,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Attach media stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (stream && cameraEnabled) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, cameraEnabled]);

  // Audio level monitoring using Web Audio API
  useEffect(() => {
    if (!stream || !micEnabled) {
      setAudioLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let animationFrameId: number;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0-100
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationFrameId = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (e) {
      console.warn('AudioContext not available for audio metering:', e);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (source) source.disconnect();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
    };
  }, [stream, micEnabled]);

  const hasVideoStream = stream && stream.getVideoTracks().some(t => t.enabled && t.readyState === 'live');

  return (
    <div id="device-preview-container" className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Video Element */}
      {cameraEnabled && hasVideoStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />
      ) : (
        /* Fallback Avatar / Initials */
        <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="relative mb-3">
            <AvatarImage
              src={fallbackAvatar}
              alt={fallbackName || 'Guest Attendee'}
              fallbackText={fallbackName || 'U'}
              sizeClassName="w-20 h-20"
              className="border-2 border-slate-700 shadow-lg"
              textClassName="text-2xl font-bold"
            />
            {!cameraEnabled && (
              <div className="absolute -bottom-1 -right-1 bg-slate-800 border-2 border-slate-950 rounded-full p-1 text-slate-400">
                <VideoOff className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-white mb-1">
            {fallbackName || 'Guest Attendee'}
          </p>
          <span className="text-xs text-slate-400">
            {cameraEnabled ? 'Initializing camera...' : 'Camera is turned off'}
          </span>
        </div>
      )}

      {/* Permission Error Banner */}
      {permissionError && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <h4 className="text-sm font-semibold text-white mb-1">Media Device Access</h4>
          <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
            {permissionError}
          </p>
          <button
            type="button"
            onClick={onRequestPermissions}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            Allow Microphone & Camera
          </button>
        </div>
      )}

      {/* Top Status & Audio Wave Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-[11px]">Preview Ready</span>
        </div>

        {micEnabled && (
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-xs">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-75"
                style={{ width: `${Math.min(100, audioLevel * 1.5)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Pills */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 z-10">
        <button
          id="lobby-mic-toggle-btn"
          type="button"
          onClick={onToggleMic}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
            micEnabled
              ? 'bg-slate-800/90 hover:bg-slate-700 text-white border border-white/15'
              : 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
          }`}
          title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          id="lobby-camera-toggle-btn"
          type="button"
          onClick={onToggleCamera}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
            cameraEnabled
              ? 'bg-slate-800/90 hover:bg-slate-700 text-white border border-white/15'
              : 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
          }`}
          title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
