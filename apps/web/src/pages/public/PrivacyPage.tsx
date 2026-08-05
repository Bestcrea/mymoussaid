import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "Collecte des données",
    content:
      "MyMoussaid collecte les données personnelles que vous nous fournissez volontairement lors de votre inscription (nom, prénom, adresse e-mail, numéro de téléphone) ainsi que les données générées par votre utilisation de la plateforme (projets, documents, messages).",
  },
  {
    title: "Utilisation des données",
    content:
      "Vos données sont utilisées pour fournir et améliorer nos services, gérer votre compte, faciliter la communication entre les acteurs d'un projet, et vous envoyer des notifications pertinentes. Nous ne vendons jamais vos données à des tiers.",
  },
  {
    title: "Cookies",
    content:
      "Notre site utilise des cookies essentiels pour le fonctionnement de la plateforme (authentification, préférences de langue) et des cookies analytiques anonymisés pour améliorer l'expérience utilisateur. Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.",
  },
  {
    title: "Droits des utilisateurs",
    content:
      "Conformément à la loi marocaine n°09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez notre DPO.",
  },
  {
    title: "Contact DPO",
    content:
      "Délégué à la Protection des Données : dpo@mymoussaid.ma — MyMoussaid, Casablanca, Maroc. Nous nous engageons à répondre à toute demande dans un délai de 30 jours.",
  },
] as const;

export function PrivacyPage() {
  return (
    <>
      <section className="bg-neutral-900 pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-400">Confidentialité</span>
          </nav>
          <h1 className="font-display text-4xl font-semibold text-white">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-neutral-400">
            Dernière mise à jour : janvier 2026
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-neutral-600 leading-relaxed">
            MyMoussaid s'engage à protéger la vie privée de ses utilisateurs.
            Cette politique décrit comment nous collectons, utilisons et protégeons vos
            données personnelles.
          </p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section) => (
              <article key={section.title}>
                <h2 className="font-display text-2xl font-semibold text-neutral-900">
                  {section.title}
                </h2>
                <p className="mt-3 text-neutral-600 leading-relaxed">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
