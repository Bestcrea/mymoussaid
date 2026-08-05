import { RolePage } from "./RolePage";

export function ChefProjetPage() {
  return (
    <RolePage
      title="Chef de projet"
      subtitle="Coordination technique et administrative"
      description="Le chef de projet coordonne l'ensemble des intervenants sur le terrain. Planifiez les travaux, gérez l'équipe et produisez des rapports d'avancement réguliers."
      features={[
        "Planning et jalons",
        "Gestion d'équipe",
        "Documents techniques",
        "Reporting d'avancement",
      ]}
      benefits={[
        "Coordination fluide entre acteurs",
        "Délais respectés",
        "Communication transparente",
      ]}
      ctaText="Commencer en tant que Chef de projet"
    />
  );
}
