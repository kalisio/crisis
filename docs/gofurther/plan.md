# <i class="las la-stream"></i> Plan

A *set of events linked to a situation* to be managed. Typical plans are business continuity plans, internal operation plans, etc. A plan is usually designed according to a set of objectives.

::: tip
By creating a plan you become the coordinator by default but you can share this responsibility with others by adding them as a coordinator as well.
:::

In order to help you manage the progress of your plan it allows to:
1. Define the different objectives to be tackled by the plan
2. Track the progress of the events in the plan

An *objective* consists of a title/description with an optional localization (e.g. danger zone to be evacuated). You can include links to your information sheets, documents, etc. within the rich description. Each event in your plan can then be attached to a specific objective and you can filter them accordingly in all activities (events list, event maps, events logbook).

Moreover, the plan provides you with a Kanban board composed of three columns:
* *To do*: events not yet having any participant,
* *Doing*: events having participants but not yet closed,
* *Done*: closed events.

:point_right: Ready to activate a plan ? <ClientOnly><tour-link text="How to manage your plans" path="home" :params="{ organisation: 'member', route: 'plans-activity' }"/></ClientOnly>

::: warning Note
This feature requires a specific subscription, it will not be available otherwise.

:point_right: You own an organisation ? <ClientOnly><tour-link text="How to subscribe" path="home" :params="{ organisation: 'owner', route: 'edit-organisation-billing' }"/></ClientOnly>
:::

::: details See also
How to enter the plans activity from the <ClientOnly><tour-link text="dashboard" path="home/organisations"/></ClientOnly>

How to display the dashboard from the <ClientOnly><tour-link text="main menu" path="home" :params="{ tour: 'home' }"/></ClientOnly>
:::

## Plan templates

A plan is always created from a **template** that define its basic content. Each model includes a default title, description and/or set of coordinators. This way, when creating a plan, only remains to complete or update some elements like the objectives.

:point_right: You manage an organisation ? <ClientOnly><tour-link text="How to manage your templates" path="home" :params="{ organisation: 'manager', route: 'plan-templates-activity' }"/></ClientOnly>

::: details See also
How to enter the models management activity from the <ClientOnly><tour-link text="dashboard" path="home/organisations"/></ClientOnly>

How to display the dashboard from the <ClientOnly><tour-link text="main menu" path="home" :params="{ tour: 'home' }"/></ClientOnly>
:::
