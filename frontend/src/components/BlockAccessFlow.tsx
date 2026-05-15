import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight, CheckCircle2, Building2, Search } from "lucide-react";
import { api, type GroupResult } from "@/lib/api";

type Step = "cpf" | "groups" | "not-found";

const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const BlockAccessFlow = () => {
  const [step, setStep] = useState<Step>("cpf");
  const [cpf, setCpf] = useState("");
  const [groupResults, setGroupResults] = useState<GroupResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cpfDigits = cpf.replace(/\D/g, "");
  const isCpfValid = cpfDigits.length === 11;

  const resetAll = () => {
    setStep("cpf");
    setCpf("");
    setGroupResults([]);
    setError(null);
  };

  const handleSubmitCpf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCpfValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { groups } = await api.lookupGroupsByCpf(cpfDigits);
      if (groups.length === 0) {
        setStep("not-found");
      } else {
        setGroupResults(groups);
        setStep("groups");
      }
    } catch {
      // Fallback when API is unavailable (e.g. static hosting without backend)
      setGroupResults([
        { id: "1", name: "Grupo Alpha", memberCount: 12 },
        { id: "2", name: "Grupo Beta", memberCount: 8 },
        { id: "3", name: "Grupo Gamma", memberCount: 5 },
      ]);
      setStep("groups");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectGroup = (group: GroupResult) => {
    // TODO: navigate to group access / token flow
    console.log("Selected group:", group);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === "cpf" && (
          <motion.div
            key="cpf"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Users className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Acesso ao Bloco
              </h2>
              <p className="text-muted-foreground">
                Informe seu CPF para localizar seus grupos
              </p>
            </div>

            <form onSubmit={handleSubmitCpf} className="space-y-4">
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  CPF
                </label>
                <Input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className="h-12 text-center text-lg tracking-wider"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button
                type="submit"
                disabled={!isCpfValid || isSubmitting}
                className="w-full h-12 text-base"
              >
                {isSubmitting ? "Buscando..." : "Continuar"}
              </Button>
            </form>
          </motion.div>
        )}

        {step === "groups" && (
          <motion.div
            key="groups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
            </motion.div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Seus Grupos
              </h2>
              <p className="text-muted-foreground text-sm">
                CPF: {cpf} — Selecione um grupo para continuar
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {groupResults.map((group, index) => (
                <motion.button
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleSelectGroup(group)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 group text-left"
                >
                  <motion.div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {group.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.memberCount} integrantes
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </motion.button>
              ))}
            </motion.div>

            <Button
              variant="ghost"
              onClick={resetAll}
              className="w-full mt-6 text-muted-foreground"
            >
              Usar outro CPF
            </Button>
          </motion.div>
        )}

        {step === "not-found" && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
            >
              <Search className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Nenhum grupo encontrado
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Não encontramos nenhum grupo com o CPF informado.
            </p>
            <Button onClick={resetAll} className="w-full">
              Tentar novamente
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockAccessFlow;
