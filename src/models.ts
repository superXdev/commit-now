import { search } from "@inquirer/prompts";
import { DEFAULT_MODEL } from "./config";

type LunosModel = {
  id?: string;
  name?: string;
  provider?: string;
  pricePerMillionTokens?: {
    input?: number;
    output?: number;
  };
};

type LunosModelResponse = {
  data?: LunosModel[];
};

type ModelOption = {
  id: string;
  label: string;
  searchText: string;
};

function formatPrice(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "n/a";
  }
  return value.toFixed(2);
}

function toModelOption(model: LunosModel): ModelOption | null {
  const id = model.id?.trim();
  if (!id) return null;

  const input = formatPrice(model.pricePerMillionTokens?.input);
  const output = formatPrice(model.pricePerMillionTokens?.output);
  const provider = model.provider?.trim() || "unknown";
  const name = model.name?.trim();

  const label = `${id} | in:$${input} out:$${output}`;

  return {
    id,
    label,
    searchText: `${id} ${provider} ${name || ""} ${input} ${output}`.toLowerCase(),
  };
}

async function fetchModelOptions(): Promise<ModelOption[]> {
  const res = await fetch("https://api.lunos.tech/v1/models?input=text&output=text");
  if (!res.ok) {
    throw new Error(`Unable to fetch models: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as LunosModelResponse;
  const options = (data.data || [])
    .map((item) => toModelOption(item))
    .filter((item): item is ModelOption => Boolean(item));

  if (!options.length) {
    throw new Error("Model list is empty.");
  }

  return options;
}

export async function selectModelInteractively(
  currentModel = DEFAULT_MODEL
): Promise<string> {
  const modelOptions = await fetchModelOptions();
  const dedupedById = new Map<string, ModelOption>();
  for (const option of modelOptions) {
    if (!dedupedById.has(option.id)) dedupedById.set(option.id, option);
  }
  const uniqueOptions = [...dedupedById.values()];
  const lowerCurrent = currentModel.toLowerCase();

  const selected = await search<string>({
    message: "Select model (type to search):",
    default: currentModel,
    pageSize: 12,
    source: async (term) => {
      const query = (term || "").toLowerCase().trim();
      if (!query) {
        return uniqueOptions.map((opt) => ({ value: opt.id, name: opt.label }));
      }

      return uniqueOptions
        .filter((opt) => opt.searchText.includes(query))
        .map((opt) => ({ value: opt.id, name: opt.label }));
    },
  });

  if (!selected) {
    return (
      uniqueOptions.find((opt) => opt.id.toLowerCase() === lowerCurrent)?.id ||
      currentModel
    );
  }

  return selected.trim();
}
