import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sprout, Building2, UserPlus, FileText, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import farmerImage from "@/assets/farmer-phone.jpg";
import officeImage from "@/assets/professional-office.jpg";

const JunteSe = () => {
  const navigate = useNavigate();

  // ✨ MUDANÇA 1: Função para rolar suavemente até a seção
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-light/30 to-sage-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-sage">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conecte-se ao Futuro da Agricultura Pernambucana
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Descubra como nossa plataforma pode conectar sua produção, 
            gestão e impacto. Faça já a migração.
          </p>
        </div>
      </section>

      {/* Para quem é Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold  text-center text-primary mb-12">
            Para quem é a nossa plataforma?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Card Produtor */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:border-primary border-2"
              // ✨ MUDANÇA 2: Chama a função de scroll em vez de navigate
              onClick={() => scrollToSection("vantagens-produtor")}
            >
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sprout className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Produtor/Geral </h3>
              </CardContent>
            </Card>

            {/* Card Cooperativa */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:border-primary border-2"
              // ✨ MUDANÇA 2: Chama a função de scroll em vez de navigate
              onClick={() => scrollToSection("beneficios-cooperativa")}
            >
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Cooperativas ou<br />Associações</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vantagens Produtor Rural */}
      {/* ✨ MUDANÇA 3: Adicionado id="vantagens-produtor" e scroll-mt-24 para compensar a Navbar fixa */}
      <section id="vantagens-produtor" className="py-16 px-4 bg-white scroll-mt-24">
        <div className="container mx-auto max-w-6xl">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-primary mb-6">
                    Vantagens para o Produtor Rural
                  </h2>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">Controle total sobre sua produção, desde o plantio até a venda.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">Acesse dados recebidos de cooperativas e veja detalhes de pagos compradores.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">Receba relatórios simplificados sobre suas lotes de sementes e safras.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-foreground">Garanta suas transações na forma física, digital e segura.</span>
                    </li>
                  </ul>
                  
                </div>
                <div className="h-full min-h-[300px] md:min-h-[400px]">
                  <img 
                    src={farmerImage} 
                    alt="Agricultor usando tecnologia" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefícios Cooperativas */}
      {/* ✨ MUDANÇA 3: Adicionado id="beneficios-cooperativa" e scroll-mt-24 */}
      <section id="beneficios-cooperativa" className="py-16 px-4 scroll-mt-24">
        <div className="container mx-auto max-w-6xl">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-full min-h-[300px] md:min-h-[400px] order-2 md:order-1">
                  <img 
                    src={officeImage} 
                    alt="Profissional em escritório" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 order-1 md:order-2">
                  <h2 className="text-3xl font-bold text-orange-cta mb-6">
                    Benefícios para Cooperativas e Associações
                  </h2>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-cta mt-1 flex-shrink-0" />
                      <span className="text-foreground">Gerencie centralmente os dados de todos cooperados e sócios.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-cta mt-1 flex-shrink-0" />
                      <span className="text-foreground">Monitore a produção em tempo real, utilizando dados agregados.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-cta mt-1 flex-shrink-0" />
                      <span className="text-foreground">Distribua o volume de sua cooperativa com o rudo de qualidade e rastreabilidade.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-cta mt-1 flex-shrink-0" />
                      <span className="text-foreground">Facilite o acesso dos seus membros e tecnologia e a melhoria da gestão.</span>
                    </li>
                  </ul>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Como Funciona - Sem alterações daqui para baixo */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
            {/* ... restante do código original ... */}
             <h2 className="text-3xl font-bold text-center text-primary mb-4">
            É simples começar. Veja como funciona:
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-icon rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Cadastre-se</h3>
              <p className="text-sm text-muted-foreground">
                Crie sua conta na plataforma de forma rápida e segura. É 100% gratuito e você estará pronto para começar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-icon rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Registre seus Dados</h3>
              <p className="text-sm text-muted-foreground">
                Adicione as informações de seus lotes, safras, testes e qualidade. Tudo em um só lugar, rápido e seguro.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-icon rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Acompanhe</h3>
              <p className="text-sm text-muted-foreground">
                Veja as atualizações em tempo real e acompanhe sua produção da semente à entrega. Total transparência!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-sage-light/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Ainda tem dúvidas?
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border-none shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                Preciso pagar para usar a plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Não, a plataforma é para cadastro de docentes de Pernambuco, através do CPA, sem e também é agronomia, 
                cooperativismo, IT, Internet rural produtores e cooperativas é gratuita.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border-none shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                Meus dados da produção estarão seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim, utilizamos as melhores práticas de segurança para proteger seus dados. Todas as informações são criptografadas 
                e armazenadas com total segurança, seguindo as normas da LGPD.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border-none shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                Como funciona o rastreamento dos lotes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Cada lote recebe um código único que permite rastrear toda a jornada do produto, desde o plantio até a entrega final. 
                Você pode acompanhar em tempo real todas as etapas e gerar relatórios detalhados.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-foreground mb-4 font-medium">
              Para outras questões, fale conosco:
            </p>
            <Button 
              variant="default"
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate("/quem-somos")}
            >
              ENTRAR EM CONTATO
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JunteSe;