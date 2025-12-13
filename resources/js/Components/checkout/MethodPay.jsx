'use client';
import React from "react";

export default function MethodPay({ method, setMethod }) {
    return (
        <div className="bg-white border border-grayCustom rounded-2xl p-6 mb-6 shadow-lg">
            <h3 className="text-darkGray font-bold text-2xl mb-5 border-b border-grayCustom pb-3">
                Método de Pago
            </h3>

            {/* Transferencia Bancaria */}
            <div className="mb-4">
                <label
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setMethod("transfer")}
                >
                    <input
                        type="radio"
                        value="transfer"
                        checked={method === "transfer"}
                        readOnly
                        className="w-5 h-5 text-turquoise accent-turquoise"
                    />
                    <span className="text-darkGray font-medium">
                        Transferencia Bancaria
                    </span>
                </label>

                <div
                    className={`mt-3 border border-grayCustom rounded-xl bg-gray-50 overflow-hidden transition-all duration-500 ease-out ${method === "transfer" ? "max-h-[500px]" : "max-h-0"
                        }`}
                >
                    <div className="p-5 space-y-3">
                        <p className="text-darkGray font-semibold text-lg flex items-center gap-2">
                            Realiza tu pago en nuestra cuenta bancaria:
                        </p>

                        <p className="text-darkGray font-bold text-xl">
                            3000194483 (BNB) – ETHERNITA SRL
                        </p>

                        <p className="text-grayCustom text-sm leading-relaxed">
                            Por favor, usa el número del pedido como referencia de pago.<br />
                            Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pago por QR */}
            <div className="mb-4">
                <label
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setMethod("qr")}
                >
                    <input
                        type="radio"
                        value="qr"
                        checked={method === "qr"}
                        readOnly
                        className="w-5 h-5 text-turquoise accent-turquoise"
                    />
                    <span className="text-darkGray font-medium">
                        Pago por QR
                    </span>
                </label>

                <div
                    className={`mt-3 border border-grayCustom rounded-xl bg-gray-50 text-center overflow-hidden transition-all duration-500 ease-out ${method === "qr" ? "max-h-[500px]" : "max-h-0"
                        }`}
                >
                    <div className="p-5 space-y-4">
                        <p className="text-darkGray font-semibold text-lg flex justify-center items-center gap-2">
                            Escanea el siguiente código QR:
                        </p>

                        <img
                            src="https://res.cloudinary.com/ds2tkqwtr/image/upload/v1765626212/WhatsApp_Image_2025-12-10_at_23.23.41_pdgjqd.jpg"
                            alt="QR de pago"
                            className="w-48 mx-auto rounded-xl shadow-lg"
                        />

                        <p className="text-grayCustom text-sm leading-relaxed">
                            Por favor, usa el número del pedido como referencia de pago.<br />
                            Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
