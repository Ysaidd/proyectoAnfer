import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportRange, setReportRange] = useState("month");
  const [year, setYear] = useState(new Date().getFullYear());

  // Configura Axios con la URL base y headers por defecto
  const api = axios.create({
    baseURL: "http://localhost:8000", // Ajusta según tu backend
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
    }
  });

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
      { title: "Total Ventas", value: totalVentas, icon: "💰" },
      { title: "Confirmadas", value: ventasConfirmadas, icon: "✅" },
      { title: "Pendientes", value: ventasPendientes, icon: "⏳" },
      { title: "Monto Total", value: `$${montoTotal.toFixed(2)}`, icon: "💲" }
    ];
  };

  // Generar PDF (mismo estilo que UserProfile)
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
        page.drawText(text, {
          x,
          y,
          size,
          font: isBold ? boldFont : font,
          color: rgb(0, 0, 0)
        });
        y -= size + 6;
      };

      // Encabezado
      await drawText("REPORTE DE VENTAS - TIENDA ANFER", 50, 18, true);
      await drawText(`Generado: ${new Date().toLocaleString()}`);
      await drawText(`Periodo: ${getRangeTitle(reportRange)}`, 50, 14);
      await drawText("");

      // Totales
      const totalVentas = ventasFiltradas.length;
      const totalMonto = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
      
      await drawText("RESUMEN:", 50, 14, true);
      await drawText(`• Ventas: ${totalVentas}`);
      await drawText(`• Monto: $${totalMonto.toFixed(2)}`);
      await drawText("");

      // Detalle
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
        y -= 10; // Espacio extra
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
      <div className="dashboard-loading">
        <p>Cargando datos de ventas...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Panel de Ventas</h1>
        <p>Resumen completo de las ventas del sistema</p>
      </header>

      {/* Estadísticas */}
      <section className="stats-section">
        <h2>📈 Resumen General</h2>
        <div className="stats-grid">
          {getStats().map((stat, i) => (
            <div key={i} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reportes */}
      <section className="reports-section">
        <h2>📋 Generar Reporte</h2>
        <div className="report-controls">
          <select 
            value={reportRange}
            onChange={(e) => setReportRange(e.target.value)}
            className="report-select"
          >
            <option value="week">Semanal</option>
            <option value="month">Mensual</option>
            <option value="year">Anual</option>
          </select>
          <button onClick={generatePDF} className="generate-button">
            Descargar PDF
          </button>
        </div>
      </section>

      {/* Gráfico */}
      <section className="chart-section">
        <div className="chart-header">
          <h2>📅 Ventas por Mes ({year})</h2>
          <select 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="year-select"
          >
            {[2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={prepareChartData()}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
              />
              <Bar dataKey="total" name="Total ($)" fill="#4f46e5" />
              <Bar dataKey="confirmadas" name="Confirmadas" fill="#10b981" />
              <Bar dataKey="pendientes" name="Pendientes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;