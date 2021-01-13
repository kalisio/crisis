# Services

## Users service

The following application-specific [hooks](./hooks.md) are executed on the [`users` service](https://kalisio.github.io/kdk/api/core/services.html#users-service):

<mermaid>
graph TB
  beforeAll{none before all}
  afterAll{none after all}
  beforeAll --> FIND[FIND]
  FIND --> hook1(removeVerification)
  hook1 -- Verification tokens cleared --> afterAll
  beforeAll --> GET[GET]
  GET --> hook2(removeVerification)
  hook2 -- Verification tokens cleared --> afterAll
  beforeAll -- Check for members quota exceeded<br/>-organisation invitation- --> hook3(checkInvitationsQuotas)
  hook3 -- Generate verification tokens --> hook4(addVerification)
  hook4 --> CREATE[CREATE]
  CREATE -- If not invited --> hook5(sendVerificationEmail)
  hook5 --> hook6(createPrivateOrganisation)
  CREATE -- If invited --> hook7(joinOrganisation)
  hook6 -- joined own organisation --> hook8(removeVerification)
  hook7 -- joined sponsor organisation --> hook8
  hook8 -- Verification tokens cleared --> afterAll
  beforeAll --> UPDATE[UPDATE]
  UPDATE --> hook9(removeVerification)
  hook9 -- Verification tokens cleared --> afterAll
  beforeAll --> PATCH[PATCH]
  PATCH --> hook10(removeVerification)
  hook10 -- Verification tokens cleared --> afterAll
  beforeAll -- Check for orphan organisations --> hook11(preventRemoveUser)
  hook11 --> REMOVE[REMOVE]
  REMOVE --> hook12(removeVerification)
  hook12 -- Verification tokens cleared --> afterAll
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Devices service

The following application-specific [hooks](./hooks.md) are executed on the [`devices` service](https://kalisio.github.io/kdk/api/core/services.html#devices-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> UPDATE[UPDATE]
  UPDATE --> hook1(updateSubjectSubscriptions)
  hook1 -- Subscribed to user topics<br/>-organisations, tags, groups- --> hook2(subscribeToAppTopic)
  hook2 -- Subscribed to app topic --> after
  before --> CREATE[CREATE]
  CREATE -- Security email on new device --> hook3(sendNewDeviceEmail)
  hook3 -- Subscribed to user topics<br/>-organisations, tags, groups- --> hook4(subscribeToAppTopic)
  hook4 --> after
  before --> hook5(updateSubjectSubscriptions)
  hook5 -- Unsubscribed from user topics<br/>-organisations, tags, groups- --> hook6(unsubscribeFromAppTopic)
  hook6 -- Unsubscribed from app topic --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Authorisations service

The following application-specific [hooks](./hooks.md) are executed on the [`authorisations` service](https://kalisio.github.io/kdk/api/core/services.html#authorisations-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before -- Check target permissions against user permissions --> hook1(preventEscalation)
  hook1 -- Check for orphan resources<br/>-groups, organisations- --> hook2(preventRemovingLastOwner)
  hook2 -- Check for members quota exceeded<br/>-organisations- --> hook3(checkMembersQuotas)
  hook3 -- Check for owner with billing<br/>-organisations- --> hook4(preventRemovingCustomer)
  hook4 --> CREATE[CREATE]
  CREATE --> hook5(subscribeSubjectsToResourceTopic)
  hook5 -- Subscribed to resource topic --> hook6(unpopulateSubjects)
  hook6 --> hook7(unpopulateResource)
  hook7 -- Clean params for replication --> after
  before -- Check target permissions against user permissions --> hook8(preventEscalation)
  hook8 -- Check for orphan resources<br/>-groups, organisations- --> hook9(preventRemovingLastOwner)
  hook9 -- Check for owner with billing<br/>-organisations- --> hook10(preventRemovingCustomer)
  hook10 --> hook11(removeAuthorisations)
  hook11 -- Removed authorizations on resources<br/>-organisation, tags, groups- --> REMOVE[REMOVE]
  REMOVE --> hook12(unsubscribeSubjectsFromResourceTopic)
  hook12 -- Unsubscribed from resource topic --> hook13(unpopulateSubjects)
  hook13 --> hook14(unpopulateResource)
  hook14 -- Clean params for replication --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13,hook14 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Tags service

The following application-specific [hooks](./hooks.md) are executed on the [`tags` service](https://kalisio.github.io/kdk/api/core/services.html#tags-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before --> CREATE[CREATE]
  CREATE --> hook1(createTopic)
  hook1 --> hook2(unpopulateTagResource)
  hook2 -- Clean params for replication --> after
  before --> UPDATE[UPDATE]
  UPDATE --> after
  before --> PATCH[PATCH]
  PATCH --> after
  before --> REMOVE[REMOVE]
  REMOVE --> hook3(removeTopic)
  hook3 --> hook4(unpopulateTagResource)
  hook4 -- Clean params for replication --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Storage service

The following application-specific [hooks](./hooks.md) are executed on the [`storage` service](https://kalisio.github.io/kdk/api/core/services.html#storage-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before --> hook1(forwardNotification)
  hook1 -- Get notification message when<br/>updating attachment on event --> CREATE[CREATE]
  CREATE --> hook2(unpopulateAttachmentResource)
  hook2 -- Clean params for replication --> after
  before --> UPDATE[UPDATE]
  UPDATE --> after
  before --> PATCH[PATCH]
  PATCH --> after
  before --> REMOVE[REMOVE]
  REMOVE --> hook3(unpopulateAttachmentResource)
  hook3 -- Clean params for replication --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Organisations service

The following specific application-specific [hooks](./hooks.md) are executed on the [`organisations` service](https://kalisio.github.io/kdk/api/core/services.html#organisations-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before -- Check for organisations quota exceeded --> hook1(checkOrganisationsQuotas)
  hook1 --> CREATE[CREATE]
  CREATE --> hook2(createOrganisationServices)
  hook2 -- Organisartion services up --> hook3(createTopic)
  hook3 -- Set user as owner --> hook4(createOrganisationAuthorisations)
  hook4 --> hook5(subscribeDefaultPlan)
  hook5 --> after
  before --> UPDATE[UPDATE]
  UPDATE --> after
  before -- Check for organisations quota exceeded<br/>when updating plan --> hook6(checkOrganisationsQuotas)
  hook6 -- Check for plan quotas exceeded<br/>-members, groups, events, templates, alerts- --> hook7(checkPlanQuotas)
  hook7 --> PATCH[PATCH]
  PATCH --> after
  before -- Check for empty organisation --> hook8(preventRemoveOrganisation)
  hook8 --> REMOVE[REMOVE]
  REMOVE -- Flag organisation as to be deleted --> hook9(setAsDeleted)
  hook9 -- Unset user as owner --> hook10(removeOrganisationAuthorisations)
  hook10 --> hook11(removeTopic)
  hook11 --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13,hook14 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Members service

The following application-specific [hooks](./hooks.md) are executed on the [`members` service](https://kalisio.github.io/kdk/api/core/services.html#members-service):

<mermaid>
graph TB
  beforeAll{none before all}
  afterAll{none after all}
  beforeAll --> FIND[FIND]
  FIND --> afterAll
  beforeAll --> GET[GET]
  GET --> afterAll
  beforeAll --> CREATE[CREATE]
  CREATE --> afterAll
  beforeAll --> UPDATE[UPDATE]
  UPDATE --> afterAll
  beforeAll --> hook1(populatePreviousObject)
  hook1 -- Previous user as params<br/>-required to update subscriptions- --> hook2(updateTags)
  hook2 -- Created new tags<br/>Removed unused tags --> hook3(updateSubjectSubscriptions)
  hook3 -- Subscribed to added tags topics<br/>Unsubscribed from removed tags topics --> PATCH[PATCH]
  PATCH --> hook4(updateAbilities)
  hook4 -- Abilities updated in cache --> afterAll
  beforeAll --> REMOVE[REMOVE]
  REMOVE --> afterAll
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11,hook12,hook13 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>

## Groups service

The following application-specific [hooks](./hooks.md) are executed on the [`groups` service](https://kalisio.github.io/kdk/api/core/services.html#groups-service):

<mermaid>
graph TB
  before{none before all}
  after{none after all}
  before --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before -- Check for groups quota exceeded --> hook1(checkGroupsQuotas)
  hook1 --> CREATE[CREATE]
  CREATE --> hook2(createTopic)
  hook2 -- Set user as owner --> hook3(createGroupAuthorisations)
  hook3 --> after
  before --> UPDATE[UPDATE]
  UPDATE --> after
  before --> PATCH[PATCH]
  PATCH --> after
  before --> REMOVE[REMOVE]
  REMOVE -- Flag group as to be deleted --> hook4(setAsDeleted)
  hook4 -- Unset user as owner --> hook5(removeGroupAuthorisations)
  hook5 --> hook6(removeTopic)
  hook6 --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
</mermaid>


