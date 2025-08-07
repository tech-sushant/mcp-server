import { PercyIntegrationTypeEnum } from "../common/types.js";

export async function fetchPercyToken(
  projectName: string,
  authorization: string,
  options: { type?: PercyIntegrationTypeEnum } = {},
): Promise<string> {
  return "main";
}
