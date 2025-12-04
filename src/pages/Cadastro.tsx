import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Power, User, Lock, Eye, EyeOff, Mail, Building, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupStep1Schema = z.object({
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  city: z.string().min(2, "Cidade inválida"),
});

const signupStep2Schema = z.object({
  role: z.string().min(2, "Campo obrigatório"),
  company: z.string().min(2, "Campo obrigatório"),
  unit: z.string().min(2, "Campo obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
});

type SignupStep1Form = z.infer<typeof signupStep1Schema>;
type SignupStep2Form = z.infer<typeof signupStep2Schema>;

const Cadastro = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState<Partial<SignupStep1Form>>({});
  const navigate = useNavigate();

  const signupStep1Form = useForm<SignupStep1Form>({
    resolver: zodResolver(signupStep1Schema),
  });

  const signupStep2Form = useForm<SignupStep2Form>({
    resolver: zodResolver(signupStep2Schema),
  });

  const onSignupStep1 = (data: SignupStep1Form) => {
    setSignupData(data);
    setStep(2);
  };

  const onSignupStep2 = (data: SignupStep2Form) => {
    console.log("Cadastro completo:", { ...signupData, ...data });
    // Implementar lógica de cadastro e redirecionar
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-sage to-sage-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4">
            <Power className="w-12 h-12 text-white" />
          </div>
          <p className="text-sage-dark/80 text-sm font-medium">
            Sistema de Rastreabilidade de Sementes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
              <h1 className="text-2xl font-bold text-center mb-2">Criar Conta</h1>
              <p className="text-center text-muted-foreground text-sm mb-6">
                Preencha seus dados para começar
              </p>

              <form onSubmit={signupStep1Form.handleSubmit(onSignupStep1)} className="space-y-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Digite seu nome de usuário"
                      className="pl-10"
                      {...signupStep1Form.register("username")}
                    />
                  </div>
                  {signupStep1Form.formState.errors.username && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep1Form.formState.errors.username.message}
                    </p>
                  )}
                </div>

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
                    <p className="text-sm text-destructive mt-1">
                      {signupStep1Form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="pl-10 pr-10"
                      {...signupStep1Form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupStep1Form.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep1Form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      className="pl-10"
                      {...signupStep1Form.register("cnpj")}
                    />
                  </div>
                  {signupStep1Form.formState.errors.cnpj && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep1Form.formState.errors.cnpj.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="city"
                      placeholder="Digite sua cidade"
                      className="pl-10"
                      {...signupStep1Form.register("city")}
                    />
                  </div>
                  {signupStep1Form.formState.errors.city && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep1Form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-[#8B7355] hover:bg-[#7A6349]">
                  Continuar
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Fazer Login
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Informações Adicionais</h1>
              <p className="text-center text-muted-foreground text-sm mb-6">
                Complete seu cadastro
              </p>

              <form onSubmit={signupStep2Form.handleSubmit(onSignupStep2)} className="space-y-4">
                <div>
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    placeholder="Ex: Gerente"
                    {...signupStep2Form.register("role")}
                  />
                  {signupStep2Form.formState.errors.role && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep2Form.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    placeholder="Nome da empresa"
                    {...signupStep2Form.register("company")}
                  />
                  {signupStep2Form.formState.errors.company && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep2Form.formState.errors.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    id="unit"
                    placeholder="Unidade/Filial"
                    {...signupStep2Form.register("unit")}
                  />
                  {signupStep2Form.formState.errors.unit && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep2Form.formState.errors.unit.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      {...signupStep2Form.register("phone")}
                    />
                  </div>
                  {signupStep2Form.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {signupStep2Form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#8B7355] hover:bg-[#7A6349]">
                    Finalizar Cadastro
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
