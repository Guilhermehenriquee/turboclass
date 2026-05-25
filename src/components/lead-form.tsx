"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { LeadKind } from "@/lib/inventory-types";
import { makeWhatsAppUrl } from "@/lib/links";

type LeadFormProps = {
  kind: LeadKind;
  title: string;
  submitLabel: string;
  vehicleName?: string;
  vehicleId?: string;
  fields?: "sell" | "finance" | "contact";
};

type Message = {
  kind: "idle" | "success" | "error";
  text: string;
};

function getFormData(form: HTMLFormElement) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, typeof value === "string" ? value : String(value)]),
  );
}

export function LeadForm({ kind, title, submitLabel, vehicleName, vehicleId, fields = "contact" }: LeadFormProps) {
  const [message, setMessage] = useState<Message>({ kind: "idle", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage({ kind: "idle", text: "" });

    const form = event.currentTarget;
    const payload = getFormData(form);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          vehicleName,
          vehicleId,
          name: payload.name,
          whatsapp: payload.whatsapp,
          email: payload.email,
          city: payload.city,
          state: payload.state,
          source: `form-${kind}`,
          message: payload.message || title,
          payload,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        if (response.status === 503) {
          const summary = Object.entries(payload)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" | ");
          window.open(makeWhatsAppUrl(`Ola, quero atendimento TurboClass. ${summary}`), "_blank", "noreferrer");
          setMessage({ kind: "success", text: "Banco nao configurado. Abrimos o WhatsApp com seus dados para atendimento." });
          return;
        }

        throw new Error(result.error ?? "Nao foi possivel enviar agora.");
      }

      form.reset();
      setMessage({ kind: "success", text: "Recebemos seus dados. A equipe TurboClass vai te chamar pelo WhatsApp." });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Nao foi possivel enviar agora." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="conversion-form" onSubmit={handleSubmit}>
      <div className="conversion-form-heading">
        <BadgeCheck size={22} aria-hidden="true" />
        <h2>{title}</h2>
      </div>

      <div className="conversion-grid">
        <label>
          Nome
          <input name="name" required placeholder="Seu nome" />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" required placeholder="(11) 99999-9999" inputMode="tel" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" placeholder="voce@email.com" />
        </label>
        <label>
          Cidade
          <input name="city" placeholder="Cidade" />
        </label>
        <label>
          Estado
          <input name="state" placeholder="UF" maxLength={2} />
        </label>
        {fields === "finance" ? (
          <>
            <label>
              Veiculo de interesse
              <input name="vehicleInterest" defaultValue={vehicleName} placeholder="Modelo anunciado" />
            </label>
            <label>
              Valor do veiculo
              <input name="vehicleValue" inputMode="numeric" placeholder="140000" />
            </label>
            <label>
              Entrada
              <input name="downPayment" inputMode="numeric" placeholder="40000" />
            </label>
            <label>
              Prazo desejado
              <input name="term" placeholder="48 meses" />
            </label>
            <label>
              Possui carro na troca?
              <select name="tradeIn" defaultValue="nao">
                <option value="nao">Nao</option>
                <option value="sim">Sim</option>
              </select>
            </label>
          </>
        ) : null}
        {fields === "sell" ? (
          <>
            <label>
              Marca
              <input name="make" placeholder="Volkswagen" />
            </label>
            <label>
              Modelo
              <input name="model" placeholder="Golf GTI" />
            </label>
            <label>
              Ano/modelo
              <input name="year" placeholder="2014/2014" />
            </label>
            <label>
              Preco pedido
              <input name="price" inputMode="numeric" placeholder="140000" />
            </label>
            <label>
              Motorizacao
              <input name="engineType" placeholder="Turbo, swap, aspirado..." />
            </label>
            <label>
              Preparacao
              <input name="preparation" placeholder="Stage 2, projeto completo..." />
            </label>
          </>
        ) : null}
      </div>

      <label>
        Mensagem
        <textarea name="message" required placeholder="Conte os principais detalhes e observacoes." />
      </label>

      {message.text ? (
        <p className={`form-message ${message.kind}`} role="status">
          {message.text}
        </p>
      ) : null}

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Enviando..." : submitLabel}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
