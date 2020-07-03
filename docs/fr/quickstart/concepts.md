---
sidebarDepth: 3
---

# Concepts de base

## <i class="las la-user"></i> Utilisateur

Une *personne* qui est **enregistrée** sur Akt'n'Map. Cela peut se faire de deux manières:
  * soit en créant elle-même son **compte** sur l'application,
  * soit en étant *invitée* au sein d'une organisation par un autre utilisateur de l'application.

## <i class="las la-user-friends"></i> Organisation

Un *espace partagé* par plusieurs utilisateurs au sein duquel vous pouvez inviter des personnes à collaborer, notamment pour gérer des **évènements**.

Un utilisateur peut appartenir à *plusieurs* organisations. Selon les organisations, un utilisateur possède des *rôles différents*. Un utilisateur peut également créer de nouvelles organisations.

### <i class="las la-graduation-cap"></i> Rôle

Un **rôle** défini les droits d'un utilisateur au sein d'une organisation ou d'un groupe:
  * en tant que <i class="las la-user"></i> *membre* il ne peut modifier l'état de l'organisation ou du groupe (droit de consultation),
  * en tant que <i class="las la-briefcase"></i> *gestionnaire* il peut modifier l'état de l'organisation ou du groupe (droit d'édition),
  * en tant que <i class="las la-certificate"></i> *propriétaire* il peut supprimer l'organisation ou le groupe (contrôle total).

::: tip
Les droits sont cumulatifs, c'est à dire qu'un propriétaire (respectivement gestionnaire) possède tous les droits d'un gestionnaire (respectivement membre).
:::

Le gestionnaire d'une organisation peut donc:
  * gérer les **membres** au sein de cette organisation,
  * créer des **groupes** au sein de cette organisation.
Le propriétaire peut également détruire l'organisation et gérer les moyens de paiements.

Le gestionnaire d'un groupe peut gérer les **membres** au sein de ce groupe et le modifier. Le propriétaire peut également détruire le groupe.

::: tip
L'utilisateur qui créé une organisation ou un groupe en est par défaut le propriétaire mais il peut partager ou déléguer la gestion à d'autres.
:::

### <i class="las la-sitemap"></i> Groupe

Un **groupe** vous permet de *déléguer* la gestion d'un espace de travail restreint à ses membres. Les utilisateurs en dehors du groupe ne pourrons y accéder ni voir ses membres.

### <i class="las la-tags"></i> Etiquette

Une **étiquette** vous permet de *catégoriser* un sous-ensemble des membres de votre organisation selon un *critère métier* (e.g. une compétence ou un service).

Une étiquette est *transverse* à votre organisation, c'est à dire qu'avec elle vous pouvez cibler des personnes ayant les même critères métier au sein de différents groupes.

## <i class="las la-fire"></i> Evénement

Une *information autour d'un fait* que l'on désire partager et traiter avec certains membres d'une organisation. Typiquement une intervention sur le terrain, des actions de gestion de crise, etc.

Un événement génère des *notifications* sur les mobiles des **participants** lors de sa création, mise à jour et clôture par ses **coordinateurs**.

Les participants et les coordinateurs d'un événement peuvent être choisis comme:
  * des membres de façon individuelle,
  * des groupes,
  * des étiquettes.

::: tip
L'utilisateur qui créé un événement en est par défaut le coordinateur mais il peut partager ou déléguer la gestion à d'autres.
:::

A un évènement, Akt'n'Map permet d’associer :
  * des *photos* ou des *documents* afin de les partager entre les acteurs,
  * un **[processus](../gofurther/processes.md)** définissant les interaction entre les participants et les coordinateurs.

## Participant

Un participant ne peut pas modifier un événement bien qu'il puisse partager des documents ou des photos au sein de celui-ci.

## Coordinateur

Un coordinateur peut modifier et clôturer (i.e. détruire) un événement, ainsi que sa liste de participants ou coordinateurs.

Il a également accès à une *vue cartographique* synthétisant la position des acteurs et leur état d’avancement dans le processus.