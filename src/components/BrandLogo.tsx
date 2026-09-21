interface BrandLogoProps {
  className?: string;
  alt?: string;
}

export function BrandLogo({ className = 'h-8 w-8', alt = 'RTMS logo' }: BrandLogoProps) {
  return <img src="/logo.jpg" alt={alt} className={`shrink-0 rounded-full object-cover ${className}`} />;
}
