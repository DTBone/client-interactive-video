/* eslint-disable react/prop-types */

import { useState } from "react";

/**
 * images: array of { url, name? }
 * alt: string
 */
const exampleImages = [
  { url: 'https://placehold.co/1500x500', name: 'Image 1' },
  { url: 'https://placehold.co/1500x500', name: 'Image 2' },
  { url: 'https://placehold.co/1500x500', name: 'Image 3' },
]
function BannerSlider({ images = exampleImages, alt = "Banner image" }) {

  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-full max-h-[500px] overflow-hidden flex flex-col">
      <img
        src={images[current].url}
        alt={alt}
        className="h-full w-full object-cover transition-all duration-300"
      />
      {images.length > 1 && (
        <>
          {/* Prev/Next buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
          >
            &#8592;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
          >
            &#8594;
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-400"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BannerSlider;