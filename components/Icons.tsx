/**
 * Knowhere Afterglow — inline icon set (stroke icons, Lucide-style).
 * Kept dependency-free so the app ships without an icon package.
 */
import React from 'react';

type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 22): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconHome = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></svg>
);
export const IconPack = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16v13H4z" /><path d="M4 7l2-3h12l2 3" /><path d="M9 11h6" /></svg>
);
export const IconRoute = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="6" cy="19" r="2.2" /><circle cx="18" cy="5" r="2.2" /><path d="M8.2 19H14a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8" /></svg>
);
export const IconCamera = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></svg>
);
export const IconVan = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M2 7h11v9H2z" /><path d="M13 9h4l4 4v3h-8z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
);
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
);
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
);
export const IconBolt = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
);
export const IconCart = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 4h2l2.2 11.2A2 2 0 0 0 9.2 17h8.1a2 2 0 0 0 2-1.6L21 8H6" /><circle cx="9.5" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /></svg>
);
export const IconTrash = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>
);
export const IconX = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconStar = ({ size, filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size)} {...p} fill={filled ? 'currentColor' : 'none'}><path d="m12 3 2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.8 6.6 19.5l1.2-6L3.4 9.3l6-.7z" /></svg>
);
export const IconNote = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 4h11l3 3v13H5z" /><path d="M16 4v3h3" /><path d="M8 11h8M8 15h6" /></svg>
);
export const IconCopy = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
);
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 4v11M7 11l5 5 5-5" /><path d="M5 20h14" /></svg>
);
export const IconUpload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 20V9M7 13l5-5 5 5" /><path d="M5 4h14" /></svg>
);
export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const IconSun = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
);
export const IconBag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 8h12l-1 12H7z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const IconBin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 8h16v11H4z" /><path d="M4 8l1-3h14l1 3" /><path d="M9 12h6" /></svg>
);
export const IconReset = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 20v-4h4" /></svg>
);
