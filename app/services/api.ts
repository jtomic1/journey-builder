import { ActionBlueprintGraphResponse } from '../types/blueprint-dto';

export const getActionBlueprintGraph = async (
  tenantId: string,
  blueprintId: string,
): Promise<ActionBlueprintGraphResponse> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${BASE_URL}/${tenantId}/actions/blueprints/${blueprintId}/graph`);

  if (!res.ok) throw new Error(`Failed to fetch action blueprint graph: ${res.statusText}`);

  return res.json();
};
