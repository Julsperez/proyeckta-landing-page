type Props = {
    base: string;        // p.ej. "image-14" (sin sufijo de tamaño)
    alt: string;
    className?: string;
    loading?: "eager" | "lazy";
    width?: number;      // opcional, por defecto 1280
    height?: number;     // opcional, por defecto 720
    customSizes?: number[]; // opcional, resoluciones personalizadas disponibles
  };
  
  export default function ResponsiveImg({
    base,
    alt,
    className,
    loading = "lazy",
    width = 1280,
    height = 720,
    customSizes,
  }: Props) {
    // Usar customSizes si se proporciona, sino usar los tamaños estándar
    const sizes = customSizes || [640, 1280, 1920];
    
    // Ordenar los tamaños de menor a mayor para srcSet semánticamente correcto
    const sortedSizes = [...sizes].sort((a, b) => a - b);
    
    // Generar dinámicamente el srcSet con la ruta correcta
    const srcSet = sortedSizes
      .map(size => `/img/optimized/${base}-${size}.jpg ${size}w`)
      .join(', ');
    
    // Fallback: segundo tamaño si existe, sino el primero
    const fallbackSize = sortedSizes.length > 1 ? sortedSizes[1] : sortedSizes[0];
    const fallbackSrc = `/img/optimized/${base}-${fallbackSize}.jpg`;
  
    return (
      <img
        className={className}
        src={fallbackSrc} // fallback dinámico
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, 90vw"
        alt={alt}
        width={width}
        height={height}
        loading={loading}      // "eager" para la hero, "lazy" para el resto
        decoding="async"
        style={{ width: "100%", height: "auto" }} // evita CLS con width/height
      />
    );
  }
  