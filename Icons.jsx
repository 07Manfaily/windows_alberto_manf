// Petites icônes SVG inline pour éviter toute dépendance externe.
// Chaque icône accepte les props standards (className, style, etc.)

export const IconChevron = ({ open = false, ...props }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const IconFolder = (props) => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 5h5l2 2h9a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconDocFolded = (props) => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 4h7l5 5v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M14 4v5h5" />
  </svg>
);

export const IconDocAlert = (props) => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const IconFile = (props) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </svg>
);

export const IconSearch = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconCalendar = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Badge validé (étoile crantée + check)
export const IconValidated = ({ color = "#6c5ce7", ...props }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 2l2.2 1.6 2.7-.3 1 2.5 2.5 1-.3 2.7L21.6 12l-1.6 2.2.3 2.7-2.5 1-1 2.5-2.7-.3L12 21.6l-2.2-1.6-2.7.3-1-2.5-2.5-1 .3-2.7L2.4 12l1.6-2.2-.3-2.7 2.5-1 1-2.5 2.7.3z"
      fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"
    />
    <polyline points="8.5 12 11 14.5 15.5 9.5" fill="none" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconRejected = ({ color = "#E53935", ...props }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none" />
    <line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconArrowUpRight = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export const IconBack = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="5" x2="6" y2="18" />
    <polyline points="13 5 5 5 5 13" />
  </svg>
);

export const IconCheck = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconClose = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
