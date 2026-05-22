interface Props {
  tier: 'GREEN' | 'YELLOW' | 'RED';
  license: string | null;
  className?: string;
}

const TIER_STYLE: Record<Props['tier'], { bg: string; text: string; border: string; suffix: string }> = {
  GREEN: {
    bg: 'rgba(74, 222, 128, 0.12)',
    text: '#86efac',
    border: 'rgba(74, 222, 128, 0.35)',
    suffix: '',
  },
  YELLOW: {
    bg: 'rgba(251, 191, 36, 0.12)',
    text: '#fcd34d',
    border: 'rgba(251, 191, 36, 0.35)',
    suffix: ' ⚠',
  },
  RED: {
    bg: 'rgba(248, 113, 113, 0.14)',
    text: '#fca5a5',
    border: 'rgba(248, 113, 113, 0.35)',
    suffix: ' ×',
  },
};

export function LicenseBadge({ tier, license, className = '' }: Props) {
  const style = TIER_STYLE[tier];
  const label = license ?? 'Unknown';
  return (
    <span
      className={`inline-flex items-center font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-md border ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {label}
      {style.suffix}
    </span>
  );
}
