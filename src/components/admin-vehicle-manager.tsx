"use client";

import { FormEvent, useEffect, useState } from "react";
import { BadgeCheck, Database, KeyRound, Plus, UploadCloud } from "lucide-react";

type FormValues = {
  name: string;
  make: string;
  model: string;
  condition: "novo" | "seminovo" | "usado";
  featuredOffer: boolean;
  turboSpec: string;
  hasModifications: boolean;
  year: string;
  price: string;
  monthlyPayment: string;
  mileage: string;
  transmission: string;
  fuel: string;
  location: string;
  image: string;
  badge: string;
  turboBadge: string;
  tags: string;
};

type ApiResponse = {
  data?: { slug?: string } | unknown[];
  total?: number;
  error?: string;
};

const initialForm: FormValues = {
  name: "",
  make: "Volkswagen",
  model: "Hatch",
  condition: "seminovo",
  featuredOffer: false,
  turboSpec: "Turbo de fabrica com manutencao em dia",
  hasModifications: false,
  year: String(new Date().getFullYear()),
  price: "",
  monthlyPayment: "",
  mileage: "",
  transmission: "Automatico",
  fuel: "Flex",
  location: "Sao Paulo, SP",
  image: "/vehicle-hatch.png",
  badge: "Novo anuncio",
  turboBadge: "",
  tags: "Procedencia conferida:normal\nLaudo aprovado:normal",
};

function parseTags(value: string) {
  return value
    .split(/\n|,/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, variant] = item.split(":").map((part) => part.trim());
      return {
        label,
        variant: variant === "modification" ? "modification" : "normal",
      };
    });
}

async function postJson(path: string, token: string, payload?: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload === undefined ? "{}" : JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => ({}))) as ApiResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "Nao foi possivel concluir a acao.");
  }

  return result;
}

