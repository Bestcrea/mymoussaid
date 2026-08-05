import { RolePage } from "./RolePage";

export function PartenairePage() {
  return (
    <RolePage
      title="Partenaire"
      subtitle="Bureaux d'études, sociétés de construction"
      description="Développez votre activité grâce à notre réseau de partenaires. Accédez à des projets communs, élargissez votre réseau professionnel et saisissez de nouvelles opportunités."
      features={[
        "Partenariats stratégiques",
        "Projets communs",
        "Réseau professionnel",
        "Opportunités exclusives",
      ]}
      benefits={[
        "Développement de votre activité",
        "Réseau qualifié et vérifié",
        "Accès privilégié aux marchés",
      ]}
      ctaText="Devenir Partenaire"
    />
  );
}
