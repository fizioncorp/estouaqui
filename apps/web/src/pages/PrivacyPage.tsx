import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { api } from "../services/api";

export function PrivacyPage() {
  const [content, setContent] = useState<{ title: string; lastUpdated: string; sections: string[] } | null>(null);

  useEffect(() => {
    api.get("/legal/privacy").then(({ data }) => setContent(data));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Card className="prose-safe">
          <h1 className="mb-2 text-3xl font-semibold text-forest">{content?.title}</h1>
          <p className="mb-8 text-sm text-ink/60">Última atualização: {content?.lastUpdated}</p>
          {content?.sections.map((section) => (
            <p key={section} className="whitespace-pre-line">
              {section}
            </p>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
