import { RolePage } from "./RolePage";

export function SecretairePage() {
  return (
    <RolePage
      title="Secrétaire / Mandataire"
      subtitle="Gestion administrative des dossiers"
      description="Le secrétaire assure le suivi administratif des dossiers projets. Gérez les documents, coordonnez les communications et maintenez le calendrier des échéances à jour."
      features={[
        "Suivi des dossiers projets",
        "Gestion documentaire",
        "Communication centralisée",
        "Calendrier des échéances",
      ]}
      benefits={[
        "Organisation optimale des dossiers",
        "Gain d'efficacité administratif",
        "Réduction des erreurs et oublis",
      ]}
      ctaText="Commencer en tant que Secrétaire"
    />
  );
}
