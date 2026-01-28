import { useState } from "react";
import { motion } from "framer-motion";

export default function EventContent({ eventDetail }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const charLimit = 150;

    const data = eventDetail?.data ? eventDetail.data : eventDetail;

    if (!data || !data.image_secundaria) {
        return (
            <div className="h-[500px] bg-gray-900 animate-pulse rounded-2xl" />
        );
    }

    const description = data.description || "";
    const isLong = description.length > charLimit;
    const displayText = isExpanded
        ? description
        : `${description.substring(0, charLimit)}...`;

    //año
    const currentYear = new Date().getFullYear();

    return (
        /* Fondo negro para que la imagen se fusione en los bordes */
        <div className="relative mx-auto overflow-hidden rounded-xl shadow-2xl bg-black min-h-[500px] md:h-[600px]">
            {/* CONTENEDOR GRID: Divide la tarjeta en dos partes iguales */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                {/* PARTE IZQUIERDA: Textos */}
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-20 flex flex-col justify-center items-start px-10 md:px-16 py-16 text-white order-2 md:order-1"
                >
                    {data.label && (
                        <div className="mb-6">
                            <span className="bg-[#b4975a] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg">
                                {data.label}
                            </span>
                              <span className="px-4 py-1 text-[#fabc6b] text-[14px] font-bold uppercase tracking-wide shadow-lg">
                                {currentYear}
                            </span>
                        </div>
                    )}

                    <h2 className="text-4xl text-center md:text-6xl font-black italic uppercase tracking-tighter leading-[0.85] mb-4 drop-shadow-lg">
                        {data.titulo_secundario}
                    </h2>

                    

                    <h3 className="text-lg md:text-xl text-center font-bold italic text-[#b4975a] mb-6 uppercase tracking-wide">
                        {data.texto_principal}
                    </h3>

                    <div className="mb-10">
                        <p className="text-base  text-gray-200 italic opacity-95 leading-relaxed">
                            {isLong ? displayText : description}
                        </p>
                        {isLong && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-block mt-2 text-[#b4975a] text-sm font-bold uppercase hover:underline"
                            >
                                {isExpanded ? "Cerrar" : "Leer más"}
                            </button>
                        )}
                    </div>

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "white",
                            color: "black",
                        }}
                        className="px-12 py-4 border-2 border-white text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                    >
                        Explore Collection
                    </motion.button>
                </motion.div>

                {/* PARTE DERECHA: Imagen con sombreado interno */}
                <div className="bg-black relative h-full w-full order-1 md:order-2 overflow-hidden">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={data.image_secundaria}
                        className="absolute inset-0 w-full h-full object-contain scale-110 md:scale-125 transition-transform duration-[3000ms] group-hover:scale-[1.35]"
                        alt={data.titulo_secundario}
                    />

                    {/* SOMBREADO INTERNO (Vignette): Suavizado para no tapar la imagen ahora que es más grande */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-10" />

                    {/* Gradiente de unión: Reducido para dar más aire a la imagen */}
                    <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                </div>
            </div>
        </div>
    );
}
