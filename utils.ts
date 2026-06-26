/**
 * Knowhere Afterglow — small helpers
 */

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

/** Whole days from today (local) until an ISO yyyy-mm-dd date. */
export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso + 'T00:00:00');
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = target.getTime() - today.getTime();
  return Math.round(ms / 86_400_000);
}

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Copy text to clipboard with a graceful fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Trigger a browser download for a string payload. */
export function downloadFile(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
