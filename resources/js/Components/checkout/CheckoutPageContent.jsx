'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/Contexts/CartContext';
import CheckoutHeader from './CheckoutHeader';
import CustomerInfoForm from './CustomerInfo';
import CartItems from './CartItems';
import OrderSummary from './OrderSummary';
import Layout from '@/Layouts/LayoutCheckout';
import { Head } from '@inertiajs/react';
import MethodPay from './MethodPay';

export default function CheckoutPageContent() {
    const { cart = [], subtotal = 0, total = 0 } = useCart();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerMail, setCustomerMail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('transfer');

    // Modal  WhatsApp
    const [showSuccess, setShowSuccess] = useState(false);
    const [whatsappURL, setWhatsappURL] = useState('');

    useEffect(() => {
        if (cart.length > 0) setLoading(false);
    }, [cart]);

    const handlePlaceOrder = async () => {
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
            size: item.options.variant,
        }));

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

        try {
            const response = await fetch('/orders/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        .content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el pedido');
            }

            const data = await response.json();
            const orderId = data.order_id;

            const messageLines = [
                ` *Nuevo Pedido #${orderId}*`,
                ` Cliente: ${customerName}`,
                ` Teléfono: ${customerPhone}`,
                ` Correo: ${customerMail}`,
                ` Método de pago: ${paymentMethod === 'qr' ? 'QR' : 'Transferencia'}`,
                '',
                '*Detalles del pedido:*'
            ];

            orderItems.forEach(i => {
                messageLines.push(
                    `• ${i.name} | Talla: ${i.size} | SKU: ${i.sku} | Cant: ${i.quantity} | Subtotal: $${i.subtotal}`
                );
            });

            messageLines.push('', ` *Total: $${total}*`);

            const url = `https://wa.me/56978843627?text=${encodeURIComponent(messageLines.join('\n'))}`;

            setWhatsappURL(url);
            setShowSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al crear el pedido");
        } finally {
            setProcessing(false);
        }
    };

    // Abrir WhatsApp y redirigir automáticamente
    useEffect(() => {
        if (showSuccess && whatsappURL) {
            const timer = setTimeout(() => {
                window.open(whatsappURL, '_blank');
                window.location.href = '/';
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showSuccess, whatsappURL]);

    return (
        <Layout title="Checkout">
            <Head title="Checkout" />

            <div className="max-w-3xl mx-auto p-6 bg-white text-grayCustom rounded-2xl shadow-lg border border-gray-200">
                <CheckoutHeader className="text-turquoise mb-4" />

                <CustomerInfoForm
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    customerMail={customerMail}
                    setCustomerMail={setCustomerMail}
                    className="mb-6 bg-darkGray/10 rounded-lg p-4"
                />

                <CartItems
                    cart={cart}
                    loading={loading}
                    subtotal={subtotal}
                    total={total}
                    className="mb-6 bg-turquoise/10 rounded-lg p-4"
                />

                <MethodPay
                    method={paymentMethod}
                    setMethod={setPaymentMethod}
                    className="mb-6"
                />

                <OrderSummary
                    cart={cart}
                    subtotal={subtotal}
                    total={total}
                    loading={loading}
                    className="mb-6 bg-darkTurquoise/10 rounded-lg p-4"
                />

                <button
                    className={`w-full bg-turquoise hover:bg-darkTurquoise text-white font-bold py-3 px-6 rounded-lg shadow-md flex justify-center items-center transition-all duration-300 ${(loading || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePlaceOrder}
                    disabled={loading || processing}
                >
                    {processing && (
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    )}
                    {processing ? " Registrando pedido..." : "Confirmar pedido"}
                </button>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            ¡Pedido creado!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Tu pedido fue registrado correctamente.<br />
                            En unos segundos se abrirá WhatsApp.
                        </p>
                        <p className="text-sm text-gray-400">
                            Serás redirigido automáticamente.
                        </p>
                    </div>
                </div>
            )}
        </Layout>
    );
}
