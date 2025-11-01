import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import axios from "axios";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportRange, setReportRange] = useState("month");
  const [year, setYear] = useState(new Date().getFullYear());

  // Configura Axios con la URL base y headers por defecto
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
    }
  });

  // Lógica original para obtener los datos, sin modificaciones
  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/sales/");
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Estadísticas calculadas
  const getStats = () => {
    const totalVentas = ventas.length;
    const ventasConfirmadas = ventas.filter(v => v.estado === "confirmada").length;
    const ventasPendientes = ventas.filter(v => v.estado === "pendiente").length;
    const montoTotal = ventas.reduce((sum, venta) => sum + venta.total, 0);

    return [
      { title: "Total Ventas", value: totalVentas, icon: "📊" },
      { title: "Confirmadas", value: ventasConfirmadas, icon: "✅" },
      { title: "Pendientes", value: ventasPendientes, icon: "⏳" },
      { title: "Monto Total", value: `$${montoTotal.toFixed(2)}`, icon: "💰" }
    ];
  };

  // Generar PDF (misma lógica)
    const generatePDF = async () => {
    const ventasFiltradas = filterVentasByRange(reportRange);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 12;
      let y = 780;

      const drawText = async (text, x = 50, size = fontSize, isBold = false) => {
        page.drawText(text, { x, y, size, font: isBold ? boldFont : font, color: rgb(0, 0, 0) });
        y -= size + 6;
      };

      await drawText("REPORTE DE VENTAS - TIENDA ANFER", 50, 18, true);
      await drawText(`Generado: ${new Date().toLocaleString()}`);
      await drawText(`Periodo: ${getRangeTitle(reportRange)}`, 50, 14);
      await drawText("");

      const totalVentas = ventasFiltradas.length;
      const totalMonto = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
      
      await drawText("RESUMEN:", 50, 14, true);
      await drawText(`• Ventas: ${totalVentas}`);
      await drawText(`• Monto: $${totalMonto.toFixed(2)}`);
      await drawText("");

      await drawText("DETALLE DE VENTAS:", 50, 14, true);
      await drawText("----------------------------------------");
      
      for (const venta of ventasFiltradas) {
        await drawText(`COD: ${venta.codigo}`, 50, 12, true);
        await drawText(`Fecha: ${new Date(venta.fecha_creacion).toLocaleDateString()}`);
        await drawText(`Cliente: ${venta.cliente.full_name} (${venta.cliente.cedula})`);
        await drawText(`Estado: ${venta.estado.toUpperCase()}`);
        await drawText(`Total: $${venta.total.toFixed(2)}`);
        await drawText("Productos:");

        for (const detalle of venta.detalles) {
          const prod = detalle.variante.producto;
          await drawText(
            `- ${prod.nombre} (${detalle.variante.color}/${detalle.variante.talla}) x${detalle.cantidad} | $${detalle.precio_unitario.toFixed(2)} c/u`,
            60, 10
          );
        }
        
        await drawText("----------------------------------------");
        y -= 10;
      }

      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `reporte_${reportRange}_${new Date().toISOString().slice(0,10)}.pdf`, "application/pdf");

    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };


  // Filtros por periodo
  const filterVentasByRange = (range) => {
    const now = new Date();
    let startDate;

    switch(range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return ventas;
    }

    return ventas.filter(v => new Date(v.fecha_creacion) >= startDate);
  };

  // Datos para gráfico
  const prepareChartData = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    return months.map((month, i) => {
      const ventasMes = ventas.filter(v => 
        new Date(v.fecha_creacion).getMonth() === i && 
        new Date(v.fecha_creacion).getFullYear() === year
      );
      
      return {
        month,
        total: ventasMes.reduce((sum, v) => sum + v.total, 0),
        confirmadas: ventasMes.filter(v => v.estado === "confirmada").length,
        pendientes: ventasMes.filter(v => v.estado === "pendiente").length
      };
    });
  };

  const getRangeTitle = (range) => {
    const options = { week: 'Semana', month: 'Mes', year: 'Año' };
    return options[range] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-600">Cargando datos de ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">📊 Panel de Ventas</h1>
          <p className="mt-1 text-md text-gray-600">Resumen completo de las ventas del sistema.</p>
        </header>

        {/* Estadísticas */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getStats().map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
                <div className="text-3xl bg-blue-100 p-3 rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contenedor para Reportes y Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna de Reportes */}
          <section className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Generar Reporte</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="reportRange" className="block text-sm font-medium text-gray-700 mb-1">Periodo del Reporte</label>
                <select 
                  id="reportRange"
                  value={reportRange}
                  onChange={(e) => setReportRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="week">Semanal</option>
                  <option value="month">Mensual</option>
                  <option value="year">Anual</option>
                </select>
              </div>
              <button 
                onClick={generatePDF} 
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Descargar PDF
              </button>
            </div>
          </section>

          {/* Columna del Gráfico */}
          <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">📅 Ventas por Mes</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="year" className="text-sm font-medium text-gray-700">Año:</label>
                <select 
                  id="year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {[2023, 2024, 2025].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={prepareChartData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    formatter={(value, name) => {
                      if (name === 'total') return [`$${value.toFixed(2)}`, 'Monto Total'];
                      return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Monto Total ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="confirmadas" name="Confirmadas" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendientes" name="Pendientes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;