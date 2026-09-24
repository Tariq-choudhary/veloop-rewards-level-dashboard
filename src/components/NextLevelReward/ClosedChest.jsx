/** Inline 3D-style closed treasure chest — original illustration (no
 * stock-image licensing), styled to match the app's gold/wood palette.
 * Shown until the card has been hovered once; see OpenChest.jsx for the
 * revealed state. */
function ClosedChest({ className }) {
  return (
    <svg viewBox="0 0 100 92" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ccWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c98a49" />
          <stop offset="50%" stopColor="#96602f" />
          <stop offset="100%" stopColor="#6b431f" />
        </linearGradient>
        <linearGradient id="ccWoodDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a4d24" />
          <stop offset="100%" stopColor="#4f3117" />
        </linearGradient>
        <linearGradient id="ccGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff3cc" />
          <stop offset="35%" stopColor="#ffd876" />
          <stop offset="70%" stopColor="#f0c14b" />
          <stop offset="100%" stopColor="#e0a83a" />
        </linearGradient>
        <radialGradient id="ccGem" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e6d4ff" />
          <stop offset="45%" stopColor="#9b6bf2" />
          <stop offset="100%" stopColor="#5c3aa8" />
        </radialGradient>
        <clipPath id="ccLidClip">
          <path d="M8,46 C8,20 24,8 50,8 C76,8 92,20 92,46 Z" />
        </clipPath>
      </defs>

      {/* body */}
      <rect x="9" y="46" width="82" height="38" rx="7" fill="url(#ccWood)" />
      <rect x="9" y="46" width="82" height="38" rx="7" fill="url(#ccWoodDark)" opacity="0.15" />
      <rect x="9" y="70" width="82" height="8" fill="url(#ccGold)" opacity="0.9" />
      <rect x="9" y="46" width="9" height="38" fill="url(#ccGold)" />
      <rect x="82" y="46" width="9" height="38" fill="url(#ccGold)" />
      <circle cx="13.5" cy="52" r="1.6" fill="#4f3117" />
      <circle cx="86.5" cy="52" r="1.6" fill="#4f3117" />
      <circle cx="13.5" cy="78" r="1.6" fill="#4f3117" />
      <circle cx="86.5" cy="78" r="1.6" fill="#4f3117" />

      {/* lid (domed) */}
      <path d="M8,46 C8,20 24,8 50,8 C76,8 92,20 92,46 Z" fill="url(#ccWood)" />
      <rect x="36" y="8" width="28" height="40" fill="url(#ccWoodDark)" clipPath="url(#ccLidClip)" opacity="0.55" />
      <rect x="8" y="42" width="84" height="6" fill="url(#ccGold)" clipPath="url(#ccLidClip)" />
      <rect x="36" y="8" width="6" height="40" fill="url(#ccGold)" opacity="0.9" clipPath="url(#ccLidClip)" />
      <rect x="58" y="8" width="6" height="40" fill="url(#ccGold)" opacity="0.9" clipPath="url(#ccLidClip)" />

      {/* gem inlay */}
      <path d="M50,16 L60,24 L54,36 L46,36 L40,24 Z" fill="url(#ccGem)" stroke="url(#ccGold)" strokeWidth="2" />
      <path d="M50,16 L54,24 L50,30 L46,24 Z" fill="#fff" opacity="0.35" />

      {/* handle */}
      <path d="M38,10 C38,2 62,2 62,10" fill="none" stroke="url(#ccGold)" strokeWidth="4" strokeLinecap="round" />

      {/* front lock */}
      <path d="M44,44 C44,36 56,36 56,44" fill="none" stroke="url(#ccGold)" strokeWidth="4.5" />
      <rect x="41" y="44" width="18" height="15" rx="3" fill="url(#ccGold)" />
      <circle cx="50" cy="50" r="3.4" fill="#4f3117" />
      <rect x="48.4" y="50" width="3.2" height="6" fill="#4f3117" />

      {/* gloss highlight */}
      <path d="M14,20 C22,12 34,9 44,9" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export default ClosedChest;
