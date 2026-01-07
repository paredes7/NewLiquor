import { useState } from "react";

export default function EnhancedGallery({ multimedia, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Separar imágenes y videos
  const images = multimedia.filter((m) => m.type !== "video");
  const videos = multimedia.filter((m) => m.type === "video");

  // Combinar: videos primero, luego imágenes
  const allMedia = [...videos, ...images];

  if (allMedia.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-grayCustom text-lg">Sin imágenes disponibles</p>
      </div>
    );
  }

  const currentMedia = allMedia[selectedIndex];
  const isVideo = currentMedia?.type === "video";

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
        {isVideo ? (
          <video
            key={currentMedia.url}
            src={currentMedia.url}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <img
              src={currentMedia.url}
              alt={`${productName} - ${selectedIndex + 1}`}
              className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
              onClick={() => setIsZoomOpen(true)}
            />
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allMedia.map((media, index) => {
            const isVideoThumb = media.type === "video";
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                  selectedIndex === index
                    ? "border-turquoise shadow-lg"
                    : "border-gray-300 hover:border-grayCustom"
                }`}
              >
                {isVideoThumb ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && !isVideo && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100000] p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white text-5xl font-bold z-50 hover:scale-110 transition"
          >
            ×
          </button>
          <img
            src={currentMedia.url}
            alt={productName}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation arrows in zoom */}
          {allMedia.length > 1 && (
            <>
              {selectedIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(selectedIndex - 1);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-6xl font-bold hover:scale-110 transition"
                >
                  ‹
                </button>
              )}
              {selectedIndex < allMedia.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(selectedIndex + 1);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-6xl font-bold hover:scale-110 transition"
                >
                  ›
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}