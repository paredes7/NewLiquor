import { useState, useEffect } from "react";

export default function EditOrderModal({ order, setOrder, onSave, onClose }) {
  const [statuses, setStatuses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Traer los estados y métodos de pago
    fetch("/admin/orders/meta")
      .then((res) => res.json())
      .then((data) => {
        setStatuses(data.statuses);
        setPayments(data.payments);
      })
      .catch((err) => console.error("Error cargando meta:", err));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl overflow-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4">Editar Pedido #{order.id}</h3>

        <div className="grid gap-3">
          <label>
            Estado:
            <select
              className="w-full border rounded px-2 py-1"
              value={order.status_id}
              onChange={(e) =>
                setOrder({ ...order, status_id: parseInt(e.target.value) })
              }
            >
              <option value="">Seleccione estado</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Método Pago:
            <select
              className="w-full border rounded px-2 py-1"
              value={order.payment_method_id}
              onChange={(e) =>
                setOrder({ ...order, payment_method_id: parseInt(e.target.value) })
              }
            >
              <option value="">Seleccione método</option>
              {payments.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha de Entrega:
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={order.delivery_date ? order.delivery_date.split("T")[0] : ""}
              onChange={(e) =>
                setOrder({ ...order, delivery_date: e.target.value })
              }
            />
          </label>

          <label>
            Hora de Entrega:
            <input
              type="time"
              className="w-full border rounded px-2 py-1"
              value={order.delivery_time || ""}
              onChange={(e) =>
                setOrder({ ...order, delivery_time: e.target.value })
              }
            />
          </label>

          <label>
            Total:
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              value={order.total}
              onChange={(e) =>
                setOrder({ ...order, total: parseFloat(e.target.value) })
              }
            />
          </label>

          <label>
            Nota:
            <textarea
              className="w-full border rounded px-2 py-1"
              value={order.note || ""}
              onChange={(e) =>
                setOrder({ ...order, note: e.target.value })
              }
            ></textarea>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
