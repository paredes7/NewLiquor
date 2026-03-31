import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null; // 3 porque Laravel siempre envía Prev, 1, Next

    return (
        <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-1 mt-12 mb-8 flex-wrap"
        >
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="px-3 py-2 text-gray-300 text-xs uppercase font-bold"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <div key={key} className="relative">
                        <Link
                            href={link.url}
                            preserveScroll
                            className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-lg ${
                                link.active
                                    ? "text-darkGray"
                                    : "text-gray-400 hover:text-turquoise"
                            }`}
                        >
                            <span 
                                className="relative z-10"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />

                            {link.active && (
                                <motion.div
                                    layoutId="activePaginationBorder"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-turquoise shadow-[0_2px_8px_rgba(64,224,208,0.4)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    </div>
                );
            })}
        </motion.nav>
    );
}