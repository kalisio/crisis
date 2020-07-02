# Processes

By default an event template is a simple information message without any interaction between participants and coordinators
Adding a workflow you can define a sequence of interactions (i.e. multiple-choice questions) that must be fulfilled by the participant and/or the coordinator of the event

Workflow example composed of two steps:
  1. awaited participant interaction: *are available or not available to intervene on this event ?*
  2. awaited coordinator response: *you are engaged or you are not engaged on this event*

::: tip
Each answer of the coordinator to a question for a step of the process generates a notification toward the target participant.
:::

<mermaid>
graph TD
  E[Event creation] --> |Notification| P1(Participant)
  P1 --> |Question| Q1{Available ?}
  Q1 --> |Yes| C(Coordinatoor)
  Q1 --> |No| F1[Interaction end]
  C --> |Question| Q2{Engager ?}
  Q2 --> |Yes - Notification| P2(Participant)
  Q2 --> |No - Notification| F2[Interaction end]
</mermaid>

