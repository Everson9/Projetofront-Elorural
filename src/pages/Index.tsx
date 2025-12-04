import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import deliveryTruck from "@/assets/delivery-truck.png";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-primary mb-6 leading-tight">
              Rastreabilidade dos seus envios aqui!
            </h1>
            <p className="text-muted-foreground mb-8">
              Transparência e confiança em todas suas remessas.
            </p>
            
            <div className="flex gap-2 max-w-md">
              <Input 
                placeholder="Cole seu código de rastreio aqui" 
                className="flex-1"
              />
              <Button variant="default" size="lg">
                <Search className="w-4 h-4" />
                RASTREAR
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img 
              src={deliveryTruck} 
              alt="Rastreamento de envios" 
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>
      
      {/* Status Section */}
      <section className="bg-sage-light py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Status do Pedido */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">
                Status do Pedido
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.06)}`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">6%</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Histórico das Entregas */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">
                Histórico das Entregas
              </h3>
              <div className="h-32 flex items-end gap-2">
                {[20, 35, 45, 60, 75, 85, 95, 100].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </Card>
            
            {/* Etapas */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">
                Etapas
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Pedido confirmado</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Em transporte</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">chegou</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Elotech Sistema de Rastreabilidade de Sementes. Desenvolvido para Powered Agritech
        </div>
      </footer>
    </div>
  );
};

export default Index;
