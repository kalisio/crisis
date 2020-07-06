# Processus

Par défaut un modèle d'événement est un simple message informatif sans possibilité d’interaction entre les participants et les coordinateurs.

L'ajout d'un **processus** permet de définir une *séquence d’interactions* (i.e. questions à choix multiples) auxquelles doivent répondre le participant et/ou le coordinateur de l'événement.

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

