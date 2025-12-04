import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import { Sprout, Shield, TrendingUp } from "lucide-react";
import historicalIpa from "@/assets/historical-ipa.jpg";

const QuemSomos = () => {
  return (
    <div className="min-h-screen bg-sage-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-sage py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            Inovação e Transparência para a Agricultura de Pernambuco.
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            Conheça a plataforma de rastreabilidade do IPA, uma iniciativa para fortalecer o 
            produtor e garantir a qualidade dos alimentos no estado.
          </p>
        </div>
      </section>
      
      {/* Por que criamos */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-4">
            Por que criamos esta plataforma?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Nosso objetivo é criar um ecossistema digital<br />
            que beneficie toda a cadeia produtiva, do campo à mesa.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Sprout}
              title="Valorização no Campo"
              description="Conectamos produtores e compradores, rastreando e comprovando a qualidade de sua produção, da semeadura até a venda."
              iconColor="text-green-600"
            />
            <FeatureCard
              icon={Shield}
              title="Confiança na mesa"
              description="Garantimos a qualidade com a origem dos alimentos, garantindo mais segurança, transparência e confiança."
              iconColor="text-primary"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Gestão com Dados"
              description="Transformamos dados em conhecimento, facilitando políticas públicas mais eficientes para o setor agrícola."
              iconColor="text-blue-icon"
            />
          </div>
        </div>
      </section>
      
      {/* História do IPA */}
      <section className="py-16 bg-sage-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-card rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Uma História de Compromisso com o Campo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-card-foreground">
                <p>
                  Desde 1935, o Instituto Agronômico de Pernambuco (IPA) é a principal 
                  instituição de pesquisa e extensão rural do estado. Por décadas, trabalhamos 
                  ao lado dos agricultores para trazer inovação, conhecimento e desenvolvimento 
                  para todas as regiões de Pernambuco.
                </p>
                <p>
                  Esta plataforma é o próximo passo em nossa missão. Desde 1935, o Instituto 
                  Agronômico de Pernambuco (IPA) é a principal instituição de pesquisa e 
                  extensão rural do estado. Por décadas, trabalhamos ao lado dos agricultores 
                  para trazer inovação, conhecimento e desenvolvimento para todas as regiões 
                  de Pernambuco.
                </p>
                <p className="font-semibold text-primary">
                  Esta plataforma é o próximo passo em nossa missão.
                </p>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src={historicalIpa} 
                  alt="História do IPA desde 1935" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Faça Parte Desta Transformação
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Seja você produtor, gestor de cooperativa ou pesquisador, há um lugar 
            para você em nossa rede.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-8 text-left">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Você é Produtor ou Agricultor?
              </h3>
              <p className="text-card-foreground mb-6">
                Cadastre sua produção, tenha acesso a relatórios e certifique a origem dos 
                seus produtos de forma simples e digital.
              </p>
              <a 
                href="/junte-se#produtor"
                className="inline-block bg-orange-cta text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-cta/90 transition-colors"
              >
                Saiba como cadastrar
              </a>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-8 text-left">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Representa uma Cooperativa?
              </h3>
              <p className="text-card-foreground mb-6">
                Cadastre sua produção, tenha acesso a relatórios e certifique a origem dos 
                seus produtos de forma simples e digital.
              </p>
              <a 
                href="/junte-se#cooperativa"
                className="inline-block bg-orange-cta text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-cta/90 transition-colors"
              >
                Fale com especialista
              </a>
            </div>
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

export default QuemSomos;
