import {
  Code,
  Database,
  Megaphone,
  Palette,
  PenTool,
  Briefcase
} from 'lucide-react';

interface CareerIconProps {
  id: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CareerIcon({ id, category, className, style }: CareerIconProps) {
  const normId = (id || '').toLowerCase();
  const normCat = (category || '').toLowerCase();

  let IconComponent = Briefcase;

  if (normId.includes('web-dev') || normId.includes('frontend') || normId.includes('backend') || normId.includes('fullstack') || normId.includes('software')) {
    IconComponent = Code;
  } else if (normId.includes('data') || normId.includes('analyst') || normId.includes('analytics') || normId.includes('science')) {
    IconComponent = Database;
  } else if (normId.includes('marketing') || normId.includes('seo') || normId.includes('sales') || normId.includes('digital')) {
    IconComponent = Megaphone;
  } else if (normId.includes('design') || normId.includes('ux') || normId.includes('ui') || normId.includes('creative')) {
    IconComponent = Palette;
  } else if (normId.includes('write') || normId.includes('content') || normId.includes('copywrite')) {
    IconComponent = PenTool;
  } else if (normCat.includes('tech') || normCat.includes('software')) {
    IconComponent = Code;
  } else if (normCat.includes('data') || normCat.includes('analyt')) {
    IconComponent = Database;
  } else if (normCat.includes('market') || normCat.includes('sales')) {
    IconComponent = Megaphone;
  } else if (normCat.includes('design') || normCat.includes('ui')) {
    IconComponent = Palette;
  } else if (normCat.includes('writ') || normCat.includes('content')) {
    IconComponent = PenTool;
  }

  return <IconComponent className={className} style={style} />;
}
