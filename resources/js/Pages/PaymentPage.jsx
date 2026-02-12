import React, { useState } from 'react';
import Layout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { QrCode, CreditCard, Send, User, MapPin, Phone } from 'lucide-react';

export default function PaymentPage({ cuenta, total }) {
    // 1. Estado para el método de pago (QR por defecto)
    const [method, setMethod] = useState('qr');

    // 2. Estado para los datos del cliente
    const [form, setForm] = useState({
        nombre: '',
        celular: '',
        direccion: '',
        referencia: ''
    });

    // Manejador de cambios en inputs
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 3. Función para enviar a WhatsApp
    const handleConfirm = () => {
        const adminNumber = "59174618956"; // Tu número
        const metodoTexto = method === 'qr' ? 'Pago con QR' : 'Transferencia Bancaria';
        
        const mensaje = `¡Hola! Quiero confirmar mi pedido:
*Cliente:* ${form.nombre}
*Monto:* ${total} BS
*Método:* ${metodoTexto}
*Celular:* ${form.celular}
*Ubicación:* ${form.direccion}
*Ref:* ${form.referencia}`;

        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <Layout title="Finalizar Pago">
            <Head title="Pago y Datos de Envío" />

            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 text-center">
                        Finalizar Pedido
                    </h1>

                    <div className="grid md:grid-cols-1 gap-8">
                        {/* SECCIÓN 1: DATOS DEL CLIENTE */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <User size={20} /> Datos de Entrega
                            </h3>
                            <div className="space-y-4">
                                <input 
                                    name="nombre" placeholder="Nombre Completo" 
                                    className="w-full p-3 border rounded-xl" onChange={handleChange} 
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        name="celular" placeholder="WhatsApp" 
                                        className="w-full p-3 border rounded-xl" onChange={handleChange} 
                                    />
                                    <div className="bg-gray-100 p-3 rounded-xl font-bold text-center">
                                        Total: {total} BS
                                    </div>
                                </div>
                                <input 
                                    name="direccion" placeholder="Dirección Exacta" 
                                    className="w-full p-3 border rounded-xl" onChange={handleChange} 
                                />
                                <input 
                                    name="referencia" placeholder="Referencia (Ej: Casa portón verde)" 
                                    className="w-full p-3 border rounded-xl" onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* SECCIÓN 2: MÉTODOS DE PAGO (Lado a lado) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6">Selecciona tu método de pago</h3>
                            <div className="flex gap-4 mb-8">
                                <button 
                                    onClick={() => setMethod('qr')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'qr' ? 'border-black bg-gray-50' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <QrCode size={24} /> <span className="text-xs font-bold uppercase">QR Directo</span>
                                </button>
                                <button 
                                    onClick={() => setMethod('transfer')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'transfer' ? 'border-black bg-gray-50' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <CreditCard size={24} /> <span className="text-xs font-bold uppercase">Transferencia</span>
                                </button>
                            </div>

                            {/* Detalle dinámico del pago */}
                            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                {method === 'qr' ? (
                                    <div className="text-center italic text-gray-500">
                                        {cuenta?.qr_image_path ? (
                                            <img src={cuenta.qr_image_path} className="mx-auto" />
                                        ) : (
                                            "Imagen de QR no disponible todavía."
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm space-y-1">
                                        <p className="font-bold text-gray-400 text-xs uppercase">Cuenta para depósito:</p>
                                        <p className="text-lg font-black">{cuenta?.bank_name}</p>
                                        <p className="font-mono text-lg">{cuenta?.account_number}</p>
                                        <p className="text-gray-600">Titular: {cuenta?.owner_name}</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleConfirm}
                                className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                            >
                                <Send size={18} /> Confirmar por WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}