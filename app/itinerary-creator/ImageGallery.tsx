import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface MediaItem {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface ImageGalleryProps {
  mainImage: string;
  mediaItems?: MediaItem[];
}

export default function ImageGallery({ mainImage, mediaItems = [] }: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const allMedia = [{ url: mainImage, type: 'IMAGE' as const }, ...mediaItems];
  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[50vh] ">
      {/* Main Slider */}
      <div className="relative flex-1 min-h-0">
        <Swiper
          spaceBetween={0}
          navigation={{
            enabled: true,
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="!overflow-visible w-full h-full group"
        >
          {allMedia.map((media, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {media.type === 'VIDEO' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={media.url}
                      className="absolute inset-0 w-full h-full object-contain"
                      loop
                      onClick={handleVideoToggle}
                    />
                    {!isPlaying && (
                      <button
                        onClick={handleVideoToggle}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      >
                        <Play className="h-16 w-16 text-white" />
                      </button>
                    )}

                    {isPlaying && (
                      <button
                        onClick={handleVideoToggle}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      >
                        <Pause className="h-16 w-16 text-white" />
                      </button>
                    )

                    }
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <LazyImage
                      src={media.url}
                      alt={`Gallery image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev !text-white !bg-black/50 w-10 h-10 rounded-full !left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="swiper-button-next !text-white !bg-black/50 w-10 h-10 rounded-full !right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Swiper>
      </div>
      {/* Thumbnail Slider */}
      <p></p>
      {allMedia.length > 1 && (
        <div className="h-20 mt-1 bg-gray-50">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-full"
          >
            {allMedia.map((media, index) => (
              <SwiperSlide
                key={index}
                className="!w-20 relative"
              >
                <div className="relative w-full h-full aspect-square">
                  {media.type === 'VIDEO' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={media.url}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <LazyImage
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}