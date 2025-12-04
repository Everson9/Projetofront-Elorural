import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportDialog = ({ open, onOpenChange }: ReportDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    data_emissao: "",
    lote: "",
    parecer: "",
    conformidade: "",
    data_recebimento: "",
    lote_semente: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.data_emissao || !formData.lote || !formData.parecer || 
        !formData.conformidade || !formData.data_recebimento || !formData.lote_semente) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você faria a integração com o backend
    console.log("Relatório criado:", formData);
    
    toast({
      title: "Relatório criado com sucesso!",
      description: "O relatório foi registrado no sistema.",
    });

    // Limpa o formulário e fecha o dialog
    setFormData({
      data_emissao: "",
      lote: "",
      parecer: "",
      conformidade: "",
      data_recebimento: "",
      lote_semente: "",
    });
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-primary" />
            Novo Relatório
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do relatório de análise
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_emissao">Data de Emissão *</Label>
              <Input
                id="data_emissao"
                type="date"
                value={formData.data_emissao}
                onChange={(e) => handleChange("data_emissao", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_recebimento">Data de Recebimento *</Label>
              <Input
                id="data_recebimento"
                type="date"
                value={formData.data_recebimento}
                onChange={(e) => handleChange("data_recebimento", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lote">Lote *</Label>
              <Input
                id="lote"
                placeholder="Ex: LT-2024-001"
                value={formData.lote}
                onChange={(e) => handleChange("lote", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote_semente">Lote da Semente *</Label>
              <Input
                id="lote_semente"
                placeholder="Ex: LS-2024-001"
                value={formData.lote_semente}
                onChange={(e) => handleChange("lote_semente", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conformidade">Conformidade *</Label>
            <Select
              value={formData.conformidade}
              onValueChange={(value) => handleChange("conformidade", value)}
              required
            >
              <SelectTrigger id="conformidade">
                <SelectValue placeholder="Selecione a conformidade" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="conforme">Conforme</SelectItem>
                <SelectItem value="nao_conforme">Não Conforme</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parecer">Parecer (Descrição do Relatório) *</Label>
            <Textarea
              id="parecer"
              placeholder="Descreva o parecer do relatório..."
              value={formData.parecer}
              onChange={(e) => handleChange("parecer", e.target.value)}
              rows={5}
              required
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Criar Relatório
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;