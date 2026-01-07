import { useState } from "react";

export default function EnhancedGallery({ multimedia, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Filtrar solo multimedia de tipo "General" (multimedia_type_id = 1)
  const generalMedia = multimedia.filter((m) => m.multimedia_type_id === 1);

  // Separar imágenes y videos del tipo General
  const images = generalMedia.filter((m) => m.type !== "video");
  const videos = generalMedia.filter((m) => m.type === "video");

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
    <div className="space-y-6">
      {/* Main Display */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 group">
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
              className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-700"
              onClick={() => setIsZoomOpen(true)}
            />
            {/* Zoom hint */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              Click para ampliar
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allMedia.map((media, index) => {
            const isVideoThumb = media.type === "video";
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 ${
                  selectedIndex === index
                    ? "border-turquoise shadow-xl ring-2 ring-turquoise/50 scale-105"
                    : "border-gray-300 hover:border-darkTurquoise shadow-md"
                }`}
              >
                {isVideoThumb ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-10 h-10 text-white drop-shadow-lg"
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
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                {/* Selection indicator */}
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-turquoise/20 border-2 border-turquoise"></div>
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