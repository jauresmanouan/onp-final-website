import NouvelleFenetre from "@/components/site/NouvelleFenetre";

const AUTEUR = {
  nom: "Jaurès Manouan",
  profil: "https://www.linkedin.com/in/jauresmanouan/",
};

/**
 * La signature du développeur, en pied de page.
 *
 * Écrite une fois et posée dans les deux pieds, celui du site et celui du
 * tableau de bord : c'est la même main derrière les deux. Elle reste à la
 * taille et à la couleur de la mention de copyright — une signature discrète
 * se lit très bien, une signature qui se voit prend la place de l'institution.
 *
 * Le cœur est décoratif et retiré de l'énoncé vocal : « développé avec cœur
 * rouge par » n'apporte rien à qui écoute la page.
 */
export default function Signature({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      Développé avec le {" "}
      <span aria-hidden="true" className="text-destructive">
        ♥
      </span>
      <span className="sr-only">passion</span> par{" "}
      <a
        href={AUTEUR.profil}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
      >
        {AUTEUR.nom}
        <NouvelleFenetre />
      </a>
    </p>
  );
}
