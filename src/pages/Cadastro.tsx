import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Power, User, Lock, Eye, EyeOff, Mail, 
  Phone, ArrowLeft, Loader2, FileText, Warehouse 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- Funções Auxiliares de Máscara ---

// Máscara de CPF: 000.000.000-00
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') 
    .slice(0, 14); 
}

// Máscara de Telefone: (00) 00000-0000
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

// --- Schemas de Validação ---

const signupStep1Schema = z.object({
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  cpf: z.string().min(14, "CPF incompleto"), 
  phone: z.string().min(14, "Telefone inválido"), // <--- MOVIDO PARA O PASSO 1
});

const signupStep2Schema = z.object({
  unit: z.string().min(2, "Campo obrigatório"), // Armazém
});

type SignupStep1Form = z.infer<typeof signupStep1Schema>;
type SignupStep2Form = z.infer<typeof signupStep2Schema>;

const Cadastro = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState<Partial<SignupStep1Form>>({});
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  const signupStep1Form = useForm<SignupStep1Form>({
    resolver: zodResolver(signupStep1Schema),
    mode: "onChange"
  });

  const signupStep2Form = useForm<SignupStep2Form>({
    resolver: zodResolver(signupStep2Schema),
  });

  const onSignupStep1 = (data: SignupStep1Form) => {
    setSignupData(data);
    setStep(2);
    setErrorMessage("");
  };

  // --- ENVIAR PARA API ---
  const onSignupStep2 = async (data: SignupStep2Form) => {
    setLoading(true);
    setErrorMessage("");

    // Junta os dados acumulados
    const completeData = { ...signupData, ...data };

    // Constrói o objeto EXATAMENTE como o DTO Kotlin pede
    const payload = {
      username: completeData.username,
      cpf: completeData.cpf?.replace(/\D/g, ''), // Limpa CPF
      email: completeData.email,
      password: completeData.password,
      telefone: completeData.phone?.replace(/\D/g, ''), // Limpa Telefone
      armazemResponsavel: completeData.unit // Mapeia Armazém
    };

    try {
      console.log("Enviando payload:", payload);

      const response = await fetch("https://elo-rural-backend.onrender.com/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message ?? "Falha ao realizar cadastro");
      }

      console.log("Cadastro Sucesso!");
      navigate("/login");

    } catch (err: any) {
      console.error("Erro API:", err);
      setErrorMessage(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-sage to-sage-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4 shadow-lg">
            <Power className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-sage-dark mb-1">Criar Conta</h2>
          <p className="text-sage-dark/80 text-sm font-medium">
            Sistema de Rastreabilidade de Sementes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mb-6 -ml-2 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Dados Pessoais</h1>
                <p className="text-muted-foreground text-sm">Passo 1 de 2</p>
              </div>

              <form onSubmit={signupStep1Form.handleSubmit(onSignupStep1)} className="space-y-4">
                
                {/* Username */}
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Ex: joaosilva"
                      className="pl-10"
                      {...signupStep1Form.register("username")}
                    />
                  </div>
                  {signupStep1Form.formState.errors.username && (
                    <p className="text-xs text-destructive mt-1">{signupStep1Form.formState.errors.username.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      {...signupStep1Form.register("email")}
                    />
                  </div>
                  {signupStep1Form.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1">{signupStep1Form.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className="pl-10 pr-10"
                      {...signupStep1Form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupStep1Form.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1">{signupStep1Form.formState.errors.password.message}</p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative mt-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      maxLength={14}
                      {...signupStep1Form.register("cpf", {
                        onChange: (e) => e.target.value = formatCPF(e.target.value)
                      })}
                    />
                  </div>
                  {signupStep1Form.formState.errors.cpf && (
                    <p className="text-xs text-destructive mt-1">{signupStep1Form.formState.errors.cpf.message}</p>
                  )}
                </div>

                {/* Telefone (AGORA NO PASSO 1) */}
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      maxLength={15}
                      {...signupStep1Form.register("phone", {
                        onChange: (e) => e.target.value = formatPhone(e.target.value)
                      })}
                    />
                  </div>
                  {signupStep1Form.formState.errors.phone && (
                    <p className="text-xs text-destructive mt-1">{signupStep1Form.formState.errors.phone.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-[#8B7355] hover:bg-[#7A6349] mt-2">
                  Continuar
                </Button>
              </form>
              
              <div className="mt-6 text-center border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Já possui conta?{" "}
                  <button onClick={() => navigate("/login")} className="text-primary hover:underline font-bold">
                    Fazer Login
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Vínculo</h1>
                <p className="text-muted-foreground text-sm">Passo 2 de 2</p>
              </div>

              <form onSubmit={signupStep2Form.handleSubmit(onSignupStep2)} className="space-y-4">
                
                {/* Armazém Responsável (Vínculo) */}
                <div>
                  <Label htmlFor="unit">Armazém Responsável</Label>
                  <div className="relative mt-1">
                    <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="unit"
                      placeholder="Ex: Armazém Central - Recife"
                      className="pl-10"
                      {...signupStep2Form.register("unit")}
                    />
                  </div>
                  {signupStep2Form.formState.errors.unit && (
                    <p className="text-xs text-destructive mt-1">{signupStep2Form.formState.errors.unit.message}</p>
                  )}
                </div>

                {errorMessage && (
                  <div className="bg-destructive/15 p-3 rounded-md text-center">
                    <p className="text-xs text-destructive font-semibold">{errorMessage}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#8B7355] hover:bg-[#7A6349]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Finalizar"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;