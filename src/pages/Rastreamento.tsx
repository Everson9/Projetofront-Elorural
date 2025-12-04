import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, TrendingUp, CheckCircle2, Download, History } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const batches = [
  { 
    id: "ABC123", 
    type: "Saca", 
    quantity: "500kg", 
    quality: "95%", 
    status: "Em Entrega", 
    statusColor: "bg-green-500",
    producer: "Fazenda São João",
    entryDate: "30/04/2024",
    location: "SETOR A-1"
  },
  { 
    id: "DEF456", 
    type: "Milho", 
    product: "Cooperativa Verde", 
    quantity: "750 kg", 
    quality: "33%", 
    status: "Em trânsito", 
    statusColor: "bg-yellow-500",
    producer: "Cooperativa Verde",
    entryDate: "28/04/2024",
    location: "SETOR B-2"
  },
  { 
    id: "GHI789", 
    type: "Trigo", 
    product: "Fazenda Bom Sucesso", 
    quantity: "80 kg", 
    quality: "67%", 
    status: "Entregue", 
    statusColor: "bg-blue-500",
    producer: "Fazenda Bom Sucesso",
    entryDate: "25/04/2024",
    location: "SETOR C-3"
  },
];

const deliveryData = [
  { month: "Jan", delivered: 45 },
  { month: "Fev", delivered: 52 },
  { month: "Mar", delivered: 38 },
  { month: "Abr", delivered: 61 },
  { month: "Mai", delivered: 55 },
  { month: "Jun", delivered: 48 },
];

const steps = [
  { label: "Colheita", status: "completed" },
  { label: "Processamento", status: "completed" },
  { label: "Armazenamento", status: "completed" },
  { label: "Transporte", status: "current" },
  { label: "Entrega", status: "pending" },
];

const Rastreamento = () => {
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsBatch, setDetailsBatch] = useState(batches[0]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rastreamento de Lotes</h1>
          <p className="text-gray-600">Busque e acompanhe o histórico completo dos lotes</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por código, lote, quant..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-[#1a4d2e] hover:bg-[#145025] text-white">
              Filtros Avançados
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Resultados da Busca (3)</h2>
            <div className="space-y-3">
              {batches.map((batch) => (
                <Card
                  key={batch.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBatch.id === batch.id ? "ring-2 ring-[#1a4d2e]" : ""
                  }`}
                  onClick={() => setSelectedBatch(batch)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{batch.id}</p>
                        <p className="text-sm text-gray-600">Tipo: {batch.type}</p>
                        {batch.product && (
                          <p className="text-sm text-gray-600">Produto: {batch.product}</p>
                        )}
                      </div>
                      <Badge
                        className={`${batch.statusColor} text-white`}
                      >
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">Quantidade: {batch.quantity}</p>
                      <p className="text-gray-600">Qualidade: {batch.quality}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsBatch(batch);
                        setDetailsOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Seleção vazio</h2>
            {selectedBatch ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Status do Pedido - {selectedBatch.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#1a4d2e"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${75 * 3.52} ${100 * 3.52}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-[#1a4d2e]">75%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Seu pedido está em transporte
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Histórico das Entregas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        delivered: { label: "Entregas", color: "#8B7355" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deliveryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="delivered" fill="#8B7355" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Etapas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.status === "completed"
                                ? "bg-[#1a4d2e] text-white"
                                : step.status === "current"
                                ? "bg-orange-cta text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {step.status === "completed" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                step.status === "pending"
                                  ? "text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {step.label}
                            </p>
                            {step.status === "current" && (
                              <Progress value={60} className="h-2 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Selecione um lote para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>

        {/* Dialog de Detalhes do Lote */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Detalhes do Lote {detailsBatch.id}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-4">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Código</p>
                    <p className="font-medium">{detailsBatch.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <p className="font-medium">{detailsBatch.type}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quantidade</p>
                    <p className="font-medium">{detailsBatch.quantity}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className="bg-green-500 text-white">
                      {detailsBatch.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Produtor</p>
                    <p className="font-medium">{detailsBatch.producer}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data entrada</p>
                    <p className="font-medium">{detailsBatch.entryDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Qualidade</p>
                  <p className="text-sm font-medium">{detailsBatch.quality}</p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-muted-foreground mb-2">Taxa de Germinação</p>
                  <Progress 
                    value={parseInt(detailsBatch.quality)} 
                    className="h-3"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Localização</p>
                <p className="font-medium">{detailsBatch.location}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => console.log("Exportar histórico")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Histórico
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => console.log("Ver movimentação")}
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver movimentação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Rastreamento;
