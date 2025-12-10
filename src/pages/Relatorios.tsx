// src/app/pages/Relatorios.tsx
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  Search,
  FileText,
  Plus,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import ReportDialog from "@/components/ReportDialog";

// Tipagem para o relatório vindo do backend
interface RelatorioAuditor {
  id: number;
  auditor: string;
  dataEmissao: string;
  lote: number;
  parecer: string;
  conformidade: "Conforme" | "Não Conforme" | "Em Análise";
  auditorFk: number;
  administradorFk: number;
  dataRecebimentoAdmin: string | null;
  loteSementeFk: number;
}

export default function Relatorios() {
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    tipoRelatorio: "",
    formatoArquivo: "",
    conformidade: "",
  });

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [relatorios, setRelatorios] = useState<RelatorioAuditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para edição e exclusão
  const [editingReport, setEditingReport] = useState<RelatorioAuditor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await fetch("https://elo-rural-backend.onrender.com/relatorio-auditor");
        if (!response.ok) {
          throw new Error("Erro ao buscar relatórios.");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.dados)) {
          setRelatorios(data.dados);
        } else {
          setError("Formato inesperado na resposta do servidor");
        }
      } catch (err) {
        setError("Falha ao carregar os relatórios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  const refetchRelatorios = () => {
    setLoading(true);
    fetch("https://elo-rural-backend.onrender.com/relatorio-auditor")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRelatorios(data.dados);
      })
      .catch((err) => console.error("Erro ao atualizar:", err))
      .finally(() => setLoading(false));
  };

  const handleRowClick = (id: number) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const handleExport = () => {
    if (!selectedReportId || isExporting) {
      if (!selectedReportId) {
        toast({
          title: "Atenção",
          description: "Selecione um relatório na tabela para exportar.",
          variant: "default",
        });
      }
      return;
    }

    setIsExporting(true);
    console.log(`Simulando exportação do Relatório ID: ${selectedReportId}`);

    setTimeout(() => {
      toast({
        title: "Exportação Concluída 🎉",
        description: `Relatório ID ${selectedReportId} exportado como ${
          filters.formatoArquivo.toUpperCase() || "PDF"
        }.`,
        duration: 5000,
        className: "bg-green-500 border-green-600 text-white",
      });

      setSelectedReportId(null);
      setIsExporting(false);
      setFilters({ ...filters, tipoRelatorio: "", formatoArquivo: "" });
    }, 1500);
  };

  // Funções de edição e exclusão (simuladas)
  const handleEdit = (report: RelatorioAuditor) => {
    setEditingReport(report);
  };

  const handleDeleteClick = (id: number) => {
    setReportToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      toast({
        title: "Exclusão Simulada",
        description: `Relatório ID ${reportToDelete} foi excluído.`,
        className: "bg-red-500 text-white border-red-600",
      });
      setRelatorios(relatorios.filter(r => r.id !== reportToDelete));
      setIsDeleteDialogOpen(false);
      setReportToDelete(null);
      if (selectedReportId === reportToDelete) {
        setSelectedReportId(null);
      }
    }
  };

  const saveEdit = () => {
    if (editingReport) {
      toast({
        title: "Edição Simulada",
        description: "Relatório atualizado com sucesso!",
        className: "bg-green-500 text-white border-green-600",
      });
      setRelatorios(
        relatorios.map(r => (r.id === editingReport.id ? editingReport : r))
      );
      setEditingReport(null);
    }
  };

  // Lógica de filtro
  const filteredRelatorios = relatorios.filter((rel) => {
    if (filters.tipoRelatorio && rel.conformidade !== filters.tipoRelatorio) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const isExportButtonDisabled = !selectedReportId || isExporting;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <main className="flex-1 p-8 lg:ml-[110px]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Relatórios e Análises
              </h1>
              <p className="text-muted-foreground mt-2">
                Visualize relatórios detalhados sobre suas operações
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Relatório
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Filtros e Configurações</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoRelatorio">
                      Status / Parecer (Filtro)
                    </Label>
                    <Select
                      value={filters.tipoRelatorio}
                      onValueChange={(value) =>
                        setFilters({ ...filters, tipoRelatorio: value })
                      }
                    >
                      <SelectTrigger id="tipoRelatorio">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conforme">Conforme</SelectItem>
                        <SelectItem value="Não Conforme">
                          Não Conforme
                        </SelectItem>
                        <SelectItem value="Em Análise">Em Análise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formatoArquivo">
                      Formato do arquivo (Para Exportação)
                    </Label>
                    <Select
                      value={filters.formatoArquivo}
                      onValueChange={(value) =>
                        setFilters({ ...filters, formatoArquivo: value })
                      }
                      disabled={isExportButtonDisabled}
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

                  <div className="space-y-2">
                    <Label htmlFor="conformidade">
                      Status de Conformidade (Secundário)
                    </Label>
                    <Select
                      value={filters.conformidade}
                      onValueChange={(value) =>
                        setFilters({ ...filters, conformidade: value })
                      }
                    >
                      <SelectTrigger id="conformidade">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conforme">Conforme</SelectItem>
                        <SelectItem value="Não Conforme">
                          Não Conforme
                        </SelectItem>
                        <SelectItem value="Em Análise">Em Análise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <Button
                    onClick={handleExport}
                    className="bg-[#1a5f1a] hover:bg-[#2a7f2a]"
                    disabled={isExportButtonDisabled}
                  >
                    {isExporting ? (
                      <>
                        <Search className="mr-2 h-4 w-4 animate-spin" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Exportar Relatório (
                        {selectedReportId
                          ? `ID ${selectedReportId}`
                          : "Selecione um"}
                        )
                      </>
                    )}
                  </Button>
                </div>
                {selectedReportId === null && (
                  <p className="text-sm text-yellow-600 mt-1">
                    Selecione uma linha da tabela abaixo para habilitar a
                    exportação.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Relatórios */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Carregando relatórios...</p>
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-8">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : filteredRelatorios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum relatório encontrado
                  </h3>
                  <p className="text-sm max-w-md text-center">
                    {filters.tipoRelatorio
                      ? `Nenhum relatório com status "${filters.tipoRelatorio}".`
                      : "Crie seu primeiro relatório clicando em 'Novo Relatório'."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 w-10"></th>
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Auditor</th>
                        <th className="text-left py-2">Lote</th>
                        <th className="text-left py-2">Conformidade</th>
                        <th className="text-left py-2">Data Emissão</th>
                        <th className="text-left py-2">Parecer</th>
                        <th className="text-left py-2 w-32">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRelatorios.map((rel) => (
                        <tr
                          key={rel.id}
                          onClick={() => handleRowClick(rel.id)}
                          className={`border-b hover:bg-muted/30 cursor-pointer ${
                            selectedReportId === rel.id
                              ? "bg-primary/20 hover:bg-primary/30"
                              : ""
                          }`}
                        >
                          <td className="py-3">
                            {selectedReportId === rel.id && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </td>
                          <td className="py-3">{rel.id}</td>
                          <td className="py-3">{rel.auditor}</td>
                          <td className="py-3">{rel.lote}</td>
                          <td className="py-3">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                rel.conformidade === "Conforme"
                                  ? "bg-green-100 text-green-800"
                                  : rel.conformidade === "Não Conforme"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {rel.conformidade}
                            </span>
                          </td>
                          <td className="py-3">
                            {formatDate(rel.dataEmissao)}
                          </td>
                          <td className="py-3 max-w-xs truncate">
                            {rel.parecer}
                          </td>
                          <td className="py-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(rel);
                              }}
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(rel.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Edição */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg border w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Relatório</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingReport(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>ID</Label>
                  <Input value={editingReport.id} disabled />
                </div>
                <div>
                  <Label>Auditor</Label>
                  <Input
                    value={editingReport.auditor}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, auditor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Data Emissão</Label>
                  <Input
                    type="date"
                    value={editingReport.dataEmissao}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, dataEmissao: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Lote</Label>
                  <Input
                    type="number"
                    value={editingReport.lote}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, lote: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Parecer</Label>
                  <Textarea
                    value={editingReport.parecer}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, parecer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Conformidade</Label>
                  <Select
                    value={editingReport.conformidade}
                    onValueChange={(value: any) =>
                      setEditingReport({ ...editingReport, conformidade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conforme">Conforme</SelectItem>
                      <SelectItem value="Não Conforme">Não Conforme</SelectItem>
                      <SelectItem value="Em Análise">Em Análise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lote Semente FK</Label>
                  <Input
                    type="number"
                    value={editingReport.loteSementeFk}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, loteSementeFk: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEditingReport(null)}>
                  Cancelar
                </Button>
                <Button onClick={saveEdit}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg border p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-2">Confirmar Exclusão</h3>
            <p className="text-muted-foreground mb-4">
              Tem certeza que deseja excluir o relatório ID {reportToDelete}? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de criação */}
      <ReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={refetchRelatorios}
      />
    </div>
  );
}