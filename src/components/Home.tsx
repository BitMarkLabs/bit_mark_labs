import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import { Loader2, RotateCcw, Smartphone, ZoomIn } from 'lucide-react';
import { useGesture } from '@use-gesture/react';
import { Application } from '@splinetool/runtime';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const splineRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const handleSplineLoad = (splineApp: Application) => {
    splineRef.current = splineApp;
    setIsLoading(false);
    setError(null);
  };

  const handleSplineError = () => {
    setIsLoading(false);
    setError('Failed to load 3D scene');
  };

  useGesture(
    {
      onPinch: ({ offset: [scale] }) => {
        if (splineRef.current) {
          const camera = splineRef.current.camera;
          const normalizedScale = Math.max(0.5, Math.min(2, scale));
          camera.zoom = normalizedScale;
          camera.updateProjectionMatrix();
        }
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
    }
  );

  return (
    <main className="relative h-screen w-full overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0">
        <Spline
          scene={isMobile && isPortrait
            ? "https://prod.spline.design/YvSNGhpO140BUIjb/scene.splinecode?quality=low"
            : "https://prod.spline.design/YvSNGhpO140BUIjb/scene.splinecode"}
          className="h-full w-full"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
            <p className="mt-4 text-lg text-white">Loading 3D Scene...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <p className="text-lg text-white">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-black transition hover:bg-gray-200"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {isMobile && isPortrait && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center p-6">
            <Smartphone className="mx-auto h-12 w-12 text-white rotate-90" />
            <p className="mt-4 text-xl font-semibold text-white">
              Rotate Your Device
            </p>
            <p className="mt-2 text-sm text-gray-300">
              Please rotate your device to landscape mode for the best experience
            </p>
          </div>
        </div>
      )}

      {isMobile && !isPortrait && !isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-white">
            <ZoomIn className="h-5 w-5" />
            <p className="text-sm">Pinch to zoom in/out</p>
          </div>
        </div>
      )}
    </main>
  );
}