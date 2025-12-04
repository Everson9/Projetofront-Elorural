// Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, TrendingDown, Package } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Dados estáticos mantidos apenas para fallback ou carregamento inicial
const germinationData = [
  { day: 1, rate: 92 },
  { day: 2, rate: 93 },
  { day: 3, rate: 95 },
  { day: 4, rate: 94 },
  { day: 5, rate: 96 },
  { day: 6, rate: 95 },
  { day: 7, rate: 94 },
];

const alerts = [
  { id: "ANC123", message: "Temperatura Alta", time: "2 min atrás", color: "bg-red-500" },
  { id: "DEF456", message: "Produto no Vencimento", time: "15 min atrás", color: "bg-yellow-500" },
  { id: "GHI789", message: "Umidade Baixa", time: "1 hora atrás", color: "bg-blue-500" },
];

// Mapeamento de mês abreviado (minúsculo) para nome em "Jan", "Fev", etc.
const monthLabels: Record<string, string> = {
  jan: "Jan",
  fev: "Fev",
  mar: "Mar",
  abr: "Abr",
  mai: "Mai",
  jun: "Jun",
  jul: "Jul",
  ago: "Ago",
  set: "Set",
  out: "Out",
  nov: "Nov",
  dez: "Dez",
};

const Dashboard = () => {
  const [stockData, setStockData] = useState<
    { month: string; estoque: number; distribuido: number }[]
  >([]);
  const [kpis, setKpis] = useState({
    totalLotes: 0,
    mediaQualidade: 0,
    agrifiosCriticos: 3, // mantido fixo por enquanto
    cooperados: 28,      // mantido fixo por enquanto
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch('https://elo-rural-backend.onrender.com/lote'); 
        if (!response.ok) throw new Error('Erro ao buscar lotes');
        const result = await response.json();

        const dados = result.dados;

        // Atualiza KPIs
        setKpis({
          totalLotes: dados.totalLotes,
          mediaQualidade: dados.mediaQualidade,
          agrifiosCriticos: 3, // ou busque de outro endpoint
          cooperados: 28,
        });

        // Monta stockData no formato do Recharts
        const mesesOrdenados = [
          'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
          'jul', 'ago', 'set', 'out', 'nov', 'dez'
        ];

        const chartData = mesesOrdenados.map(mes => ({
          month: monthLabels[mes],
          estoque: dados.Estoques[mes] ?? 0,
          distribuido: dados.Distribuidos[mes] ?? 0,
        }));

        setStockData(chartData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Opcional: definir dados fallback
        setStockData([
          { month: "Jan", estoque: 0, distribuido: 0 },
          { month: "Fev", estoque: 0, distribuido: 0 },
          { month: "Mar", estoque: 0, distribuido: 0 },
          { month: "Abr", estoque: 0, distribuido: 0 },
          { month: "Mai", estoque: 0, distribuido: 0 },
          { month: "Jun", estoque: 0, distribuido: 0 },
          { month: "Jul", estoque: 0, distribuido: 0 },
          { month: "Ago", estoque: 0, distribuido: 0 },
          { month: "Set", estoque: 0, distribuido: 0 },
          { month: "Out", estoque: 0, distribuido: 0 },
          { month: "Nov", estoque: 0, distribuido: 0 },
          { month: "Dez", estoque: 0, distribuido: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLotes();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de rastreabilidade</p>
        </div>

        {/* Cards de KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a4d2e] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-green-100">Total de Lotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{kpis.totalLotes}</p>
                <Package className="w-8 h-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a4d2e] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-green-100">Agrifios Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{kpis.agrifiosCriticos}</p>
                <TrendingDown className="w-8 h-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a4d2e] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-green-100">Taxa de Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{kpis.mediaQualidade.toFixed(1)}%</p>
                <TrendingUp className="w-8 h-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a4d2e] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-green-100">Cooperados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{kpis.cooperados}</p>
                <Users className="w-8 h-8 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="min-w-0 shadow-sm">
            <CardHeader>
              <CardTitle>Estoque vs Distribuição</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  estoque: { label: "Estoque", color: "#1a4d2e" },
                  distribuido: { label: "Distribuído", color: "#8B7355" },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                    <Bar dataKey="estoque" fill="#1a4d2e" radius={4} />
                    <Bar dataKey="distribuido" fill="#8B7355" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="min-w-0 shadow-sm">
            <CardHeader>
              <CardTitle>Taxa de Germinação (7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rate: { label: "Taxa (%)", color: "#1a4d2e" },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={germinationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={12}
                    />
                    <YAxis
                      domain={[90, 100]}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#1a4d2e"
                      strokeWidth={2}
                      dot={{ fill: "#1a4d2e" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className={`w-2 h-2 rounded-full ${alert.color}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Lote {alert.id}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <p className="text-sm text-gray-500 whitespace-nowrap">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;