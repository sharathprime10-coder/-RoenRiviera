import React from 'react';

export const RoenLogo = ({ className = "h-8 w-auto" }: { className?: string }) => (
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
      <g className="atom-spin" style={{ transformOrigin: '60px 40px' }}>
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(0 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(60 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <ellipse cx="60" cy="40" rx="28" ry="10" transform="rotate(120 60 40)" stroke="url(#roen-grad)" strokeWidth="2.5" fill="none" />
        <circle cx="60" cy="40" r="6" fill="url(#roen-grad)" />
      </g>
      
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
