import { search } from "@inquirer/prompts";
import { DEFAULT_MODEL } from "./config";

type LunosModel = {
  id?: string;
};

type LunosModelResponse = {
  data?: LunosModel[];
};

async function fetchModelIds(): Promise<string[]> {
  const res = await fetch("https://api.lunos.tech/v1/models?input=text&output=text");
  if (!res.ok) {
    throw new Error(`Unable to fetch models: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as LunosModelResponse;
  const ids = (data.data || [])
    .map((item) => item.id?.trim())
    .filter((id): id is string => Boolean(id));

  if (!ids.length) {
    throw new Error("Model list is empty.");
  }

  return ids;
}

export async function selectModelInteractively(
  currentModel = DEFAULT_MODEL
): Promise<string> {
  const modelIds = await fetchModelIds();
  const uniqueIds = [...new Set(modelIds)];
  const lowerCurrent = currentModel.toLowerCase();

  const selected = await search<string>({
    message: "Select model (type to search):",
    default: currentModel,
    pageSize: 12,
    source: async (term) => {
      const query = (term || "").toLowerCase().trim();
      if (!query) {
        return uniqueIds.map((id) => ({ value: id, name: id }));
      }

      return uniqueIds
        .filter((id) => id.toLowerCase().includes(query))
        .map((id) => ({ value: id, name: id }));
    },
  });

  if (!selected) {
    return uniqueIds.find((id) => id.toLowerCase() === lowerCurrent) || currentModel;
  }

  return selected.trim();
}