export function AdminVehicleManager({ initialTotal }: { initialTotal: number }) {
  const [token, setToken] = useState("");
  const [form, setForm] = useState<FormValues>(initialForm);
  const [importJson, setImportJson] = useState("");
  const [message, setMessage] = useState(`Estoque atual: ${initialTotal} veiculo(s).`);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem("turboclass-admin-token") ?? "");
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("turboclass-admin-token", token);
      return;
    }

    sessionStorage.removeItem("turboclass-admin-token");
  }, [token]);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Cadastrando veiculo...");

    try {
      const result = await postJson("/api/admin/vehicles", token, {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        monthlyPayment: Number(form.monthlyPayment),
        mileage: Number(form.mileage),
        tags: parseTags(form.tags),
      });
      const slug = !Array.isArray(result.data) && result.data?.slug ? result.data.slug : "novo-veiculo";
      setMessage(`Veiculo cadastrado com sucesso: /estoque/${slug}`);
      setForm(initialForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao cadastrar veiculo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    setLoading(true);
    setMessage("Importando lote...");

    try {
      const payload = JSON.parse(importJson);
      const result = await postJson("/api/admin/vehicles/import", token, payload);
      setMessage(`${result.total ?? 0} veiculo(s) importado(s).`);
      setImportJson("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao importar veiculos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setLoading(true);
    setMessage("Migrando estoque inicial...");

    try {
      const result = await postJson("/api/admin/vehicles/seed", token);
      setMessage(`${result.total ?? 0} veiculo(s) do estoque inicial migrado(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao migrar estoque inicial.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || token.trim().length < 24;

  return (
    <section className="admin-panel" aria-label="Gestao de estoque">
      <div className="admin-status">
        <KeyRound size={20} aria-hidden="true" />
        <label>
          <span>Token ADMIN_TOKEN</span>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Cole o token de administrador"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="admin-message" role="status">
        <BadgeCheck size={18} aria-hidden="true" />
        <span>{message}</span>
      </div>

      <div className="admin-layout">
        <form className="admin-card admin-form" onSubmit={handleCreate}>
          <div className="admin-card-heading">
            <Plus size={22} aria-hidden="true" />
            <div>
              <span className="eyebrow">Cadastro</span>
              <h2>Novo carro</h2>
            </div>
          </div>

          <div className="admin-grid">
            <label>
              Nome do anuncio
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
            </label>
            <label>
              Marca
              <input value={form.make} onChange={(event) => updateField("make", event.target.value)} required />
            </label>
            <label>
              Modelo/carroceria
              <input value={form.model} onChange={(event) => updateField("model", event.target.value)} required />
            </label>
            <label>
              Condicao
              <select value={form.condition} onChange={(event) => updateField("condition", event.target.value as FormValues["condition"])}>
                <option value="novo">Novo</option>
                <option value="seminovo">Seminovo</option>
                <option value="usado">Usado</option>
              </select>
            </label>
            <label>
              Ano
              <input value={form.year} onChange={(event) => updateField("year", event.target.value)} inputMode="numeric" required />
            </label>
            <label>
              Preco
              <input value={form.price} onChange={(event) => updateField("price", event.target.value)} inputMode="numeric" required />
            </label>
            <label>
              Parcela estimada
              <input
                value={form.monthlyPayment}
                onChange={(event) => updateField("monthlyPayment", event.target.value)}
                inputMode="numeric"
                required
              />
            </label>
            <label>
              Quilometragem
              <input value={form.mileage} onChange={(event) => updateField("mileage", event.target.value)} inputMode="numeric" required />
            </label>
            <label>
              Cambio
              <input value={form.transmission} onChange={(event) => updateField("transmission", event.target.value)} required />
            </label>
            <label>
              Combustivel
              <input value={form.fuel} onChange={(event) => updateField("fuel", event.target.value)} required />
            </label>
            <label>
              Localizacao
              <input value={form.location} onChange={(event) => updateField("location", event.target.value)} required />
            </label>
            <label>
              Imagem em public
              <input value={form.image} onChange={(event) => updateField("image", event.target.value)} required />
            </label>
            <label>
              Selo do card
              <input value={form.badge} onChange={(event) => updateField("badge", event.target.value)} required />
            </label>
            <label>
              Selo turbo
              <input value={form.turboBadge} onChange={(event) => updateField("turboBadge", event.target.value)} />
            </label>
          </div>

          <label>
            Descricao turbo/setup
            <textarea value={form.turboSpec} onChange={(event) => updateField("turboSpec", event.target.value)} required />
          </label>

          <label>
            Tags
            <textarea value={form.tags} onChange={(event) => updateField("tags", event.target.value)} required />
          </label>

          <div className="admin-checks">
            <label>
              <input
                type="checkbox"
                checked={form.featuredOffer}
                onChange={(event) => updateField("featuredOffer", event.target.checked)}
              />
              Oferta em destaque
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.hasModifications}
                onChange={(event) => updateField("hasModifications", event.target.checked)}
              />
              Possui modificacoes
            </label>
          </div>

          <button type="submit" className="primary-button" disabled={disabled}>
            Cadastrar carro
          </button>
        </form>

        <aside className="admin-side">
          <div className="admin-card">
            <div className="admin-card-heading">
              <Database size={22} aria-hidden="true" />
              <div>
                <span className="eyebrow">Banco</span>
                <h2>Migracao inicial</h2>
              </div>
            </div>
            <p>
              Leva os carros atuais da source para o banco configurado em DATABASE_URL, mantendo o
              site pronto para receber novos anuncios.
            </p>
            <button type="button" className="secondary-button admin-action" onClick={handleSeed} disabled={disabled}>
              Migrar estoque atual
            </button>
          </div>

          <div className="admin-card">
            <div className="admin-card-heading">
              <UploadCloud size={22} aria-hidden="true" />
              <div>
                <span className="eyebrow">Importacao</span>
                <h2>Lote JSON</h2>
              </div>
            </div>
            <textarea
              className="admin-import"
              value={importJson}
              onChange={(event) => setImportJson(event.target.value)}
              placeholder='[{"name":"Golf GTI Stage 2","make":"Volkswagen","model":"Hatch","condition":"seminovo","featuredOffer":true,"turboSpec":"Stage 2 com downpipe","hasModifications":true,"year":2023,"price":184900,"monthlyPayment":3280,"mileage":18000,"transmission":"Automatico","fuel":"Flex","location":"Sao Paulo, SP","image":"/vehicle-hatch.png","badge":"Novo anuncio","turboBadge":"Turbo reluzente","tags":[{"label":"Stage 2","variant":"modification"}]}]'
            />
            <button type="button" className="secondary-button admin-action" onClick={handleImport} disabled={disabled || !importJson.trim()}>
              Importar lote
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
