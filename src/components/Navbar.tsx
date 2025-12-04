import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Power className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">ELO RURAL</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/junte-se" className="text-foreground hover:text-primary font-medium transition-colors">
            Junte-se a nós
          </Link>
          <Link to="/quem-somos" className="text-foreground hover:text-primary font-medium transition-colors">
            Quem somos nós
          </Link>
          
          <div className="flex gap-2">
            <Button variant="default" size="sm" asChild>
              <Link to="/login">LOGIN</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
