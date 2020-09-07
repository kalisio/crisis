---
sidebarDepth: 3
---

# Processus

Par défaut un modèle d'événement est un simple message informatif sans possibilité d’interaction entre les participants et les coordinateurs.

L'ajout d'un **processus** permet de définir une *séquence d'interactions* (i.e. questions à choix multiples) auxquelles doivent répondre le participant et/ou le coordinateur de l'événement.

Un processus en deux étapes pourrait être celui-ci:
  1. interaction du participant attendue: *êtes-vous disponible ou indisponible pour intervenir sur cet événement ?*
  2. réponse du coordinateur attendue: *je vous engage ou je ne vous engage pas sur cet événement*

::: tip Astuce
Chaque réponse du coordinateur à la question d'une étape du processus engendre la génération d'une notification vers le participant destinataire.
:::

<mermaid>
graph TD
  E[Création de l'événement] --> |Notification| P1(Participant)
  P1 --> |Question| Q1{Disponible ?}
  Q1 --> |Oui| C(Coordinateur)
  Q1 --> |Non| F1[Fin de l'interaction]
  C --> |Question| Q2{Engager ?}
  Q2 --> |Oui - Notification| P2(Participant)
  Q2 --> |Non - Notification| F2[Fin de l'interaction]
</mermaid>

## Définition

En pratique, un éditeur dédié permet de définir chaque étape au sein de l'application, par exemple son titre et la question à laquelle les intervenants devront répondre. Pour notre exemple la configuration de la première étape ressemblerait à ceci:

![workflow-step-1](../../assets/Event-Workflow-1-FR.png)

Et celle de la seconde étape ressemblerait à ceci:

![workflow-step-2](../../assets/Event-Workflow-2-FR.png)

:point_right: Vous êtes gestionnaire d'une organisation ? <tour-link text="Voir comment créer un modèle avec processus" path="home" :params="{ organisation: 'manager', route: 'create-event-template' }"/>

## Exécution

Lors de la réception de l'événement par un intervenant l'application lui demandera de choisir parmi les réponses possibles et le fera avancer à l'étape suivante du processus, ou stoppera ses interactions à ce niveau, suivant sa réponse. A chaque étape un commentaire libre optionnel peut permettre de fournir des informations supplémentaires:

![workflow-interaction](../../assets/Interaction-FR.png)

Le coordinateur dispose quant à lui d'une *vue cartographique* synthétisant la position des intervenants et leur état d'avancement selon l'icônographie définie dans le processus. En un clin d'oeil il visualise la liste des participants ayant reçu l'événement ainsi que leur réponses. Il sait également qu'il doit engager une interaction avec ceux attendant une réponse de sa part conformément à la définition du processus grâce à une icône dédiée:

![workflow-map](../../assets/Event-Map-FR.png)
