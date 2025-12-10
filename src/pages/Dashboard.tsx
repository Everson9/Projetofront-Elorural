'use client';

import { useState, useEffect } from 'react';
// IMPORTANTE: Importar useNavigate
import { useNavigate } from "react-router-dom"; 
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Package, Thermometer, Droplets, Clock, CheckCircle2 } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// --- INTERFACES ---
interface Alerta {
  id: number;
  tipo_alerta: "temperatura" | "umidade" | "validade";
  mensagem: string;
  data_emissao: string;
  status: "ativo" | "resolvido";
  lote_fk: number;
}

const monthLabels: Record<string, string> = {
  jan: "Jan", fev: "Fev", mar: "Mar", abr: "Abr", mai: "Mai", jun: "Jun",
  jul: "Jul", ago: "Ago", set: "Set", out: "Out", nov: "Nov", dez: "Dez",
};

const germinationData = [
  { day: 1, rate: 92 }, { day: 2, rate: 93 }, { day: 3, rate: 95 },
  { day: 4, rate: 94 }, { day: 5, rate: 96 }, { day: 6, rate: 95 }, { day: 7, rate: 94 },
];

const Dashboard = () => {
  // HOOK DE NAVEGAÇÃO
  const navigate = useNavigate();

  const [stockData, setStockData] = useState<{ month: string; estoque: number; distribuido: number }[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alerta[]>([]);
  
  const [kpis, setKpis] = useState({
    totalLotes: 0,
    mediaQualidade: 0,
    alertasAtivos: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLotes = await fetch('https://elo-rural-backend.onrender.com/lote');
        const dataLotes = await responseLotes.json();
        const dados = dataLotes.dados || {};

        const mesesOrdenados = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const chartData = mesesOrdenados.map(mes => ({
          month: monthLabels[mes],
          estoque: dados.Estoques ? (dados.Estoques[mes] ?? 0) : 0,
          distribuido: dados.Distribuidos ? (dados.Distribuidos[mes] ?? 0) : 0,
        }));

        const responseAlertas = await fetch('https://elo-rural-backend.onrender.com/api/alertas');
        const dataAlertas: Alerta[] = await responseAlertas.json();

        const ativos = dataAlertas.filter(a => a.status === 'ativo');
        const recentes = [...dataAlertas].sort((a, b) => b.id - a.id).slice(0, 5);

        setStockData(chartData);
        setRecentAlerts(recentes);
        
        setKpis({
          totalLotes: dados.totalLotes || 0,
          mediaQualidade: dados.mediaQualidade || 0,
          alertasAtivos: ativos.length,
        });

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'temperatura': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'umidade': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'validade': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'temperatura': return <Thermometer className="w-4 h-4" />;
      case 'umidade': return <Droplets className="w-4 h-4" />;
      case 'validade': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // FUNÇÃO PARA NAVEGAR LEVANDO O ID
  const handleAlertClick = (alertId: number) => {
    // Vamos para a rota /controle e levamos o ID na "bagagem" (state)
    navigate("/controle", { state: { openAlertId: alertId } });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-[90px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral em tempo real</p>
        </div>

        {/* CARDS DE KPI (MANTIDOS IGUAIS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1a4d2e] text-white border-none">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-green-100 opacity-80">Total de Lotes</CardTitle></CardHeader>
            <CardContent><div className="flex items-center justify-between"><p className="text-3xl font-bold">{loading ? "..." : kpis.totalLotes}</p><Package className="w-8 h-8 text-green-300 opacity-50" /></div></CardContent>
          </Card>
          <Card className={kpis.alertasAtivos > 0 ? "bg-red-700 text-white border-none" : "bg-[#1a4d2e] text-white border-none"}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-white opacity-80">Alertas Ativos</CardTitle></CardHeader>
            <CardContent><div className="flex items-center justify-between"><p className="text-3xl font-bold">{loading ? "..." : kpis.alertasAtivos}</p><AlertTriangle className="w-8 h-8 text-white opacity-50" /></div></CardContent>
          </Card>
          <Card className="bg-[#1a4d2e] text-white border-none">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-green-100 opacity-80">Qualidade Média</CardTitle></CardHeader>
            <CardContent><div className="flex items-center justify-between"><p className="text-3xl font-bold">{loading ? "..." : kpis.mediaQualidade.toFixed(1)}%</p><TrendingUp className="w-8 h-8 text-green-300 opacity-50" /></div></CardContent>
          </Card>
        </div>

        {/* GRÁFICOS (MANTIDOS IGUAIS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="min-w-0 shadow-sm border border-gray-200">
            <CardHeader><CardTitle className="text-lg">Movimentação de Estoque</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ estoque: { label: "Estoque", color: "#1a4d2e" }, distribuido: { label: "Distribuído", color: "#C5A065" }}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%"><BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} /><ChartTooltip cursor={{fill: '#f3f4f6'}} content={<ChartTooltipContent indicator="dot" />} /><Bar dataKey="estoque" fill="#1a4d2e" radius={[4, 4, 0, 0]} barSize={20} /><Bar dataKey="distribuido" fill="#C5A065" radius={[4, 4, 0, 0]} barSize={20} /></BarChart></ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="min-w-0 shadow-sm border border-gray-200">
            <CardHeader><CardTitle className="text-lg">Taxa de Germinação (7 dias)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ rate: { label: "Taxa (%)", color: "#1a4d2e" } }} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%"><LineChart data={germinationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} /><YAxis domain={[90, 100]} tickLine={false} axisLine={false} fontSize={12} /><ChartTooltip cursor={false} content={<ChartTooltipContent />} /><Line type="monotone" dataKey="rate" stroke="#1a4d2e" strokeWidth={3} dot={{ fill: "#1a4d2e", r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* --- LISTA DE ALERTAS (AGORA CLICÁVEL) --- */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Alertas Recentes do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando alertas...</p>
            ) : recentAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500 opacity-50" />
                <p>Nenhum alerta registrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    // ADICIONADO: onClick para navegar
                    onClick={() => handleAlertClick(alert.id)}
                    // ADICIONADO: cursor-pointer e hover
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className={`p-2 rounded-full ${getAlertColor(alert.tipo_alerta)} group-hover:scale-110 transition-transform`}>
                      {getAlertIcon(alert.tipo_alerta)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#8B7355] transition-colors">
                          {alert.tipo_alerta.charAt(0).toUpperCase() + alert.tipo_alerta.slice(1)}
                        </p>
                        {alert.status === 'ativo' && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{alert.mensagem}</p>
                    </div>

                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-700">Lote #{alert.lote_fk}</p>
                       <p className="text-xs text-gray-400">
                         {new Date(alert.data_emissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;