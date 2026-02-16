import { useRef } from "react";
import { motion } from "framer-motion";
import { Head, Link } from "@inertiajs/react";

// Componentes
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import CategoriesSection from "@/Components/admin/Categorias/CategoriesSection.jsx";
import OrdersSection from "@/Components/admin/Orders/OrdersSection.jsx";
import ReportsSection from "@/Components/admin/Reportes/ReportsSection";

export default function AdminDashboard({ categories = [] }) {
  // Referencias para el scroll suave
  const sectionRefs = {
    categorias: useRef(null),
    ordenes: useRef(null),
    reportes: useRef(null),
  };

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Configuración de los accesos rápidos del panel
  const menuItems = [
    { label: "Ventas", icon: "💰", color: "hover:bg-green-50", type: "link", href: "/admin/Ventas" },
    { 
      label: "Catálogo", // Cambiamos el nombre para que sea más completo
      icon: "📦", 
      color: "hover:bg-pink-50", 
      type: "link",      // Cambiado de 'scroll' a 'link'
      href: "/admin/catalogo" // Esta será la nueva ruta
    },
    { label: "Órdenes", icon: "🚚", color: "hover:bg-yellow-50", type: "scroll", ref: sectionRefs.ordenes },
    { label: "Reportes", icon: "📊", color: "hover:bg-blue-50", type: "scroll", ref: sectionRefs.reportes },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col font-sans selection:bg-pink-200">
      <Head title="Admin Dashboard" />
      <AdminHeader onLogout={handleLogout} />

      {/* Sección Hero / Menú Principal */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 tracking-tight">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Admin</span> ⚡
          </h1>
          <p className="mt-4 text-gray-500 text-lg md:text-xl font-medium">Gestiona tu plataforma desde un solo lugar.</p>
        </motion.div>

        {/* Grid de 4 Cuadrados */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Renderizado condicional: Link para navegación, Button para scroll */}
              {item.type === "link" ? (
                <Link
                  href={item.href}
                  className={`aspect-square flex flex-col justify-center items-center bg-white rounded-3xl shadow-sm border border-gray-100 ${item.color} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group w-full`}
                >
                  <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => scrollToSection(item.ref)}
                  className={`aspect-square flex flex-col justify-center items-center bg-white rounded-3xl shadow-sm border border-gray-100 ${item.color} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group w-full`}
                >
                  <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{item.label}</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secciones de Contenido (Manteniendo las refs para Órdenes y Reportes) */}
      <main className="space-y-20 pb-20">
        {/* Nota: La sección de Categorías sigue aquí por si decides no borrarla aún, 
            pero el botón de arriba ya te llevará a la nueva página */}
        <section ref={sectionRefs.categorias} className="min-h-screen bg-white rounded-[3rem] shadow-inner mx-4 py-10">
          <CategoriesSection categories={categories} />
        </section>

        <section ref={sectionRefs.ordenes} className="min-h-screen py-10">
          <OrdersSection />
        </section>

        <section ref={sectionRefs.reportes} className="min-h-screen py-10">
          <ReportsSection />
        </section>
      </main>
    </div>
  );
}