module.exports = {
  login: require('./core/login'),
  'send-reset-password': require('./core/send-reset-password'),
  register: require('./core/register'),
  organisations: require('./organisations'),
  'create-organisation': require('./core/create-organisation'),
  'edit-organisation': require('./edit-organisation'),
  groups: require('./core/groups'),
  'create-group': require('./core/create-group'),
  members: require('./core/members'),
  'add-member': require('./core/add-member'),
  'join-group': require('./core/join-group'),
  'edit-member-role': require('./core/edit-member-role'),
  tags: require('./core/tags'),
  'create-tag': require('./core/create-tag'),
  'add-tag': require('./core/add-tag'),
  'side-nav': require('./side-nav'),
  events: require('./events'),
  'create-event': require('./create-event'),
  'event-templates': require('./event-templates'),
  'create-event-template': require('./create-event-template'),
  'edit-event-template-workflow': require('./edit-event-template-workflow'),
  'archived-events': require('./archived-events'),
  'archived-events-chart': require('./archived-events-chart'),
  'archived-events-map': require('./archived-events-map'),
  plans: require('./plans'),
  'create-plan': require('./create-plan'),
  'plan-templates': require('./plan-templates'),
  'create-plan-template': require('./create-plan-template'),
  'archived-plans': require('./archived-plans'),
  catalog: require('./catalog'),
  'navigation-bar': require('./map/navigation-bar'),
  'catalog-panel': require('./map/catalog-panel'),
  'catalog-categories': require('./map/catalog-categories'),
  'add-layer': require('./map/add-layer'),
  'import-layer': require('./map/import-layer'),
  'connect-layer': require('./map/connect-layer'),
  'create-layer': require('./map/create-layer'),
  'create-view': require('./map/create-view'),
  timeline: require('./map/timeline'),
  fab: require('./map/fab')
}
