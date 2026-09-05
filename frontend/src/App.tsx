import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Library, Calendar, ArrowRight, ArrowLeft, Clock, CheckCircle2, Mic, X, Search, FileText, Upload, Settings, MessageSquare, MessageCircle, User } from 'lucide-react';
import { sendMessage, streamMessage } from './api/chat';
import { uploadDocument } from './api/documents';
import { supabase } from './lib/supabaseClient';
import { VoiceSettings } from './components/VoiceSettings';

const RoenLogo = ({ className = "h-8 w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="roen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EBAA62" />
        <stop offset="50%" stopColor="#C56F43" />
        <stop offset="100%" stopColor="#A85B33" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <g filter="url(#glow)">
      {/* Atomic Orbits - 3 Rings Rotating slowly in the background */}
      <g className="atom-spin" style={{ transformOrigin: '60px 40px' }}>
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(0 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(60 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(120 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <circle cx="60" cy="40" r="6" fill="url(#roen-grad)" />
      </g>
      
      {/* Flowing River/Wave Shapes - Waving gracefully */}
      <g className="wave-float-1">
        <path d="M 5 65 C 20 65, 35 75, 60 60 C 85 45, 105 45, 125 50 C 145 55, 155 45, 155 45 C 135 60, 110 70, 85 65 C 60 60, 40 75, 25 70 C 15 67, 5 65, 5 65 Z" fill="url(#roen-grad)" />
      </g>
      <g className="wave-float-2">
        <path d="M 45 78 C 65 65, 85 60, 110 65 C 130 70, 140 60, 140 60 C 120 75, 95 80, 75 75 C 60 70, 50 78, 45 78 Z" fill="url(#roen-grad)" />
      </g>
      <g className="wave-float-3">
        <path d="M 65 90 C 80 80, 100 75, 120 80 C 135 83, 145 75, 145 75 C 125 90, 105 95, 85 90 C 75 87, 65 90, 65 90 Z" fill="url(#roen-grad)" />
      </g>
    </g>
  </svg>
);

const DesertGalaxy = () => {
  const [stars, setStars] = useState('');
  const [stars2, setStars2] = useState('');
  const [stars3, setStars3] = useState('');

  useEffect(() => {
    const generateStars = (count: number) => {
      let result = '';
      const colors = ['#C56F43', '#FFFFFF', '#BABABA', '#453027'];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2500);
        const y = Math.floor(Math.random() * 2500);
        const color = colors[Math.floor(Math.random() * colors.length)];
        result += `${x}px ${y}px ${color}${i === count - 1 ? '' : ', '}`;
      }
      return result;
    };

    setStars(generateStars(200));
    setStars2(generateStars(100));
    setStars3(generateStars(50));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-[radial-gradient(ellipse_at_bottom,_#281D17_0%,_#15110E_100%)] opacity-90 pointer-events-none">
      <div
        className="absolute w-[1px] h-[1px] bg-transparent animate-[animStar_120s_linear_infinite]"
        style={{ boxShadow: stars }}
      />
      <div
        className="absolute w-[2px] h-[2px] bg-transparent animate-[animStar_180s_linear_infinite]"
        style={{ boxShadow: stars2 }}
      />
      <div
        className="absolute w-[3px] h-[3px] bg-transparent animate-[animStar_240s_linear_infinite]"
        style={{ boxShadow: stars3 }}
      />
    </div>
  );
};

const VoiceAssistantOverlay = ({ isOpen, onClose, isSassy }: { isOpen: boolean; onClose: () => void, isSassy: boolean }) => {
  const [status, setStatus] = useState<'idle' | 'greeting' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceId, setVoiceId] = useState(() => localStorage.getItem('riviera_voice_id') || 'en-US-AriaNeural');
  const [rate, setRate] = useState(() => localStorage.getItem('riviera_voice_rate') || '+0%');

  useEffect(() => {
    localStorage.setItem('riviera_voice_id', voiceId);
  }, [voiceId]);

  useEffect(() => {
    localStorage.setItem('riviera_voice_rate', rate);
  }, [rate]);

  const silenceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const microphoneRef = React.useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const currentAudioRef = React.useRef<HTMLAudioElement | null>(null);
  // Ref to reliably read the latest final transcript inside recognition.onend
  const finalTranscriptRef = React.useRef<string>('');

  useEffect(() => {
    if (isOpen) {
      // Step 1: Auto Greeting
      setStatus('greeting');
      playGreeting();
    } else {
      cleanup();
    }
    return cleanup;
  }, [isOpen]);

  const cleanup = () => {
    // Stop browser TTS if greeting is still playing
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    
    setStatus('idle');
    setTranscript('');
    setAudioUrl(null);
    setVolume(0);
  };

  const playGreeting = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

      const response = await fetch(`${API_URL}/voice/speak`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: "Hi! I am River. How can I help you?", voice_id: voiceId, rate: rate, sassy: isSassy })
      });

      if (!response.ok) throw new Error("Failed to fetch greeting audio");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => {
        setStatus('idle');
        setAudioUrl(null);
        startListening();
      };
      audio.play();

    } catch (error) {
      console.error("Greeting error:", error);
      setStatus('idle');
      startListening(); // Fallback to listening if greeting fails
    }
  };

  const startVolumeAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      microphone.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setVolume(average); // 0 to 255
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (e) {
      console.error("Microphone access denied or error", e);
    }
  };

  const startListening = () => {
    setStatus('listening');
    setTranscript('');
    finalTranscriptRef.current = ''; // Reset the ref
    
    // Start Audio Analysis for Pulsing
    startVolumeAnalysis();

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      // Only accumulate *final* results to avoid interim gibberish
      let newFinal = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newFinal += event.results[i][0].transcript;
        }
      }

      if (newFinal) {
        finalTranscriptRef.current += newFinal;
        setTranscript(finalTranscriptRef.current);

        // Reset 5-second silence timer each time we get final speech
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
        }, 5000);
      }
    };

    // Initial 10-second timer in case they don't say anything at all
    silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
    }, 10000);

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      // On 'no-speech' or 'audio-capture', let onend handle cleanup
      if (event.error === 'aborted') return;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognition.onend = async () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      
      // Read from ref — avoids stale React state closure bug
      const captured = finalTranscriptRef.current.trim();
      if (captured) {
        processVoiceCommand(captured);
      } else {
        setStatus('idle');
      }
    };

    recognition.start();
  };

  const processVoiceCommand = async (text: string) => {
    setStatus('processing');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";

      // Use the same VITE_API_URL pattern as api/chat.ts and api/documents.ts
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_URL}/voice/process`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, voice_id: voiceId, rate: rate, sassy: isSassy })
      });

      if (!response.ok) throw new Error("Failed to process speech");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus('speaking');
      
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => {
        setStatus('idle');
        setAudioUrl(null);
        startListening(); // Auto loop back to listening
      };
      audio.play();

    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  const toggleListening = () => {
    if (status === 'listening') {
      if (recognitionRef.current) recognitionRef.current.stop();
    } else if (status === 'idle') {
      startListening();
    }
  };

  if (!isOpen) return null;

  const isActive = status !== 'idle';
  const scale = isActive ? 1 + Math.min(volume / 50, 0.4) : 0.9;

  const statusLabel = {
    greeting: 'GREETING...',
    listening: 'LISTENING...',
    processing: 'THINKING...',
    speaking: 'SPEAKING...',
    idle: 'TAP TO SPEAK',
  }[status];

  return (
    <div className="fixed inset-0 z-[100] bg-[#05010A] flex flex-col items-center justify-center transition-all duration-500 animate-in fade-in zoom-in-95">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C56F43]/10 via-[#05010A] to-[#05010A] pointer-events-none"></div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <Settings size={20} />
        </button>
      </div>

      <VoiceSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        voiceId={voiceId} 
        setVoiceId={setVoiceId} 
        rate={rate} 
        setRate={setRate} 
      />

      {/* Main String Visualization */}
      <div 
        className="relative w-full max-w-lg aspect-square flex items-center justify-center flex-col gap-12 mt-8 z-10" 
        onClick={toggleListening}
      >
        <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center cursor-pointer group">
          {/* Deep desert background glow */}
          <div className={`absolute inset-0 rounded-full bg-[#A85B33]/20 blur-[80px] transition-all duration-100 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-40'}`} style={{ transform: `scale(${scale})` }}></div>
          
          {/* Core intense glow */}
          <div className={`absolute inset-1/4 rounded-full bg-[#EBAA62]/20 blur-[50px] transition-all duration-100 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ transform: `scale(${scale * 1.15})` }}></div>

          <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 z-10 overflow-visible pointer-events-none">
            <defs>
              <filter id="desert-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#desert-glow)">
              {[...Array(12)].map((_, i) => (
                <g key={i} style={{ transformOrigin: '100px 100px', transform: `rotate(${i * 15}deg)` }}>
                  <ellipse
                    cx="100"
                    cy="100"
                    rx={88 + Math.sin(i) * 6}
                    ry={78 - Math.cos(i) * 6}
                    fill="none"
                    stroke={i % 2 === 0 ? "#C56F43" : "#EBAA62"}
                    strokeWidth={0.5 + (i % 3) * 0.25}
                    className="mix-blend-screen"
                    style={{
                      transformOrigin: '100px 100px',
                      opacity: 0.6 + (i * 0.03),
                      animation: isActive 
                        ? `orbital-spin ${3 + i * 0.5}s linear infinite ${i % 2 === 0 ? 'reverse' : 'normal'}` 
                        : `orbital-spin ${25 + i}s linear infinite ${i % 2 === 0 ? 'reverse' : 'normal'}`
                    }}
                  />
                </g>
              ))}
            </g>
            
            {/* Additional active state strings */}
            <g filter="url(#desert-glow)" className={`transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {[...Array(4)].map((_, i) => (
                <g key={`active-${i}`} style={{ transformOrigin: '100px 100px', transform: `rotate(${i * 45 + 15}deg)` }}>
                  <ellipse
                    cx="100"
                    cy="100"
                    rx={92 + i * 2}
                    ry={82 - i * 2}
                    fill="none"
                    stroke="#FAD28B"
                    strokeWidth="0.5"
                    className="mix-blend-screen"
                    style={{
                      transformOrigin: '100px 100px',
                      animation: `orbital-spin-reverse ${1.5 + i * 0.5}s linear infinite`
                    }}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-[-60px] flex flex-col items-center gap-2">
           <div className={`h-8 flex items-center justify-center font-mono text-sm tracking-widest uppercase transition-opacity duration-500 ${isActive ? 'opacity-100 text-[#EBAA62]' : 'opacity-50 text-muted-foreground'}`}>
              {statusLabel}
           </div>
           {transcript && status !== 'processing' && status !== 'speaking' && (
             <div className="text-white/80 text-sm max-w-xs text-center line-clamp-2 px-4 italic">"{transcript}"</div>
           )}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-background/50 border-b border-border/50">
        <div className="flex items-center gap-2">
          <RoenLogo className="h-10 w-14" />
          <span className="font-display font-bold text-xl tracking-tight text-white hidden md:block">Riviera</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-card/60 backdrop-blur-md border border-border/60 rounded-full px-2 py-1.5 shadow-lg">
          <Link to="/dashboard" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/chat" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Chat</Link>
          <Link to="/knowledge" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Knowledge Base</Link>
          <Link to="/timetable" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Timetable</Link>
          <Link to="/forum" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Forum</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-full border border-border/80 bg-background/50 text-sm font-medium text-white hover:bg-white/10 transition-colors">Log In</button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24 mt-20 w-full relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold tracking-tight leading-[1.1] max-w-4xl mb-8">
            Your campus, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EBAA62] via-primary to-primary">intelligently connected.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
            All your campus information, class schedules, and study materials in one easy-to-use place. Get the answers you need, instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-[#A85B33] transition-all shadow-[0_0_30px_rgba(197,111,67,0.4)] flex items-center gap-2 text-base group">
              Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full border border-border/80 bg-card/40 backdrop-blur-md text-white font-medium hover:bg-card/80 transition-all text-base">
              Learn More
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-24 relative z-10">
          <div className="md:col-span-8 p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/60 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-background/80 border border-border/80 rounded-2xl shadow-inner">
                  <Library className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">Syllabus & Notes</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Workflow: syllabus_rag</p>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-medium tracking-wide">
                Optimal
              </div>
            </div>


          </div>

          <div className="md:col-span-4 p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/60 shadow-2xl flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
            <div className="mb-6 relative z-10">
              <div className="w-14 h-14 bg-background/80 border border-border/80 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <Calendar className="text-primary" size={26} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Timetable Sync</h3>
              <p className="text-sm text-muted-foreground">Real-time conflict detection.</p>
            </div>
            

          </div>

          <div className="md:col-span-12 p-10 rounded-3xl bg-gradient-to-br from-card/80 to-background/40 backdrop-blur-xl border border-border/60 shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
             
             <h3 className="font-display font-bold text-3xl text-white mb-10 text-center tracking-tight">How it works</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="flex flex-col items-center text-center relative group">
                 <div className="w-20 h-20 rounded-2xl bg-background border border-border/80 flex items-center justify-center mb-6 shadow-inner z-10 transition-transform group-hover:-translate-y-1">
                   <span className="font-mono text-xl font-bold text-muted-foreground">01</span>
                 </div>
                 <h4 className="font-bold text-lg text-white mb-3">Gather Data</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">We automatically collect official campus notices, schedules, and your syllabi.</p>
                 <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-border border-dashed -z-0"></div>
               </div>
               
               <div className="flex flex-col items-center text-center relative group">
                 <div className="w-20 h-20 rounded-2xl bg-background border border-primary/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(197,111,67,0.2)] z-10 transition-transform group-hover:-translate-y-1">
                   <span className="font-mono text-xl font-bold text-primary">02</span>
                 </div>
                 <h4 className="font-bold text-lg text-white mb-3">Analyze & Organize</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">Our system safely processes the information so it's ready when you need it.</p>
                 <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-border border-dashed -z-0"></div>
               </div>
               
               <div className="flex flex-col items-center text-center group">
                 <div className="w-20 h-20 rounded-2xl bg-primary border border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(197,111,67,0.4)] z-10 transition-transform group-hover:-translate-y-1">
                   <span className="font-mono text-xl font-bold text-white">03</span>
                 </div>
                 <h4 className="font-bold text-lg text-white mb-3">Get Answers</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">Ask questions or check your dashboard for instant, accurate answers.</p>
               </div>
             </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-xs text-muted-foreground">
            © 2026 Riviera. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

const PageLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-card/50 border border-border/50 rounded-full text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground w-64 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
      <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8 shadow-2xl min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <PageLayout title="Intelligence Feed">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-sm group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">River Assistant</h3>
              <p className="text-xs text-muted-foreground font-mono">Ready to assist</p>
            </div>
          </div>
          <div className="bg-card/50 rounded-xl p-4 border border-border/40 text-sm text-muted-foreground">
            Hello! Upload some study materials in the Knowledge Base, and I will index them to help you answer questions and organize your schedule.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-background/40 border border-border/50">
             <h4 className="text-white font-medium mb-1">Knowledge Base</h4>
             <p className="text-2xl font-mono text-primary font-bold">0 <span className="text-sm font-sans font-normal text-muted-foreground">docs</span></p>
          </div>
          <div className="p-5 rounded-2xl bg-background/40 border border-border/50">
             <h4 className="text-white font-medium mb-1">Recent Queries</h4>
             <p className="text-2xl font-mono text-[#EBAA62] font-bold">0</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium text-white mb-4">Active Workflows</h3>
        <div className="text-sm text-muted-foreground p-4 bg-background/40 rounded-xl border border-border/50 text-center">
           No active workflows. Upload a document to trigger a workflow.
        </div>
      </div>
    </div>
  </PageLayout>
);

const RealisticBlackHole = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none flex items-center justify-center mix-blend-screen opacity-60 md:opacity-80 transition-all duration-1000 scale-[0.6] sm:scale-75 md:scale-100 -z-0">
    {/* Huge ambient background glow */}
    <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-[#C56F43]/15 via-[#EBAA62]/10 to-transparent rounded-full blur-[100px] animate-[orbital-spin_30s_linear_infinite]"></div>
    
    {/* Gravitational Lensing (Top & Bottom Halo) */}
    <div className="absolute w-[380px] h-[380px] rounded-full border-t-[8px] border-b-[8px] border-[#EBAA62]/40 blur-[12px] animate-[orbital-spin_12s_linear_infinite]"></div>
    <div className="absolute w-[400px] h-[400px] rounded-full border-l-[12px] border-r-[12px] border-[#C56F43]/50 blur-[16px] animate-[orbital-spin-reverse_15s_linear_infinite]"></div>

    {/* The Accretion Disk (Back - tilted) */}
    <div className="absolute w-[800px] h-[280px] rounded-[50%] border-[24px] border-[#EBAA62]/30 blur-[24px]" style={{ transform: 'rotate(-12deg)' }}></div>
    <div className="absolute w-[740px] h-[240px] rounded-[50%] border-[12px] border-[#C56F43]/50 blur-[10px]" style={{ transform: 'rotate(-12deg)' }}></div>
    <div className="absolute w-[700px] h-[220px] rounded-[50%] border-[4px] border-white/40 blur-[4px]" style={{ transform: 'rotate(-12deg)' }}></div>

    {/* Event Horizon (Pure Black Center) */}
    <div className="absolute w-[340px] h-[340px] bg-[#020101] rounded-full shadow-[0_0_80px_30px_rgba(197,111,67,0.5),inset_0_0_50px_rgba(0,0,0,1)] z-10 border border-[#EBAA62]/10"></div>
    
    {/* Disk passing in front of Event Horizon */}
    <div className="absolute w-[800px] h-[280px] rounded-[50%] border-b-[36px] border-[#EBAA62]/50 blur-[18px] z-20" style={{ transform: 'rotate(-12deg)' }}></div>
    <div className="absolute w-[740px] h-[240px] rounded-[50%] border-b-[18px] border-[#C56F43]/70 blur-[8px] z-20" style={{ transform: 'rotate(-12deg)' }}></div>
    <div className="absolute w-[700px] h-[220px] rounded-[50%] border-b-[8px] border-white/70 blur-[3px] z-20 shadow-[0_0_30px_rgba(255,255,255,0.4)]" style={{ transform: 'rotate(-12deg)' }}></div>

    {/* Particles orbiting */}
    <div className="absolute inset-0 z-30 flex items-center justify-center animate-[orbital-spin_8s_linear_infinite]">
      {[...Array(25)].map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 bg-[#EBAA62] rounded-full blur-[1px]" style={{
          transform: `rotate(${i * 14}deg) translateX(${170 + Math.random() * 200}px)`,
          opacity: 0.2 + Math.random() * 0.8
        }}></div>
      ))}
    </div>
  </div>
);

const Chat = () => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string, sources?: any[]}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSassy, setIsSassy] = useState(() => {
    return localStorage.getItem('riviera_sassy_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('riviera_sassy_mode', isSassy.toString());
  }, [isSassy]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessages(prev => [...prev, { role: 'user', content: `[Uploading document: ${file.name}...]` }]);
    try {
      await uploadDocument(file);
      setMessages(prev => [...prev, { role: 'bot', content: `Successfully indexed ${file.name}. It is now in my knowledge base!` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: `Failed to upload ${file.name}.` }]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add an initial empty bot message to stream into
      setMessages(prev => [...prev, { role: 'bot', content: '' }]);
      
      await streamMessage(text, 'auto', (chunk) => {
        setIsLoading(false); // turn off loading spinner as soon as first chunk arrives
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === 'bot') {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk
            };
          }
          return newMessages;
        });
      }, isSassy);
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { role: 'bot', content: 'Failed to connect to backend.' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-[calc(100vh-4rem)] relative w-full overflow-hidden px-4">
      <VoiceAssistantOverlay isOpen={isVoiceMode} onClose={() => setIsVoiceMode(false)} isSassy={isSassy} />

      {/* Realistic 3D Black Hole Background */}
      <RealisticBlackHole />

      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col relative z-10 overflow-hidden mb-6 mt-6 p-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-display font-medium text-white/80 mb-2 tracking-tight">
              Hi I am River, what can I do for u
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-10">
              {["Check my timetable conflicts", "Summarize OS Unit 3", "When is the exam deadline?"].map((prompt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-2 rounded-full bg-card/40 border border-border/50 text-sm text-muted-foreground hover:text-white hover:border-primary/40 transition-colors backdrop-blur-md"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-2 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-card border border-border text-white'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-background/80 border border-border/50 text-white/90 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.sources.map((src, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-background/50 border border-border/30 rounded-lg text-xs text-muted-foreground">
                          <FileText size={12} className="text-primary" /> {src.document_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-card border border-border text-white flex items-center justify-center">
                  <Bot size={18} className="animate-pulse text-primary" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-background/80 border border-border/50 flex items-center gap-2 rounded-tl-sm">
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Central Input Bar */}
      <div className="w-full max-w-3xl relative z-10 mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-[#EBAA62]/20 to-primary/30 rounded-3xl blur-xl opacity-70"></div>
        
        <div className="relative bg-[#1A1512]/90 backdrop-blur-2xl border border-border/80 rounded-2xl p-2 shadow-2xl flex flex-col transition-all duration-300">
          <input 
            type="text" 
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="w-full bg-transparent px-4 py-5 text-lg text-white placeholder:text-muted-foreground focus:outline-none"
          />
          
          <div className="flex items-center justify-between px-2 pb-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.pptx,.txt,.md,.docx,.csv"
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Upload document to Knowledge Base"
                className={`w-8 h-8 rounded-full bg-background/50 border border-border flex items-center justify-center transition-colors ${isUploading ? 'text-primary animate-pulse' : 'hover:bg-background text-muted-foreground'}`}
              >
                <span className="text-lg leading-none">{isUploading ? '...' : '+'}</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 hover:bg-background border border-border text-sm text-muted-foreground transition-colors">
                <Search size={14} /> Normal
              </button>
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 hover:bg-background border border-border text-sm text-muted-foreground transition-colors">
                <Bot size={14} className="text-primary" /> DeepThink
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsVoiceMode(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 hover:bg-background border border-border text-muted-foreground hover:text-white hover:border-primary/50 transition-colors"
              >
                <Mic size={16} />
              </button>
              
              <button 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="w-8 h-8 rounded-full bg-primary hover:bg-[#A85B33] flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(197,111,67,0.4)] disabled:opacity-50"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState<{name: string; type: string; date: string}[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        await uploadDocument(file);
        setDocuments(prev => [{
          name: file.name,
          type: 'Uploaded Document',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }, ...prev]);
        alert("Upload successful! Document is now available for chat.");
      } catch (err) {
        alert("Failed to upload document.");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <PageLayout title="Knowledge Base">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {['All Documents', 'Syllabi', 'Official Notices', 'Study Material'].map((tab, i) => (
            <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-primary text-white shadow-[0_0_15px_rgba(197,111,67,0.3)]' : 'bg-background/40 text-muted-foreground hover:text-white border border-border/50'}`}>
              {tab}
            </button>
          ))}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,.pdf,.pptx,.txt,.md,.docx,.csv"
          onChange={handleUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-white text-[#15110E] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Upload size={16} /> {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No documents found.</p>
          <p className="text-sm">Upload notes or syllabi to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {documents.map((doc, i) => (
             <div key={i} className="bg-background/40 border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-card/80 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText size={18} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1 truncate">{doc.name}</h4>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                  <span className="bg-card px-2 py-1 rounded border border-border/40">{doc.type}</span>
                  <span>{doc.date}</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </PageLayout>
  );
};

const Timetable = () => (
  <PageLayout title="Timetable & Conflict Detection">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-background/40 border border-border/50 rounded-2xl p-6">
         <h3 className="font-semibold text-white mb-6">Upcoming Schedule</h3>
         <div className="text-center py-10 text-muted-foreground border border-dashed border-border/30 rounded-xl">
            <Calendar size={32} className="mx-auto mb-3 opacity-50" />
            <p>Your schedule is clear.</p>
            <p className="text-xs mt-1">Upload your timetable document to sync classes.</p>
         </div>
      </div>
      <div className="bg-background/40 border border-border/50 rounded-2xl p-6">
         <h3 className="font-semibold text-white mb-4">Conflict Detector</h3>
         <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border/30 rounded-xl">
            No conflicts detected.
         </div>
      </div>
    </div>
  </PageLayout>
);

const Forum = () => {
  const [posts, setPosts] = useState<{title: string, author: string, comments: number, content: string}[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = () => {
    if (newTitle && newContent) {
      setPosts(prev => [{
        title: newTitle,
        author: 'You',
        comments: 0,
        content: newContent
      }, ...prev]);
      setNewTitle('');
      setNewContent('');
    }
  };

  return (
    <PageLayout title="Campus Discussion Forum">
      <div className="mb-8 bg-card/60 border border-border/50 p-6 rounded-2xl">
        <h3 className="font-semibold text-white mb-4">Start a discussion</h3>
        <input 
          type="text" 
          placeholder="Topic Title" 
          className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 mb-3 text-white focus:outline-none focus:border-primary/50"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <textarea 
          placeholder="What do you want to discuss?" 
          className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-primary/50 min-h-[80px]"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
        <button 
          onClick={handlePost}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#A85B33] transition-colors"
        >
          Post Topic
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
            <MessageSquare size={40} className="mx-auto mb-4 opacity-50" />
            <p>No discussions yet.</p>
            <p className="text-sm">Be the first to start a conversation!</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={i} className="bg-background/40 border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer">
              <h4 className="text-lg font-semibold text-white mb-2">{post.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="text-primary font-medium">{post.author}</span>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} /> {post.comments} Comments
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
};

// App shell wrapper to allow seamless voice assistant on all screens
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen text-foreground font-sans relative selection:bg-primary/30 selection:text-white">
      <DesertGalaxy />


      {/* Main navigation header across all routes except landing page if we want, but keeping it simple */}
      {location.pathname !== '/' && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/50 h-16 flex items-center px-6 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <RoenLogo className="h-8 w-11" />
            <span className="font-display font-bold text-white tracking-tight hidden md:block">Riviera</span>
          </Link>
          <div className="flex gap-6">
             <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Dashboard</Link>
             <Link to="/chat" className={`text-sm font-medium transition-colors ${location.pathname === '/chat' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Chat</Link>
             <Link to="/knowledge" className={`text-sm font-medium transition-colors ${location.pathname === '/knowledge' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Knowledge Base</Link>
             <Link to="/timetable" className={`text-sm font-medium transition-colors ${location.pathname === '/timetable' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Timetable</Link>
             <Link to="/forum" className={`text-sm font-medium transition-colors ${location.pathname === '/forum' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Forum</Link>
          </div>
          <div className="flex items-center gap-4">
             <Settings size={18} className="text-muted-foreground hover:text-white cursor-pointer" />
             <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-medium text-white">RR</div>
          </div>
        </div>
      )}

      {/* App Page Content */}
      <div className={location.pathname !== '/' ? 'pt-16' : ''}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;