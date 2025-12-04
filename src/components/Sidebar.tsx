import { useState } from "react"; // Importação separada do hook useState
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

  // Função para fechar o menu ao clicar em um item (útil em mobile)
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

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
          "w-[250px] lg:w-[250px]", // Largura maior em mobile para melhor toque, e a largura original em desktop
          // Oculta por padrão em mobile e visível em desktop
          "transform -translate-x-full lg:translate-x-0",
          // Mostra quando isOpen é true em mobile
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
                onClick={handleLinkClick} // Adiciona o fechamento do menu ao clicar
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

        {/* Rodapé do Usuário */}
        <div className="p-6 border-t border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a4d2e] text-xs font-semibold">U</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Usuário</p>
              <p className="text-green-300 text-xs">operador</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Adiciona um espaço de padding no corpo da página para evitar que o conteúdo fique por baixo da sidebar em desktop */}
      <div className="hidden lg:block lg:w-[170px] flex-shrink-0" />
    </>
  );
};