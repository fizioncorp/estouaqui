const htmlTagRegex = /<[^>]+>/g;
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phoneRegex = /(?:\+?\d{1,3}\s?)?(?:\(?\d{2,3}\)?\s?)?\d{4,5}[-.\s]?\d{4}\b/g;
const urlRegex = /(?:https?:\/\/|www\.)\S+/gi;

export function sanitizeText(input: string) {
  return input.replace(htmlTagRegex, "").trim();
}

export function containsBlockedContactData(input: string) {
  return emailRegex.test(input) || phoneRegex.test(input) || urlRegex.test(input);
}

export function cleanMessageContent(input: string) {
  const content = sanitizeText(input);

  if (containsBlockedContactData(content)) {
    return {
      isAllowed: false,
      content: "Mensagem bloqueada por conter contato pessoal ou link externo."
    };
  }

  return {
    isAllowed: true,
    content
  };
}
