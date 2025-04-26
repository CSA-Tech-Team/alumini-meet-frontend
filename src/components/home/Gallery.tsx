import { useState, useEffect, useRef } from 'react';
import { primary } from "@/constants/styles.ts"

// Import images from gallery_assets
const images = import.meta.glob('./gallery_assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, as: 'url' });

interface Photo {
  src: string;
  width: number;
  height: number;
}

// Convert imported images to Photo type with default aspect ratio
const photos: Photo[] = Object.values(images).map((src) => ({
  src,
  width: 4,
  height: 3,
}));

const PhotoGallery: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  const getColumnDistribution = () => {
    if (windowWidth < 640) {
      return { column1: photos, column2: [], column3: [] };
    } else if (windowWidth < 1024) {
      return {
        column1: photos.filter((_, i) => i % 2 === 0),
        column2: photos.filter((_, i) => i % 2 === 1),
        column3: [],
      };
    } else {
      return {
        column1: photos.filter((_, i) => i % 3 === 0),
        column2: photos.filter((_, i) => i % 3 === 1),
        column3: photos.filter((_, i) => i % 3 === 2),
      };
    }
  };

  const { column1, column2, column3 } = getColumnDistribution();

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const speeds = [0.5, 0.7, 0.4];
  const [scrollPositions, setScrollPositions] = useState<number[]>([0, 0, 0]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const newPositions = [...scrollPositions];
      let activeColumns: (HTMLDivElement | null)[] = [];

      if (windowWidth < 640) {
        activeColumns = [col1Ref.current];
      } else if (windowWidth < 1024) {
        activeColumns = [col1Ref.current, col2Ref.current];
      } else {
        activeColumns = [col1Ref.current, col2Ref.current, col3Ref.current];
      }

      activeColumns.forEach((col, idx) => {
        if (col) {
          const speed = speeds[idx];
          const delta = (speed * deltaTime) / 16;
          newPositions[idx] += delta;
          col.scrollTop = newPositions[idx];

          const maxScroll = col.scrollHeight / 2;
          if (newPositions[idx] >= maxScroll) {
            newPositions[idx] = 0;
            col.scrollTop = 0;
          }
        }
      });

      setScrollPositions(newPositions);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [windowWidth]);

  const duplicateImages = (columnImages: Photo[]) => [
    ...columnImages,
    ...columnImages,
  ];

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-10 overflow-hidden">
      <div className="absolute inset-0" />
      <div className="relative z-10 w-full sm:max-w-[90%] md:max-w-[85%] mx-auto">
        <h1 className={` ${primary} text-2xl sm:text-3xl font-bold  my-4 sm:my-8 text-center lg:text-left font-cormorant`}>
          PHOTO GALLERY
        </h1>

      <div
        className={`grid gap-4 h-[50rem] sm:h-[60rem] overflow-auto scroll-none md:h-[70rem] lg:h-[80rem] ${windowWidth < 640
            ? 'grid-cols-1'
            : windowWidth < 1024
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
      >
        <div ref={col1Ref} className="h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-4 pb-4">
            {duplicateImages(column1).map((photo, idx) => (
              <div key={`col1-${idx}`} className="rounded-lg overflow-hidden shadow-md">
                <img src={photo.src} alt={`Image ${idx}`} className="w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {windowWidth >= 640 && (
          <div ref={col2Ref} className="h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="space-y-4 pb-4">
              {duplicateImages(column2).map((photo, idx) => (
                <div key={`col2-${idx}`} className="rounded-lg overflow-hidden shadow-md">
                  <img src={photo.src} alt={`Image ${idx}`} className="w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {windowWidth >= 1024 && (
          <div ref={col3Ref} className="overflow-hidden h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="space-y-4 pb-4">
              {duplicateImages(column3).map((photo, idx) => (
                <div key={`col3-${idx}`} className="rounded-lg overflow-hidden shadow-md">
                  <img src={photo.src} alt={`Image ${idx}`} className="w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div >
  );
};

export default PhotoGallery;