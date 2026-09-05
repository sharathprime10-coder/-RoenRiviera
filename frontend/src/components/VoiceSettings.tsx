import React, { useEffect, useState, useMemo } from 'react';
import { Settings, X, Search, Check, Globe } from 'lucide-react';
import { getVoices, Voice } from '../api/voice';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  voiceId: string;
  setVoiceId: (id: string) => void;
  rate: string;
  setRate: (rate: string) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  isOpen,
  onClose,
  voiceId,
  setVoiceId,
  rate,
  setRate,
}) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && voices.length === 0) {
      setIsLoading(true);
      getVoices().then((fetchedVoices) => {
        setVoices(fetchedVoices);
        setIsLoading(false);
      });
    }
  }, [isOpen, voices.length]);

  // Group by Locale
  const filteredAndGroupedVoices = useMemo(() => {
    const filtered = voices.filter(v => 
      v.friendly_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.locale.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped: Record<string, Voice[]> = {};
    for (const v of filtered) {
      if (!grouped[v.locale]) {
        grouped[v.locale] = [];
      }
      grouped[v.locale].push(v);
    }

    // Sort locales
    return Object.keys(grouped).sort().reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as Record<string, Voice[]>);
  }, [voices, searchQuery]);

  // Convert rate string like "+15%" or "-20%" to a number
  const sliderValue = useMemo(() => {
    const num = parseInt(rate.replace('%', '').replace('+', ''));
    return isNaN(num) ? 0 : num;
  }, [rate]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    const sign = val >= 0 ? '+' : '';
    setRate(`${sign}${val}%`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-[#05010A]/80 backdrop-blur-xl flex justify-end">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-card/60 border-l border-border/60 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Settings size={20} />
            </div>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">Voice Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Speed Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Speech Rate</h3>
              <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">{rate}</span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              step="5"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full accent-primary h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>

          <div className="w-full h-px bg-border/40"></div>

          {/* Voice Selection */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Voice Model</h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search languages or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground transition-colors"
              />
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary/50 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm">Loading voices...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(filteredAndGroupedVoices).map(([locale, localeVoices]) => (
                  <div key={locale} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <Globe size={12} /> {locale}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {localeVoices.map(v => (
                        <button
                          key={v.short_name}
                          onClick={() => setVoiceId(v.short_name)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                            voiceId === v.short_name 
                              ? 'bg-primary/10 border-primary text-white' 
                              : 'bg-background/40 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-sm text-white/90">{v.friendly_name.split(' - ')[0] || v.friendly_name}</div>
                            <div className="text-xs opacity-70 mt-0.5">{v.gender} • {v.short_name}</div>
                          </div>
                          {voiceId === v.short_name && <Check size={16} className="text-primary flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filteredAndGroupedVoices).length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border/30 rounded-xl">
                    No voices match your search.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
