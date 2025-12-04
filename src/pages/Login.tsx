import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Power, User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

  // --- FUNÇÃO DE LOGIN COM POST ---
  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage("");

    try {
      console.log("Enviando dados para API:", data);

      const response = await fetch("https://elo-rural-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: data.cpnjOrUser,
          senha: data.password,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message ?? "Falha ao fazer login");
      }

      const result = await response.json();
      console.log("Login bem-sucedido:", result);

      // Salvar token
      localStorage.setItem("token", result.token);

      navigate("/dashboard");

    } catch (err: any) {
      console.error("Erro no Login:", err);
      setErrorMessage(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>

          <h1 className="text-2xl font-bold text-center mb-2">Fazer Login</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Entre com suas credenciais para acessar o sistema
          </p>

          <form
            onSubmit={loginForm.handleSubmit(
              onLogin,
              (errors) => console.error("Erros de validação:", errors)
            )}
            className="space-y-4"
          >

            {/* CAMPO CNPJ/USUÁRIO */}
            <div>
              <Label htmlFor="cpnjOrUser">CNPJ ou Usuário</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="cpnjOrUser"
                  type="text"
                  placeholder="Digite seu CNPJ ou usuário"
                  className="pl-10 border border-input rounded-md w-full h-10 px-3 bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...loginForm.register("cpnjOrUser")}
                />
              </div>
              {loginForm.formState.errors.cpnjOrUser && (
                <p className="text-sm text-destructive mt-1">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
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
                <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B7355] hover:bg-[#7A6349] disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {/* ERRO CENTRALIZADO */}
            {errorMessage && (
              <p className="text-red-600 text-sm text-center">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
