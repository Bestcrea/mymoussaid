import { RolePage } from "./RolePage";

export function ManagerPage() {
  return (
    <RolePage
      title="Manager de projet"
      subtitle="Supervision globale des projets d'architecture"
      description="En tant que manager, vous disposez d'une vision complète sur l'ensemble de vos projets. Pilotez les équipes, suivez les jalons et prenez des décisions éclairées grâce à un tableau de bord centralisé."
      features={[
        "Tableau de bord personnalisé",
        "Suivi d'équipe en temps réel",
        "Génération de rapports",
        "Notifications et alertes",
      ]}
      benefits={[
        "Vision 360° sur tous vos projets",
        "Gain de temps considérable",
        "Traçabilité complète des actions",
      ]}
      ctaText="Commencer en tant que Manager"
    />
  );
}
