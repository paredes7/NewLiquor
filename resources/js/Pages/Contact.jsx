import React from 'react';
import Layout from '@/Layouts/MainLayout'; 
import { Head } from '@inertiajs/react';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export default function Contact() {
  // --- DATOS FUNCIONALES ---
  const whatsappNumber = "59174618956"; // Formato internacional para Bolivia
  const emailAddress = "diegoherrera4900@gmail.com";
  const message = "¡Hola! Me gustaria hacer una consulta.";
  
  // URL generada para WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Layout title="Contacto | Tu Licorería">
      <Head title="Contáctanos" />
      
      <div className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Atención al Cliente
          </h1>
          <p className="text-gray-500 mb-12">
            Nuestro equipo está listo para ayudarte a encontrar el licor perfecto.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Tarjeta de WhatsApp */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
              <MessageCircle className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-black">WhatsApp Directo</h3>
              <p className="text-gray-600 mb-6 text-sm">Respuesta rápida para pedidos y stock en Bolivia.</p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-green-600 transition-colors"
              >
                Escríbenos ahora
              </a>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-6 p-8">
              {/* Teléfono */}
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-lg text-white"><Phone size={20}/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Llámanos</p>
                  <a href="tel:+59174618956" className="text-black font-medium hover:text-red-700 transition-colors">
                    +591 74618956
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-lg text-white"><Mail size={20}/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                  <a href={`mailto:${emailAddress}`} className="text-black font-medium hover:text-red-700 transition-colors">
                    {emailAddress}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}