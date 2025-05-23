import { assertOkResponse } from "../../lib/utils.js";
import config from "../../config.js";

interface SelectorMapping {
  originalSelector: string;
  healedSelector: string;
}

export async function getSelfHealSelectors(sessionId: string) {
  const credentials = `${config.browserstackUsername}:${config.browserstackAccessKey}`;
  const auth = Buffer.from(credentials).toString("base64");
  const url = `https://api.browserstack.com/automate/sessions/${sessionId}/logs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  await assertOkResponse(response, "session logs");
  const logText = await response.text();
  return extractHealedSelectors(logText);
}

function extractHealedSelectors(logText: string): SelectorMapping[] {
  // Pattern to match SELFHEAL entries with healed selectors
  const selfhealPattern =
    /SELFHEAL\s*{\s*"status":"true",\s*"data":\s*{\s*"using":"css selector",\s*"value":"(.*?)"}/g;

  // Pattern to match preceding selector requests
  const requestPattern =
    /POST \/session\/[^/]+\/element.*?"using":"css selector","value":"(.*?)"/g;

  // Find all healed selectors
  const healedSelectors: string[] = [];
  let healedMatch;
  while ((healedMatch = selfhealPattern.exec(logText)) !== null) {
    healedSelectors.push(healedMatch[1]);
  }

  // Find all selector requests
  const selectorRequests: string[] = [];
  let requestMatch;
  while ((requestMatch = requestPattern.exec(logText)) !== null) {
    selectorRequests.push(requestMatch[1]);
  }

  // Pair each healed selector with its corresponding original selector
  const healedMappings: SelectorMapping[] = [];
  const minLength = Math.min(selectorRequests.length, healedSelectors.length);

  for (let i = 0; i < minLength; i++) {
    healedMappings.push({
      originalSelector: selectorRequests[i],
      healedSelector: healedSelectors[i],
    });
  }

  return healedMappings;
}
