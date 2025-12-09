import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
// ✨ CORREÇÃO AQUI: Adicionei o 'Link' na importação
import { useNavigate, Link } from "react-router-dom"; 
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-28 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-2">Seção de configurações</p>
          </div>

          {/* Logout Button */}
          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-[#8B4513] hover:bg-[#A0522D]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair do Sistema
            </Button>
            
            {/* Botão de Login (Link) */}
            <div className="flex gap-2">
              <Button variant="default" size="sm" asChild>
                <Link to="/cadastro">Cadastrar Produção</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}