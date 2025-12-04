import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Search, FileText, Plus } from "lucide-react";
import ReportDialog from "@/components/ReportDialog";

export default function Relatorios() {
  // Estados para os filtros
  const [filters, setFilters] = useState({
    tipoRelatorio: "",
    formatoArquivo: "",
  });

  // Estado para o Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = () => {
    console.log("Buscando relatórios com filtros:", filters);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header com Botão de Novo Relatório */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
              <p className="text-muted-foreground mt-2">Visualize relatórios detalhados sobre suas operações</p>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Relatório
            </Button>
          </div>

          {/* Card de Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Filtros e Configurações</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoRelatorio">Qual relatório deseja exportar?</Label>
                    <Select
                      value={filters.tipoRelatorio}
                      onValueChange={(value) => setFilters({ ...filters, tipoRelatorio: value })}
                    >
                      <SelectTrigger id="tipoRelatorio">
                        <SelectValue placeholder="Selecione o relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lotes">Relatório de Lotes</SelectItem>
                        <SelectItem value="qualidade">Relatório de Qualidade</SelectItem>
                        <SelectItem value="movimentacao">Relatório de Movimentação</SelectItem>
                        <SelectItem value="producao">Relatório de Produção</SelectItem>
                        <SelectItem value="estoque">Relatório de Estoque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formatoArquivo">Formato do arquivo</Label>
                    <Select
                      value={filters.formatoArquivo}
                      onValueChange={(value) => setFilters({ ...filters, formatoArquivo: value })}
                    >
                      <SelectTrigger id="formatoArquivo">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <Button onClick={handleSearch} className="bg-[#1a5f1a] hover:bg-[#2a7f2a]">
                    <Search className="mr-2 h-4 w-4" />
                    Exportar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Área de Resultados / Empty State */}
          <Card className="min-h-[400px]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhum relatório selecionado</h3>
                <p className="text-sm max-w-md text-center">
                  Selecione o tipo de relatório acima ou crie um novo relatório clicando no botão "Novo Relatório".
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Componente do Dialog (fica fora do fluxo visual, mas dentro do componente) */}
      <ReportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}