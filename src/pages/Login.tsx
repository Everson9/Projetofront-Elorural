import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Power, User, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- URL DA API (Mude para localhost se for testar localmente) ---
const API_URL = "https://elo-rural-backend.onrender.com/login"; 
// const API_URL = "http://localhost:8080/login"; 

// --- ESQUEMA DE VALIDAÇÃO ZOD ---
const loginSchema = z.object({
  cpnjOrUser: z.string().nonempty("Campo obrigatório").trim(),
  password: z.string().nonempty("Campo obrigatório").trim(),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // --- FUNÇÃO DE LOGIN ---
  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage("");

    // 1. LIMPEZA DE DADOS
    // Remove pontos e traços do CPF para enviar só números
    const loginLimpo = data.cpnjOrUser.replace(/\D/g, '');

    try {
      console.log("Enviando login:", { cpf: loginLimpo });

      // 2. CONEXÃO COM A API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Backend espera 'cpf' limpo
          cpf: loginLimpo, 
          
          // Backend espera 'senha' (em português, conforme seu DTO Java)
          senha: data.password 
        }),
      });

      if (!response.ok) {
        // Tenta pegar a mensagem de erro específica do Backend
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || err?.error || "Usuário ou senha inválidos");
      }

      const result = await response.json();
      console.log("Login bem-sucedido:", result);

      // 3. SALVAR DADOS NO NAVEGADOR (Local Storage)
      const token = result.token || result.accessToken;
      
      if (token) {
        // Salva o Token de Acesso
        localStorage.setItem("token", token);
        
        // 👇 A CORREÇÃO MÁGICA ESTÁ AQUI 👇
        // Salva os dados do usuário (nome, email, etc) para a Sidebar usar
        if (result.dados) {
            localStorage.setItem("usuario_logado", JSON.stringify(result.dados));
        }
        
        navigate("/dashboard");
      } else {
        // Fallback: Se não veio token mas veio sucesso
        if (result.dados) {
            localStorage.setItem("usuario_logado", JSON.stringify(result.dados));
        }
        navigate("/dashboard");
      }

    } catch (err: any) {
      console.error("Erro no Login:", err);
      setErrorMessage(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-sage to-sage-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4 shadow-lg">
            <Power className="w-10 h-10 text-white" />
          </div>
          <p className="text-sage-dark/80 text-sm font-medium">
            Sistema de Rastreabilidade de Sementes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-6 -ml-2 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>

          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Fazer Login</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Entre com suas credenciais para acessar
          </p>

          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">

            {/* CAMPO CPF */}
            <div>
              <Label htmlFor="cpnjOrUser">CPF</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="cpnjOrUser"
                  type="text"
                  placeholder="Digite seu CPF"
                  className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...loginForm.register("cpnjOrUser")}
                />
              </div>
              {loginForm.formState.errors.cpnjOrUser && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {loginForm.formState.errors.cpnjOrUser.message}
                </p>
              )}
            </div>

            {/* CAMPO SENHA */}
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pl-10 pr-10"
                  {...loginForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* CHECKBOX LEMBRAR-ME */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={loginForm.control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="rememberMe" className="text-sm cursor-pointer text-gray-600">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline font-medium">
                Esqueceu a senha?
              </a>
            </div>

            {/* BOTÃO SUBMIT */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B7355] hover:bg-[#7A6349] disabled:opacity-70 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            {/* MENSAGEM DE ERRO */}
            {errorMessage && (
              <div className="bg-destructive/10 p-3 rounded-md text-center border border-destructive/20">
                <p className="text-destructive text-xs font-semibold">
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;