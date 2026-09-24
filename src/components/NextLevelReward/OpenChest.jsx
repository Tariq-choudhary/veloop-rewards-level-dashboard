/** Inline 3D-style open treasure chest with a gem pile — the revealed
 * companion to ClosedChest.jsx. Gem colors reuse the app's own reward
 * palette (gold/green/purple) instead of copying any reference art. */
function OpenChest({ className }) {
  return (
    <svg viewBox="0 0 100 96" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ocWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c98a49" />
          <stop offset="50%" stopColor="#96602f" />
          <stop offset="100%" stopColor="#6b431f" />
        </linearGradient>
        <linearGradient id="ocGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff3cc" />
          <stop offset="35%" stopColor="#ffd876" />
          <stop offset="70%" stopColor="#f0c14b" />
          <stop offset="100%" stopColor="#e0a83a" />
        </linearGradient>
        <linearGradient id="ocInside" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2410" />
          <stop offset="100%" stopColor="#221305" />
        </linearGradient>
        <radialGradient id="ocGemGold" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="45%" stopColor="#f0c14b" />
          <stop offset="100%" stopColor="#a8791e" />
        </radialGradient>
        <radialGradient id="ocGemGreen" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#daffe9" />
          <stop offset="45%" stopColor="#3ddc8a" />
          <stop offset="100%" stopColor="#1f8a56" />
        </radialGradient>
        <radialGradient id="ocGemPurple" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ece0ff" />
          <stop offset="45%" stopColor="#9b6bf2" />
          <stop offset="100%" stopColor="#5c3aa8" />
        </radialGradient>
      </defs>

      {/* lid, folded open behind the body */}
      <path
        d="M6,44 C4,20 18,4 42,3 C46,14 46,26 40,40 Z"
        fill="url(#ocWood)"
      />
      <path d="M6,44 C4,20 18,4 42,3" fill="none" stroke="url(#ocGold)" strokeWidth="5" strokeLinecap="round" />

      {/* body */}
      <rect x="9" y="52" width="82" height="34" rx="7" fill="url(#ocWood)" />
      <rect x="9" y="52" width="82" height="34" rx="7" fill="#000" opacity="0.08" />
      <rect x="9" y="74" width="82" height="7" fill="url(#ocGold)" />
      <rect x="9" y="52" width="9" height="34" fill="url(#ocGold)" />
      <rect x="82" y="52" width="9" height="34" fill="url(#ocGold)" />

      {/* dark interior at the mouth */}
      <path d="M18,52 C18,42 30,38 50,38 C70,38 82,42 82,52 Z" fill="url(#ocInside)" />

      {/* gem pile mounded above the rim */}
      <g>
        <path d="M50,20 L64,34 L56,52 L44,52 L36,34 Z" fill="url(#ocGemGold)" stroke="#fff6d8" strokeWidth="0.6" />
        <path d="M50,20 L57,34 L50,44 L43,34 Z" fill="#ffffff" opacity="0.3" />

        <path d="M30,30 L42,40 L36,54 L22,52 L20,38 Z" fill="url(#ocGemGreen)" stroke="#eafff2" strokeWidth="0.6" />
        <path d="M70,28 L82,36 L78,52 L64,52 L62,38 Z" fill="url(#ocGemPurple)" stroke="#f1e9ff" strokeWidth="0.6" />

        <path d="M40,42 L48,50 L42,58 L32,56 Z" fill="url(#ocGemPurple)" opacity="0.95" />
        <path d="M60,42 L70,50 L64,58 L56,54 Z" fill="url(#ocGemGreen)" opacity="0.95" />
      </g>

      {/* sparkles */}
      <g fill="#ffffff">
        <path d="M28,24 l1.6,4 4,1.6 -4,1.6 -1.6,4 -1.6,-4 -4,-1.6 4,-1.6 Z" opacity="0.9" />
        <path d="M74,22 l1.2,3 3,1.2 -3,1.2 -1.2,3 -1.2,-3 -3,-1.2 3,-1.2 Z" opacity="0.8" />
        <path d="M52,14 l1,2.6 2.6,1 -2.6,1 -1,2.6 -1,-2.6 -2.6,-1 2.6,-1 Z" opacity="0.85" />
      </g>

      {/* gems spilling at the base */}
      <path d="M22,86 L30,92 L22,96 L15,92 Z" fill="url(#ocGemGreen)" />
      <path d="M74,86 L82,91 L75,96 L68,91 Z" fill="url(#ocGemGold)" />
    </svg>
  );
}

export default OpenChest;
