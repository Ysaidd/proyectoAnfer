import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  // Datos simulados para estadísticas
  const stats = [
    { title: "Usuarios", value: 3, icon: "👥" },
    { title: "Productos", value: 37, icon: "📦" },
    { title: "Ventas", value: 30, icon: "💰" },
  ];

  // Datos simulados para el gráfico de ventas
  const salesData = [
    { month: "Ene", sales: 400 },
    { month: "Feb", sales: 600 },
    { month: "Mar", sales: 750 },
    { month: "Abr", sales: 550 },
    { month: "May", sales: 900 },
  ];

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <p>Bienvenido al panel de administración.</p>

      {/* Sección de estadísticas */}
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card duration-300 cursor-pointer transform hover:scale-105">
            <span className="icon">{stat.icon}</span>
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de ventas */}
      <div className="chart-container">
        <h2>📈 Ventas Mensuales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#321E81" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
