import { useState, useEffect, useMemo } from "react";
// IMPORTANTE: Importar useLocation
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Thermometer, Droplets, Clock, AlertTriangle, 
  Trash2, Pencil, Plus, Save, CheckCircle2, 
  Activity, BarChart3, PieChart
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://elo-rural-backend.onrender.com/api/alertas"; 

interface Alerta {
  id: number;
  tipo_alerta: "temperatura" | "umidade" | "validade";
  mensagem: string;
  data_emissao: string;
  status: "ativo" | "resolvido";
  lote_fk: number;
}

export default function Controle() {
  const { toast } = useToast();
  // HOOK PARA LER O ESTADO DA NAVEGAÇÃO
  const location = useLocation();
  
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  // Controle de Modais
  const [selectedAlert, setSelectedAlert] = useState<Alerta | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    tipo_alerta: "temperatura",
    mensagem: "",
    data_emissao: "",
    status: "ativo",
    lote_fk: ""
  });

  const stats = useMemo(() => {
    const total = alertas.length;
    const ativos = alertas.filter(a => a.status === 'ativo').length;
    const resolvidos = alertas.filter(a => a.status === 'resolvido').length;
    const temperatura = alertas.filter(a => a.tipo_alerta === 'temperatura').length;
    const umidade = alertas.filter(a => a.tipo_alerta === 'umidade').length;
    const validade = alertas.filter(a => a.tipo_alerta === 'validade').length;
    const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;
    return { total, ativos, resolvidos, temperatura, umidade, validade, taxaResolucao };
  }, [alertas]);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setAlertas(data);

        // --- LÓGICA DE ABERTURA AUTOMÁTICA ---
        // Verifica se veio algum ID do Dashboard
        const state = location.state as { openAlertId?: number };
        
        if (state?.openAlertId) {
          // Procura o alerta na lista que acabamos de baixar
          const targetAlert = data.find((a: Alerta) => a.id === state.openAlertId);
          
          if (targetAlert) {
            // Abre o modal
            setSelectedAlert(targetAlert);
            
            // Limpa o estado para não reabrir se der F5
            window.history.replaceState({}, document.title);
          }
        }
        // -------------------------------------

      } else {
        toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Erro API", error);
    }
  };

  // ... RESTO DO CÓDIGO PERMANECE IGUAL (getIcon, getStatusColor, handleSave, handleDelete...)
  // Copie as funções auxiliares e o Return do código anterior, eles não mudam.
  // Vou colocar aqui apenas para garantir que não quebre, mas é igual ao anterior.

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "temperatura": return <Thermometer className="h-5 w-5 text-orange-500" />;
      case "umidade": return <Droplets className="h-5 w-5 text-blue-500" />;
      case "validade": return <Clock className="h-5 w-5 text-purple-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' 
      ? "text-red-700 bg-red-50 border-red-200" 
      : "text-green-700 bg-green-50 border-green-200";
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ tipo_alerta: "temperatura", mensagem: "", data_emissao: new Date().toISOString().split('T')[0], status: "ativo", lote_fk: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (alerta: Alerta) => {
    setEditingId(alerta.id);
    setFormData({
      tipo_alerta: alerta.tipo_alerta,
      mensagem: alerta.mensagem,
      data_emissao: alerta.data_emissao,
      status: alerta.status,
      lote_fk: alerta.lote_fk.toString()
    });
    setSelectedAlert(null);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tipo_alerta: formData.tipo_alerta,
      mensagem: formData.mensagem,
      data_emissao: formData.data_emissao,
      status: formData.status,
      lote_fk: Number(formData.lote_fk)
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        toast({ title: "Sucesso!", description: "Dados atualizados." });
        fetchAlertas();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha na conexão com o Render.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedAlert) return;
    try {
      await fetch(`${API_URL}/${selectedAlert.id}`, { method: "DELETE" });
      setAlertas(prev => prev.filter(a => a.id !== selectedAlert?.id));
      setSelectedAlert(null);
      toast({ title: "Excluído", description: "Registro removido." });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 lg:ml-[90px]">
        <div className="w-full space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-2 border-b">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Monitoramento de Alertas</h1>
              <p className="text-sm text-muted-foreground mt-1">Visão geral das ocorrências operacionais.</p>
            </div>
            <Button onClick={handleOpenCreate} className="bg-[#8B7355] hover:bg-[#7A6349] text-white gap-2 rounded-sm mt-4 md:mt-0">
              <Plus className="w-4 h-4" />
              Novo Alerta
            </Button>
          </div>

          {/* DASHBOARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1a5f1a] text-white border-none rounded-sm shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Total de Ocorrências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.total}</div>
                <p className="text-xs opacity-75 mt-1">Registros no banco de dados</p>
                <div className="mt-4 flex gap-4">
                  <div><span className="text-xl font-bold block">{stats.ativos}</span><span className="text-xs opacity-70">Pendentes</span></div>
                  <div className="w-px bg-white/30 h-8"></div>
                  <div><span className="text-xl font-bold block">{stats.resolvidos}</span><span className="text-xs opacity-70">Resolvidos</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border rounded-sm shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="w-4 h-4" /> Distribuição por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-orange-500"/> Temperatura</span><span className="font-bold">{stats.temperatura}</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{ width: `${stats.total ? (stats.temperatura / stats.total) * 100 : 0}%` }}></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500"/> Umidade</span><span className="font-bold">{stats.umidade}</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-400" style={{ width: `${stats.total ? (stats.umidade / stats.total) * 100 : 0}%` }}></div></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="flex items-center gap-1"><Clock className="w-3 h-3 text-purple-500"/> Validade</span><span className="font-bold">{stats.validade}</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-400" style={{ width: `${stats.total ? (stats.validade / stats.total) * 100 : 0}%` }}></div></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border rounded-sm shadow-sm flex flex-col justify-center relative overflow-hidden">
              <CardHeader className="pb-2 z-10">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <PieChart className="w-4 h-4" /> Taxa de Resolução
                </CardTitle>
              </CardHeader>
              <CardContent className="z-10">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#1a5f1a]">{stats.taxaResolucao}%</span>
                  <span className="text-sm text-muted-foreground mb-2">resolvidos</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Meta: Manter acima de 80%.</p>
              </CardContent>
              <div className="absolute right-0 bottom-0 opacity-10"><CheckCircle2 className="w-32 h-32 text-green-700 -mb-8 -mr-8" /></div>
            </Card>
          </div>

          {/* LISTA */}
          <h2 className="text-lg font-semibold pt-4">Lista Detalhada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {alertas.map((alerta) => (
              <Card 
                key={alerta.id} 
                className="border rounded-sm cursor-pointer bg-white hover:border-gray-400 transition-all relative group"
                onClick={() => setSelectedAlert(alerta)}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    {getIcon(alerta.tipo_alerta)}
                    <span className="font-semibold capitalize text-sm text-foreground">{alerta.tipo_alerta}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase border ${getStatusColor(alerta.status)}`}>{alerta.status}</span>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-sm font-medium line-clamp-2 mb-3 leading-snug">{alerta.mensagem}</CardTitle>
                  <p className="text-xs text-muted-foreground flex justify-between items-center border-t pt-2">
                    <span>Lote: <strong>#{alerta.lote_fk}</strong></span>
                    <span>{new Date(alerta.data_emissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* MODAL DETALHES */}
        <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
          <DialogContent className="max-w-md rounded-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{selectedAlert && getIcon(selectedAlert.tipo_alerta)}<span className="capitalize">{selectedAlert?.tipo_alerta}</span></DialogTitle>
              <DialogDescription>Detalhes da ocorrência #{selectedAlert?.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className={`p-4 rounded-sm border-l-4 ${selectedAlert?.status === 'ativo' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                <h3 className="font-bold text-lg mb-1">Mensagem</h3>
                <p className="text-gray-700 text-sm">{selectedAlert?.mensagem}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-2 bg-muted/30 rounded-sm"><span className="text-muted-foreground block text-xs">Lote</span><span className="font-medium text-base">#{selectedAlert?.lote_fk}</span></div>
                <div className="p-2 bg-muted/30 rounded-sm"><span className="text-muted-foreground block text-xs">Data</span><span className="font-medium text-base">{selectedAlert && new Date(selectedAlert.data_emissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span></div>
              </div>
            </div>
            <DialogFooter className="flex gap-2 sm:justify-between w-full">
              <div className="flex gap-2 w-full">
                <Button variant="destructive" className="flex-1 gap-2 rounded-sm" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Excluir</Button>
                <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm" onClick={() => selectedAlert && handleOpenEdit(selectedAlert)}><Pencil className="h-4 w-4" /> Editar</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL FORMULÁRIO */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md rounded-sm">
            <DialogHeader><DialogTitle>{editingId ? "Editar Alerta" : "Novo Alerta"}</DialogTitle><DialogDescription>Preencha os dados.</DialogDescription></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.tipo_alerta} onValueChange={(val) => setFormData({...formData, tipo_alerta: val})}><SelectTrigger className="rounded-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="temperatura">Temperatura</SelectItem><SelectItem value="umidade">Umidade</SelectItem><SelectItem value="validade">Validade</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>Lote ID</Label><Input className="rounded-sm" type="number" value={formData.lote_fk} onChange={(e) => setFormData({...formData, lote_fk: e.target.value})} required /></div>
              </div>
              <div className="space-y-2"><Label>Mensagem</Label><Textarea className="h-24 rounded-sm" value={formData.mensagem} onChange={(e) => setFormData({...formData, mensagem: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Data</Label><Input className="rounded-sm" type="date" value={formData.data_emissao} onChange={(e) => setFormData({...formData, data_emissao: e.target.value})} required /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}><SelectTrigger className="rounded-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="resolvido">Resolvido</SelectItem></SelectContent></Select>
                </div>
              </div>
              <DialogFooter><Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-sm">Cancelar</Button><Button type="submit" className="bg-[#8B7355] hover:bg-[#7A6349] text-white rounded-sm"><Save className="w-4 h-4 mr-2" /> Salvar</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}