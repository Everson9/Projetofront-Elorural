import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package, TrendingUp, CheckCircle2, Truck, Clock, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// URL da API
// Comente a linha de baixo se for subir pro Render
// const API_URL = "https://elo-rural-backend.onrender.com/api/rastreio";
const API_URL = "https://elo-rural-backend.onrender.com/api/rastreio"; // Rodando Local

interface RastreamentoData {
  id: number;
  cod_rastreio: string;
  status_entrega: string;
  data_envio: string;
  data_recebimento: string | null;
  entrega_fk: number;
}

const monthLabels: Record<number, string> = {
  0: "Jan", 1: "Fev", 2: "Mar", 3: "Abr", 4: "Mai", 5: "Jun",
  6: "Jul", 7: "Ago", 8: "Set", 9: "Out", 10: "Nov", 11: "Dez"
};

const Rastreamento = () => {
  const [items, setItems] = useState<RastreamentoData[]>([]);
  const [filteredItems, setFilteredItems] = useState<RastreamentoData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Controle de Seleção
  const [selectedItem, setSelectedItem] = useState<RastreamentoData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // --- BUSCAR DADOS ---
  useEffect(() => {
    fetchRastreios();
  }, []);

  const fetchRastreios = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
        if (data.length > 0) setSelectedItem(data[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar rastreios", error);
    }
  };

  // --- FILTRO DE BUSCA ---
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = items.filter(item => 
      item.cod_rastreio.toLowerCase().includes(lower) ||
      item.status_entrega.toLowerCase().includes(lower) ||
      item.entrega_fk.toString().includes(lower)
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  // --- CÁLCULO DO GRÁFICO (Entregas por Mês) ---
  const chartData = useMemo(() => {
    const stats: Record<string, number> = {};
    
    items.forEach(item => {
      // Só conta se foi entregue e tem data
      if (item.data_recebimento) {
        const date = new Date(item.data_recebimento);
        const monthKey = monthLabels[date.getMonth()]; // Ex: "Ago"
        stats[monthKey] = (stats[monthKey] || 0) + 1;
      }
    });

    return Object.keys(stats).map(key => ({
      month: key,
      delivered: stats[key]
    }));
  }, [items]);

  // --- HELPERS VISUAIS ---
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("entregue")) return "bg-green-600 hover:bg-green-700";
    if (s.includes("trânsito")) return "bg-blue-600 hover:bg-blue-700";
    if (s.includes("preparando")) return "bg-yellow-600 hover:bg-yellow-700";
    if (s.includes("atrasado")) return "bg-red-600 hover:bg-red-700";
    return "bg-gray-600";
  };

  const getProgressValue = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("preparando")) return 25;
    if (s.includes("trânsito")) return 60;
    if (s.includes("entregue")) return 100;
    return 50; // Atrasado ou outro
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Pendente";
    return new Date(dateString).toLocaleDateString("pt-BR", { 
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rastreamento de Lotes</h1>
          <p className="text-gray-600">Acompanhe o status logístico das entregas</p>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por código de rastreio..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* COLUNA ESQUERDA: LISTA */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex justify-between">
              <span>Remessas ({filteredItems.length})</span>
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  // --- ALTERAÇÃO DE COR AQUI (bg-green-50) ---
                  className={`cursor-pointer transition-all hover:shadow-md border-l-4 mb-3 bg-green-50 hover:bg-green-100 ${
                    selectedItem?.id === item.id 
                      ? "ring-2 ring-[#1a4d2e] border-l-[#1a4d2e] bg-green-100" 
                      : "border-l-transparent"
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{item.cod_rastreio}</p>
                        <p className="text-sm text-gray-600">Entrega vinculada: #{item.entrega_fk}</p>
                      </div>
                      <Badge className={`${getStatusColor(item.status_entrega)} text-white border-none`}>
                        {item.status_entrega}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Enviado em</p>
                        <p className="text-gray-700">{formatDate(item.data_envio)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Previsão/Chegada</p>
                        <p className="font-medium text-gray-900">{formatDate(item.data_recebimento)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1 text-gray-500">
                            <span>Progresso</span>
                            <span>{getProgressValue(item.status_entrega)}%</span>
                        </div>
                        {/* Barra de progresso com fundo branco para contraste */}
                        <Progress value={getProgressValue(item.status_entrega)} className="h-2 bg-white" />
                    </div>

                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setDetailsOpen(true);
                        }}
                        className="text-xs text-[#1a4d2e] font-bold mt-3 hover:underline"
                    >
                        Ver Detalhes Completos →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA: DETALHES + GRÁFICO */}
          <div className="space-y-6">
            
            {/* CARD DETALHES RÁPIDOS */}
            {selectedItem ? (
               <Card className="border-t-4 border-t-[#1a4d2e]">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Package className="w-5 h-5" />
                     Detalhes do Rastreio
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${getStatusColor(selectedItem.status_entrega)} bg-opacity-10 text-white`}>
                            {selectedItem.status_entrega === 'Entregue' && <CheckCircle2 className="w-10 h-10" />}
                            {selectedItem.status_entrega === 'Em Trânsito' && <Truck className="w-10 h-10" />}
                            {selectedItem.status_entrega === 'Preparando Envio' && <Package className="w-10 h-10" />}
                            {selectedItem.status_entrega === 'Atrasado' && <AlertCircle className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-bold text-[#1a4d2e]">{selectedItem.status_entrega}</h3>
                        <p className="text-gray-500 text-sm mt-1">{selectedItem.cod_rastreio}</p>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Data de Envio</p>
                                <p className="text-sm text-gray-600">{formatDate(selectedItem.data_envio)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-gray-600"/>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Data de Recebimento</p>
                                <p className="text-sm text-gray-600">{formatDate(selectedItem.data_recebimento)}</p>
                            </div>
                        </div>
                    </div>
                 </CardContent>
               </Card>
            ) : (
                <div className="h-64 flex items-center justify-center border rounded bg-white text-gray-400">
                    Selecione um item para ver detalhes
                </div>
            )}

            {/* GRÁFICO DE ENTREGAS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Histórico de Entregas Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="delivered" name="Entregues" fill="#8B7355" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* MODAL DETALHADO */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Rastreio: {selectedItem?.cod_rastreio}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Status Atual</p>
                    <p className={`text-lg font-bold ${selectedItem?.status_entrega === 'Atrasado' ? 'text-red-600' : 'text-[#1a4d2e]'}`}>
                        {selectedItem?.status_entrega}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">ID da Entrega</p>
                        <p className="font-medium">#{selectedItem?.entrega_fk}</p>
                    </div>
                    <div>
                         <p className="text-sm text-gray-500">Código</p>
                         <p className="font-medium">{selectedItem?.cod_rastreio}</p>
                    </div>
                </div>
                {selectedItem?.status_entrega === 'Em Trânsito' && (
                    <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm">
                        🚚 Este produto está a caminho. A previsão de chegada depende das condições da estrada.
                    </div>
                )}
            </div>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default Rastreamento;