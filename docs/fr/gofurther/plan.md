# <i class="las la-stream"></i> Plan

Un *ensemble d'événements liés à une situation* que l'on désire gérer. Typiquement un plan de continuité d'activité, un plan d'opération interne, etc. Un plan est généralement structuré autour d'objectifs à atteindre.

::: tip Astuce
L'utilisateur qui créé un plan en est par défaut le coordonnateur mais il peut partager ou déléguer la gestion à d'autres.
:::

Pour vous aider à suivre l'avancement de votre plan il est possible de:
1. Définir les différents objectifs visés par le plan
2. Suivre le niveau de progression des événements constituant le plan

Un *objectif* est constitué d'un titre et d'une description, plus une éventuelle localisation (e.g. zone de danger à évacuer). Vous pouvez inclure dans la description des liens vers vos fiches réflexes, documents, etc. Chaque événement de votre plan pourra être associé à un objectif et les événements filtrés en fonction de vos objectifs dans chaque activité (liste d'événements, carte des événements, main courante).

De plus, un plan propose un tableau Kanban de trois colonnes:
* *A faire*: événements n'ayant encore aucun participant,
* *En cours*: événements ayant au moins un participant et non encore clôturés,
* *Clôturés*: événements clôturés.

:point_right: Vous êtes prêt à activer un plan ? <ClientOnly><tour-link text="Voir comment gérer vos plans" path="home" :params="{ organisation: 'member', route: 'plans-activity' }"/></ClientOnly>

::: warning Note
Cette fonctionnalité requiert un abonnement spécifique. Sans celui-ci, vous ne pourrez pas y accéder.

:point_right: Vous êtes propriétaire d'une organisation ? <ClientOnly><tour-link text="Voir comment souscrire" path="home" :params="{ organisation: 'owner', route: 'edit-organisation-billing' }"/></ClientOnly>
:::

::: details Voir aussi
Comment entrer dans l'activité de gestion des plans depuis le <ClientOnly><tour-link text="tableau de bord" path="home/organisations"/></ClientOnly>

Comment afficher le tableau de bord depuis le <ClientOnly><tour-link text="menu principal" path="home" :params="{ tour: 'home' }"/></ClientOnly>
:::

## Modèle de plan

Un plan s'initie toujours à partir d'un **modèle** qui définit son contenu de base. Dans chaque modèle un titre, une description, et/ou des coordonnateurs par défaut pourront être définis. Ainsi, lors de la création du plan, il ne reste qu'à compléter ou amender certains éléments au besoin tels que les objectifs.

:point_right: Vous êtes gestionnaire d'une organisation ? <ClientOnly><tour-link text="Voir comment gérer vos modèles" path="home" :params="{ organisation: 'manager', route: 'plan-templates-activity' }"/></ClientOnly>

::: details Voir aussi
Comment entrer dans l'activité de gestion des modèles depuis le <ClientOnly><tour-link text="tableau de bord" path="home/organisations"/></ClientOnly>

Comment afficher le tableau de bord depuis le <ClientOnly><tour-link text="menu principal" path="home" :params="{ tour: 'home' }"/></ClientOnly>
:::
