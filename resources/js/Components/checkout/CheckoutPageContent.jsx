'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/Contexts/CartContext';
import CheckoutHeader from './CheckoutHeader';
import CustomerInfoForm from './CustomerInfo';
import CartItems from './CartItems';
import OrderSummary from './OrderSummary';
import Layout from '@/Layouts/LayoutCheckout';
import { Head, router } from '@inertiajs/react';
import MethodPay from './MethodPay';

export default function CheckoutPageContent() {
    const { cart = [], subtotal = 0, total = 0 } = useCart();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerMail, setCustomerMail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('transfer');

    useEffect(() => {
        if (cart.length > 0) setLoading(false);
    }, [cart]);

    const handlePlaceOrder = () => {
        if (!customerName.trim() || !customerPhone.trim()) {
            alert("Debes ingresar tu nombre y número de teléfono.");
            return;
        }
        if (!customerMail.trim()) {
            alert("Debes ingresar tu correo electrónico.");
            return;
        }

        setProcessing(true);

        const orderItems = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.qty,
            price: item.price,
            subtotal: item.price * item.qty,
            sku: item.options.sku,
            size: item.options.size || item.variant || item.options.variant,
        }));

        // Construir mensaje llamativo para WhatsApp
        const messageLines = [
            `🛒 *Nuevo Pedido de ${customerName}*`,
            `📞 Teléfono: ${customerPhone}`,
            `✉️ Correo: ${customerMail}`,
            `💳 Método de pago: ${paymentMethod === 'qr' ? 'QR' : 'Transferencia'}`,
            '',
            '*Detalles del pedido:*'
        ];

        orderItems.forEach(i => {
            messageLines.push(`• ${i.name} | Talla: ${i.size} | SKU: ${i.sku} | Cantidad: ${i.quantity} | Subtotal: $${i.subtotal}`);
        });

        messageLines.push('', `*Total: $${total}*`);

        const whatsappMessage = encodeURIComponent(messageLines.join('\n'));
        const whatsappNumber = "59169791784";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        // Abrir WhatsApp en nueva pestaña primero
        window.open(whatsappURL, '_blank');

        // Registrar pedido en el backend después de abrir WhatsApp
        setTimeout(() => {
            const paymentMethodId = paymentMethod === "qr" ? 1 : 2;

            const orderData = {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerMail,
                payment_method: paymentMethodId,
                cart: orderItems,
                status: 2,
                total,
            };

            router.post('/orders/store', orderData, {
                onError: (errors) => {
                    console.error("Error al crear pedido: ", errors);
                },
                onSuccess: () => {
                    console.log("✅ Pedido registrado en el backend");
                },
                preserveState: true
            });

            setProcessing(false);
        }, 500);
    };

    return (
        <Layout title="Checkout">
            <Head title="Checkout" />

            <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded-2xl shadow-lg border border-gray-300">
                <CheckoutHeader />

                <CustomerInfoForm
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    customerMail={customerMail}
                    setCustomerMail={setCustomerMail}
                    className="mb-6"
                />

                <CartItems cart={cart} loading={loading} subtotal={subtotal} total={total} className="mb-6" />

                <MethodPay method={paymentMethod} setMethod={setPaymentMethod} />

                <OrderSummary cart={cart} subtotal={subtotal} total={total} loading={loading} className="mb-6" />

                <button
                    className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md flex justify-center items-center transition-all duration-300 ${(loading || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePlaceOrder}
                    disabled={loading || processing}
                >
                    {processing && (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )}
                    {processing ? "⏳ Enviando a WhatsApp y registrando..." : " Enviar a WhatsApp y registrar pedido"}
                </button>
            </div>
        </Layout>
    );
}
