import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Package, FileText, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Rastreamento", path: "/rastreamento" },
  { icon: Package, label: "Controle", path: "/controle" },
  { icon: FileText, label: "Relatórios", path: "/relatorios" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Estado para guardar os dados do usuário real
  const [usuario, setUsuario] = useState({ nome: "Visitante", email: "Sem acesso" });

  // --- EFEITO PARA CARREGAR USUÁRIO ---
  useEffect(() => {
    // Busca os dados que salvamos no Login.tsx
    const dadosSalvos = localStorage.getItem("usuario_logado");
    
    if (dadosSalvos) {
      try {
        const userObj = JSON.parse(dadosSalvos);
        setUsuario(userObj);
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e);
      }
    }
  }, []);

  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Pega a primeira letra do nome para o avatar
  const inicial = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Botão de Menu para Mobile */}
      <button
        className="fixed top-4 left-4 z-[100] p-2 rounded-md bg-[#1a4d2e] text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay de Fundo para Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={cn(
          "bg-[#1a4d2e] min-h-screen flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          "w-[250px] lg:w-[250px]", 
          "transform -translate-x-full lg:translate-x-0",
          isOpen && "translate-x-0"
        )}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="p-6 border-b border-green-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a4d2e] font-bold text-xl">E</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">ELO RURAL</p>
              <p className="text-green-300 text-xs">Rastreabilidade</p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white border-r-4 border-white"
                    : "text-green-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Rodapé do Usuário DINÂMICO */}
        <div className="p-6 border-t border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {/* Mostra a inicial do nome real */}
              <span className="text-[#1a4d2e] text-xs font-semibold">{inicial}</span>
            </div>
            <div className="overflow-hidden">
              {/* Mostra o Nome vindo do Banco */}
              <p className="text-white text-sm font-medium truncate w-[140px]" title={usuario.nome}>
                {usuario.nome}
              </p>
              {/* Mostra o Email ou CPF vindo do Banco */}
              <p className="text-green-300 text-xs truncate w-[140px]" title={usuario.email}>
                {usuario.email || "Administrador"}
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="hidden lg:block lg:w-[170px] flex-shrink-0" />
    </>
  );
};