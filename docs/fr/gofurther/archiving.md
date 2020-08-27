# Main courante

La **main courante** propose un archivage long-terme de vos [événements](../quickstart/concepts.md#evenement). Elle vous permet ainsi d'assurer une traçabilité complète de vos opérations et la production de statistiques sous forme de graphiques ou de cartes.

::: warning Note
Cette fonctionnalité requiert un abonnement spécifique, sans celui-ci vous ne pourrez y accéder.

:point_right: Vous êtes propriétaire d'une organisation ? <tour-link text="Voir comment souscrire" path="home" :params="{ organisation: 'owner', route: 'organisation-settings-activity', perspective: 'billing' }"/>
:::

La vue par défaut au sein de cette activité propose une ligne de temps affichant vos événements de façon séquentielle dans une plage de temps donnée. Vous pourrez y retrouver les actions afférentes habituelles, ainsi que de nouvelles information de traçabilité comme les dates de création/modification/clôture et le nombre de participants impliqués: 

![Archivage](../../assets/Event-Archiving-FR.png)

::: danger Attention
Une fois archivées, les données produites par l'application sont anonymisées en supprimant les identifiants personnels tels que les noms, ceci afin de limiter vos obligations juridiques en vertu du [RGPD](https://fr.wikipedia.org/wiki/R%C3%A8glement_g%C3%A9n%C3%A9ral_sur_la_protection_des_donn%C3%A9es), mais aussi pour protéger les individus et leurs données personnelles.

Néanmoins, le contenu saisi par vos membres est enregistré "tel quel". Aussi, vous devez vous assurez de sa conformité avec le RGPD.
:::

Il est également possible de basculer sur une vue cartographique de vos événements permettant leur localisation précise:

![Archivage (carte)](../../assets/Events-Map.png)

Ou sous forme de carte de densité pour étudier leur distribution spatiale:

![Archivage (carte de densité)](../../assets/Events-HeatMap-FR.png)

Cerise sur le gâteau, vous pouvez produire des statistiques sur vos événements et exporter les données dans des applications tierces comme Microsoft® Excel®:

![Archiving Chart](../../assets/Events-Chart-FR.png)

:point_right: Vous êtes gestionnaire d'une organisation ? <tour-link text="Parcourir la main courante" path="home" :params="{ organisation: 'manager', route: 'archived-events-activity' }"/>

::: details Voir aussi
Comment entrer dans le contexte d'une organisation via le <tour-link text="menu principal" path="home" :params="{ tour: 'home' }"/>

Comment entrer dans l'activité de main courante depuis <tour-link text="le contexte de l'organisation" path="home" :params="{ organisation: 'manager', tour: 'context' }"/>
:::
