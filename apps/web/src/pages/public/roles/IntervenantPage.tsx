import { RolePage } from "./RolePage";

export function IntervenantPage() {
  return (
    <RolePage
      title="Intervenant"
      subtitle="Ingénieurs, notaires, architectes, artisans"
      description="Rejoignez notre réseau d'intervenants qualifiés. Accédez aux appels d'offres correspondant à votre spécialité, soumettez vos offres et communiquez directement avec les maîtres d'ouvrage."
      features={[
        "Profil avec spécialité",
        "Réception des appels d'offres",
        "Soumission d'offres en ligne",
        "Messagerie intégrée",
      ]}
      benefits={[
        "Visibilité sur les projets en cours",
        "Nouvelles opportunités business",
        "Gestion simplifiée des propositions",
      ]}
      ctaText="Rejoindre en tant qu'Intervenant"
    />
  );
}
