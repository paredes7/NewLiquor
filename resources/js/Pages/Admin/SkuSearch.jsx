import { useState } from "react";
import ProductCardadmin from "./ProductCardadmin";
export default function SkuSearch({ setResults }) {
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!sku) return;
    setLoading(true);

    try {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const params = new URLSearchParams({ sku });
      const response = await fetch(`/admin/ventas/search-sku?${params.toString()}`, {
        headers: { 'X-CSRF-TOKEN': token }
      });
      const data = await response.json();
      setResults(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        placeholder="Buscar por SKU"
        className="px-4 py-2 border rounded w-full sm:w-1/3"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}
