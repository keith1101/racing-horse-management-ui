import logoSrc from '../../artifacts/logo/logo.jpg';

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

export function BrandLogo({ className = 'h-8 w-8', alt = 'RTMS logo' }: BrandLogoProps) {
  return <img src={logoSrc} alt={alt} className={`shrink-0 rounded-full object-cover ${className}`} />;
}
