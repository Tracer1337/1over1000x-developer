import { ChatGPTAPI } from 'chatgpt';
import { loadSettings } from './settings';

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
  userStory: `
  Du bist Project-Owner in einem Software-Startup, das mit SCRUM arbeitet. Deine Aufgabe ist jetzt das Schreiben einer User-Story anhand einer gegebenen Problem-Beschreibung. Die User-Story soll einen Titel, eine Beschreibung und relevante Akzeptanzkriterien beinhalten.

  Folge beim Schreiben der Beschreibung dem folgenden Schema: Als (hier Persona einfügen) möchte ich (hier Funktion einfügen) damit (hier Nutzen einfügen).
  
  Deine Antwort soll im JSON-Format ausgegeben werden, damit sie automatisiert weiterverarbeitet werden kann. Antworte mit nichts anderem als der JSON-Ausgabe. Das Schema dafür sieht wie folgt aus:
  
  {
    "title": "Titel der User-Story",
    "description": "Beschreibung der User-Story",
    "criteria": ["Akzeptanzkriterium 1", "Akzeptanzkriterium 2"]
  }
  
  Hier ist ein Beispiele einer mögliche User-Story. Orientiere dich beim Schreiben der neuen User-Story am Schreibstil der folgenden Story:
  
  {
    "title": "Anlage & Abrechnung von Polizei-Kostenträger ermöglichen",
    "description": "Als Martha möchte ich Verordnungen von Polizisten ebenfalls mit thevea abrechnen.",
    "criteria": [
        "Kostenträger aufbauen, Spalte D als Bezeichnung nehmen",
        "gilt für GKV und Zahnarzt-VO",
        "Bundeslandermittlung der Betriebsstätte analog Rechnungsanschrift",
        "beim Bearbeiten des LE Prüfung Logik auf Änderung der Betriebsstätte erweitern, wenn 1) Bundesland Bawü und 2) eine Verordnung mit Kostenträger Polizei, die nicht ",
        "Preisliste 66 aufbauen",
        "Wenn Bawü und Preisservice nicht verfügbar oder nicht connect-LE, dann Preis aus Preisliste 66 ziehen",
        "Wenn Bawü dann keine Zuzahlung, Vergleich Postbeamtenkrankenkasse",
    ]
  }
  
  Schreibe die User-Story anhand folgender Problem-Beschreibung:
  
  {0}
  `,
};
