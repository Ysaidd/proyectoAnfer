import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

const UserProfile = () => {
  const { cedula } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cedula) return;

    const fetchVentas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://localhost:8000/sales/by-cedula/${cedula}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al cargar las ventas");
        const data = await response.json();
        setVentas(data);
        if (data.length > 0) {
          setCliente(data[0].cliente);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [cedula]);

  const handleGeneratePDF = async (venta) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = 680;

    const drawText = (text, x = 50, size = fontSize) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
      y -= size + 6;
    };

    drawText("TIENDA ANFER", 50, 18);
    drawText(`Fecha: ${new Date(venta.fecha_creacion).toLocaleString()}`);
    drawText(`Código: #${venta.codigo}`);
    drawText(`Cliente: ${venta.cliente.full_name}`);
    drawText(`Cédula: ${venta.cliente.cedula}`);
    drawText("");

    drawText("Productos:");
    drawText("--------------------------------------------------");

    venta.detalles.forEach((detalle) => {
      const nombre = detalle.variante.producto.nombre
        .substring(0, 20)
        .padEnd(20);
      const talla = detalle.variante.talla.padEnd(5);
      const color = detalle.variante.color.padEnd(7);
      const cantidad = String(detalle.cantidad).padEnd(5);
      const precio = `$${detalle.precio_unitario.toFixed(2)}`.padEnd(8);
      const totalItem = `$${(detalle.precio_unitario * detalle.cantidad).toFixed(
        2
      )}`;
      drawText(
        `${nombre} T:${talla} C:${color} Cant:${cantidad} P.Unit:${precio} Total:${totalItem}`
      );
    });

    drawText("--------------------------------------------------");
    drawText(`TOTAL: $${venta.total.toFixed(2)}`, 50, 14);
    drawText("Gracias por su compra.");
    drawText("Presentar este recibo para cambios.");

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, `Recibo_${venta.codigo}.pdf`, "application/pdf");
  };

  if (!cedula) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="text-lg font-semibold">
          ⚠️ No estás registrado. Por favor, inicia sesión para continuar.
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10 text-lg font-medium">
        Cargando perfil...
      </p>
    );
  if (error)
    return (
      <p className="text-red-600 text-center mt-10 text-lg font-medium">{error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Perfil de Usuario</h2>

      {cliente ? (
        <div className="mb-8 space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Nombre:</span> {cliente.full_name}
          </p>
          <p>
            <span className="font-semibold">Correo:</span> {cliente.email}
          </p>
          <p>
            <span className="font-semibold">Cédula:</span> {cliente.cedula}
          </p>
        </div>
      ) : (
        <p className="text-gray-600 italic">No hay datos de usuario disponibles.</p>
      )}

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Historial de Ventas</h3>
      {ventas.length === 0 ? (
        <p className="text-gray-600 italic">No hay ventas registradas.</p>
      ) : (
        <div className="space-y-6">
          {ventas.map((venta) => (
            <div
              key={venta.id}
              className="border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p>
                    <span className="font-semibold">Código:</span> {venta.codigo}
                  </p>
                  <p>
                    <span className="font-semibold">Fecha:</span>{" "}
                    {new Date(venta.fecha_creacion).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleGeneratePDF(venta)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Descargar PDF
                </button>
              </div>

              <p className="font-semibold mb-1">Estado: {venta.estado}</p>
              <p className="font-semibold mb-2 text-lg">Total: ${venta.total.toFixed(2)}</p>

              <div>
                <p className="font-semibold mb-2">Productos:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {venta.detalles.map((detalle) => (
                    <li key={detalle.id} className="text-sm">
                      <span className="font-medium">{detalle.variante.producto.nombre}</span> - Talla{" "}
                      {detalle.variante.talla}, Color {detalle.variante.color} | Cantidad:{" "}
                      {detalle.cantidad} | Precio Unitario: $
                      {detalle.precio_unitario.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
