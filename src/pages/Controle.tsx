import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Thermometer, Droplets } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Controle() {
  const { toast } = useToast();
  
  const [sectors] = useState([
    { id: "A", name: "Setor A", temperature: 22, humidity: 65, status: "normal" },
    { id: "B", name: "Setor B", temperature: 28, humidity: 70, status: "alert" },
    { id: "C", name: "Setor C", temperature: 20, humidity: 60, status: "normal" },
    { id: "D", name: "Setor D", temperature: 24, humidity: 68, status: "normal" },
  ]);

  // Estados para controlar modais
  const [registrarEnvioOpen, setRegistrarEnvioOpen] = useState(false);
  const [registrarLoteOpen, setRegistrarLoteOpen] = useState(false);

  const quickActions = [
    { icon: Package, label: "Registrar Envio", action: () => setRegistrarEnvioOpen(true) },
    { icon: Truck, label: "Registrar Saída", action: () => setRegistrarLoteOpen(true) },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "alert":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "alert":
        return "Alerta";
      case "critical":
        return "Crítico";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Controle de Operações</h1>
            <p className="text-muted-foreground mt-2">Gerencie entregas, análises e manutenções em tempo real</p>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-[#1a5f1a] hover:bg-[#2a7f2a] text-white"
                >
                  <action.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Real-time Monitoring */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Monitoramento em Tempo Real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectors.map((sector) => (
                <Card key={sector.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sector.name}</CardTitle>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(sector.status)}`}>
                        {getStatusBadge(sector.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Temperatura</p>
                        <p className="text-lg font-semibold">{sector.temperature}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Umidade</p>
                        <p className="text-lg font-semibold">{sector.humidity}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Registrar Saída de Lote */}
        <Dialog open={registrarEnvioOpen} onOpenChange={setRegistrarEnvioOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Registrar Saída de Lote</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Selecione um lote existente para registrar a saída.
              </p>
            </DialogHeader>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "Saída registrada!",
                description: "A saída do lote foi registrada com sucesso.",
              });
              setRegistrarEnvioOpen(false);
            }}>
              <div className="space-y-2">
                <Label htmlFor="lote-origem" className="text-sm font-medium">
                  Lote de Sementes (Origem)*
                </Label>
                <Select required>
                  <SelectTrigger id="lote-origem">
                    <SelectValue placeholder="Selecione o Lote..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="ABC123">ABC123 - Saca</SelectItem>
                    <SelectItem value="DEF456">DEF456 - Milho</SelectItem>
                    <SelectItem value="GHI789">GHI789 - Trigo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade-saida" className="text-sm font-medium">
                  Quantidade da Saída*
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="quantidade-saida"
                    type="number"
                    placeholder="Quantidade"
                    required
                    className="flex-1"
                  />
                  <div className="w-16 flex items-center justify-center bg-muted rounded-md text-sm text-muted-foreground">
                    kg
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Disponível: 500 kg</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destino" className="text-sm font-medium">
                  Destino do Lote*
                </Label>
                <Select required>
                  <SelectTrigger id="destino">
                    <SelectValue placeholder="Selecione o destino..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="cooperativa1">Cooperativa Verde</SelectItem>
                    <SelectItem value="cooperativa2">Cooperativa Sul</SelectItem>
                    <SelectItem value="distribuidor1">Distribuidor Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-saida" className="text-sm font-medium">
                  Data de Saída*
                </Label>
                <Input
                  id="data-saida"
                  type="date"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#8B7355] hover:bg-[#7A6248] text-white"
              >
                → Registrar Saída
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal Novo Lote de Sementes */}
        <Dialog open={registrarLoteOpen} onOpenChange={setRegistrarLoteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Novo lote de Sementes</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Entre com suas credenciais para acessar o sistema
              </p>
            </DialogHeader>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "Lote cadastrado!",
                description: "O novo lote foi cadastrado com sucesso.",
              });
              setRegistrarLoteOpen(false);
            }}>
              <div className="space-y-2">
                <Label htmlFor="codigo-lote" className="text-sm font-medium">
                  Código do Lote
                </Label>
                <Input
                  id="codigo-lote"
                  type="text"
                  placeholder="Ex: ABC 123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-semente" className="text-sm font-medium">
                  Tipo de semente
                </Label>
                <Select required>
                  <SelectTrigger id="tipo-semente">
                    <SelectValue placeholder="Selecione o tipo de Semente" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="saca">Saca</SelectItem>
                    <SelectItem value="milho">Milho</SelectItem>
                    <SelectItem value="trigo">Trigo</SelectItem>
                    <SelectItem value="soja">Soja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-sm font-medium">
                  Quantidade*
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Quantidade"
                    required
                    className="flex-1"
                  />
                  <div className="w-16 flex items-center justify-center bg-muted rounded-md text-sm text-muted-foreground">
                    kg
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor" className="text-sm font-medium">
                  Fornecedor/origem
                </Label>
                <Select required>
                  <SelectTrigger id="fornecedor">
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="fazenda1">Fazenda São João</SelectItem>
                    <SelectItem value="fazenda2">Fazenda Bom Sucesso</SelectItem>
                    <SelectItem value="cooperativa1">Cooperativa Verde</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-entrada" className="text-sm font-medium">
                  Data de Entrada
                </Label>
                <Input
                  id="data-entrada"
                  type="date"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#8B7355] hover:bg-[#7A6248] text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Cadastrar Lote
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
