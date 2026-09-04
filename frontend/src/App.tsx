import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Library, Calendar, ArrowRight, Clock, CheckCircle2, Mic, X, Search, FileText, Upload, Settings } from 'lucide-react';

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

const VoiceAssistantOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#15110E]/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 animate-in fade-in zoom-in-95">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-all"
      >
        <X size={24} />
      </button>

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Core glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-[60px] animate-pulse"></div>
        
        {/* Outer rotating ring */}
        <div 
          className="absolute inset-4 rounded-full border-[3px] border-primary/80 shadow-[0_0_40px_#C56F43,inset_0_0_30px_#C56F43] animate-[orbital-spin_4s_linear_infinite]"
          style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
        ></div>
        
        {/* Inner rotating ring */}
        <div 
          className="absolute inset-8 rounded-full border-[2px] border-[#EBAA62]/60 shadow-[0_0_20px_#EBAA62] animate-[orbital-spin-reverse_3s_linear_infinite]"
          style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
        ></div>

        {/* Center dense core */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-primary via-[#EBAA62] to-primary/50 shadow-[0_0_80px_#C56F43] flex items-center justify-center opacity-90 animate-pulse">
          <Mic size={32} className="text-[#15110E]" />
        </div>

        {/* Particle effects (simulated) */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#FFF]"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-80px)`,
                animation: `particle-float ${2 + Math.random() * 2}s infinite ${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <h2 className="text-3xl font-display font-bold text-white mb-3">Hi, I'm River</h2>
        <p className="text-xl text-muted-foreground font-light tracking-wide animate-pulse">Listening to your request...</p>
      </div>

      <div className="absolute bottom-12 flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="w-1.5 bg-primary/80 rounded-full animate-pulse"
            style={{ 
              height: `${12 + Math.random() * 24}px`,
              animationDuration: `${0.4 + Math.random() * 0.4}s`,
              animationDelay: `${Math.random() * 0.2}s`
            }}
          ></div>
        ))}
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
          <span className="font-display font-bold text-xl tracking-tight text-white hidden md:block">RoenRiviera</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-card/60 backdrop-blur-md border border-border/60 rounded-full px-2 py-1.5 shadow-lg">
          <Link to="/dashboard" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/chat" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Chat</Link>
          <Link to="/knowledge" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Knowledge Base</Link>
          <Link to="/timetable" className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">Timetable</Link>
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

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Grounding Accuracy</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">99.4</span>
                  <span className="text-primary mb-1.5 font-bold">%</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Indexed Material</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-mono font-bold text-white">12.4</span>
                  <span className="text-muted-foreground mb-1.5">GB</span>
                </div>
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
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm text-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-primary drop-shadow-[0_0_8px_rgba(197,111,67,0.6)]" />
                  <span className="text-white font-medium">Schedule Match</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">0ms</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm text-sm">
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Exam Conflicts</span>
                </div>
                <span className="font-mono text-xs text-primary font-medium">None</span>
              </div>
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
            © 2026 RoenRiviera. All rights reserved.
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
            Good evening. I've synced 4 new documents from your Data Structures course and checked your timetable. You have a mid-term schedule conflict detected for next Thursday.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-background/40 border border-border/50">
             <h4 className="text-white font-medium mb-1">Knowledge Base</h4>
             <p className="text-2xl font-mono text-primary font-bold">24 <span className="text-sm font-sans font-normal text-muted-foreground">docs</span></p>
          </div>
          <div className="p-5 rounded-2xl bg-background/40 border border-border/50">
             <h4 className="text-white font-medium mb-1">Recent Queries</h4>
             <p className="text-2xl font-mono text-[#EBAA62] font-bold">128</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium text-white mb-4">Active Workflows</h3>
        {['Syllabus & Notes', 'Campus Information', 'Timetable & Exams'].map((w, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/50 hover:bg-background/60 cursor-pointer transition-colors">
             <span className="text-sm text-white font-medium">{w}</span>
             <ArrowRight size={14} className="text-muted-foreground" />
          </div>
        ))}
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

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] relative w-full overflow-hidden px-4">
      <VoiceAssistantOverlay isOpen={isVoiceMode} onClose={() => setIsVoiceMode(false)} />

      {/* Realistic 3D Black Hole Background */}
      <RealisticBlackHole />

      <div className="text-center mb-12 relative z-10 max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-display font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          How can River help you today?
        </h2>
        <p className="text-muted-foreground">Access your campus intelligence and timetable instantly.</p>
      </div>

      {/* Central Input Bar matching the reference */}
      <div className="w-full max-w-3xl relative z-10">
        {/* Glow behind the input bar */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-[#EBAA62]/20 to-primary/30 rounded-3xl blur-xl opacity-70"></div>
        
        <div className="relative bg-[#1A1512]/90 backdrop-blur-2xl border border-border/80 rounded-2xl p-2 shadow-2xl flex flex-col transition-all duration-300">
          <input 
            type="text" 
            placeholder="Ask anything..."
            className="w-full bg-transparent px-4 py-5 text-lg text-white placeholder:text-muted-foreground focus:outline-none"
          />
          
          <div className="flex items-center justify-between px-2 pb-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-background/50 hover:bg-background border border-border flex items-center justify-center text-muted-foreground transition-colors">
                <span className="text-lg leading-none">+</span>
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
              
              <button className="w-8 h-8 rounded-full bg-primary hover:bg-[#A85B33] flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(197,111,67,0.4)]">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-10">
        {["Check my timetable conflicts", "Summarize OS Unit 3", "When is the exam deadline?"].map((prompt, i) => (
          <button key={i} className="px-4 py-2 rounded-full bg-card/40 border border-border/50 text-sm text-muted-foreground hover:text-white hover:border-primary/40 transition-colors backdrop-blur-md">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

const KnowledgeBase = () => (
  <PageLayout title="Knowledge Base">
    <div className="flex justify-between items-center mb-8">
      <div className="flex gap-2">
        {['All Documents', 'Syllabi', 'Official Notices', 'Study Material'].map((tab, i) => (
          <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-primary text-white shadow-[0_0_15px_rgba(197,111,67,0.3)]' : 'bg-background/40 text-muted-foreground hover:text-white border border-border/50'}`}>
            {tab}
          </button>
        ))}
      </div>
      <button className="flex items-center gap-2 bg-white text-[#15110E] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
        <Upload size={16} /> Upload Data
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {[
         { name: 'Data_Structures_Syllabus_2024.pdf', type: 'Syllabus', date: 'Oct 12, 2024' },
         { name: 'CN_Unit3_Notes.pdf', type: 'Study Material', date: 'Oct 10, 2024' },
         { name: 'End_Sem_Exam_Schedule_Final.pdf', type: 'Official Notice', date: 'Oct 08, 2024' },
         { name: 'OS_Lecture_Slides_1-5.pptx', type: 'Study Material', date: 'Oct 05, 2024' },
         { name: 'Library_Access_Rules.docx', type: 'Official Notice', date: 'Oct 01, 2024' },
       ].map((doc, i) => (
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
  </PageLayout>
);

const Timetable = () => (
  <PageLayout title="Timetable & Conflict Detection">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-background/40 border border-border/50 rounded-2xl p-6">
         <h3 className="font-semibold text-white mb-6">Upcoming Schedule</h3>
         <div className="space-y-4">
            {[
              { time: '09:00 AM - 10:30 AM', course: 'Data Structures (CS201)', location: 'Room 304' },
              { time: '11:00 AM - 12:30 PM', course: 'Computer Networks (CS305)', location: 'Lab 2' },
              { time: '02:00 PM - 03:30 PM', course: 'Operating Systems (CS302)', location: 'Room 101' },
            ].map((slot, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-card/40 border border-border/30">
                <div className="w-24 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground block">{slot.time.split('-')[0]}</span>
                </div>
                <div className="w-1 h-12 bg-primary/30 rounded-full"></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{slot.course}</h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock size={12} /> {slot.time} • {slot.location}
                  </p>
                </div>
              </div>
            ))}
         </div>
      </div>
      <div className="bg-background/40 border border-border/50 rounded-2xl p-6">
         <h3 className="font-semibold text-white mb-4">Conflict Detector</h3>
         <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
               <Calendar size={18} className="text-primary shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Mid-Term Clash Detected</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    OS (CS302) and Networks (CS305) exams are both scheduled for Oct 24th at 10:00 AM in the official notice.
                  </p>
               </div>
            </div>
         </div>
         <button className="w-full py-2 bg-card border border-border rounded-lg text-sm text-white hover:bg-card/80 transition-colors">
            View Official Notice
         </button>
      </div>
    </div>
  </PageLayout>
);

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
            <span className="font-display font-bold text-white tracking-tight hidden md:block">RoenRiviera</span>
          </Link>
          <div className="flex gap-6">
             <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Dashboard</Link>
             <Link to="/chat" className={`text-sm font-medium transition-colors ${location.pathname === '/chat' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Chat</Link>
             <Link to="/knowledge" className={`text-sm font-medium transition-colors ${location.pathname === '/knowledge' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Knowledge Base</Link>
             <Link to="/timetable" className={`text-sm font-medium transition-colors ${location.pathname === '/timetable' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Timetable</Link>
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
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;