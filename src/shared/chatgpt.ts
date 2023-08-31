import { ChatGPTAPI } from 'chatgpt';
import { loadSettings } from './storage';

export function chatGPTPolyfill() {
  self.Buffer = {
    // @ts-ignore
    isBuffer: () => false,
  };
}

export async function loadChatGPTClient() {
  const apiKey = await getChatGPTApiKey();
  return apiKey
    ? new ChatGPTAPI({ apiKey, fetch: self.fetch.bind(self) })
    : null;
}

async function getChatGPTApiKey() {
  const settings = await loadSettings();
  if (settings.chatGPTApiKey) {
    return settings.chatGPTApiKey;
  }
  chrome.runtime.openOptionsPage();
}

export const prompts = {
  tapGroupTitle: `
  Du arbeitest als Software-Entwickler und möchtest deine Aufgaben übersichtlich darstellen, indem du den Titel jedes Arbeitspakets auf ein einziges Wort reduzierst. Das gewählte Wort sollte ein Nomen und wenn möglich bereits Teil des gegebenen Titels sein. Das Ziel ist es, den Kontext des Arbeitspaketes aus dem Titel zu extrahieren, nicht die Aufgabe selber. Sofern im Titel das Erste Wort durch einen Doppelpunkt, eckige Klammern o.ä. vom Rest des Titels abgegrenzt ist, sollst du dieses Wort verwenden. Hier sind einige Beispiele im Format "Titel" -> "Wort":

  "[Terminerinnerung] Versendete Mails beim Patienten anzeigen" -> "Terminerinnerung"
  "Warteliste: Drag n Drop" -> "Warteliste"
  "Backoffice - Gutscheincodeverwaltung" -> "Backoffice"
  "Letzte Dokumentationen im Doku-Modal integrieren" -> "Doku-Modal"
  "🐛 hatTheveaNeuigkeitenGelesen wird nach Logout weiterhin abgefragt" -> "Nachrichten"

  Deine Antwort darf nur ein einziges Wort beinhalten und maximal 18 Zeichen lang sein.

  Wende das Verfahren auf den folgenden Titel an: {0}
  `,
};
