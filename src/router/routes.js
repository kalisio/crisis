const _ = require('lodash')
const tours = require('../tours')

module.exports = [{
  path: '/',
  name: 'index',
  component: 'Index',
  meta: { unauthenticated: true },
  children: {
    login: {
      component: 'screen/KLoginScreen',
      tour: tours.login
    },
    logout: {
      component: 'screen/KLogoutScreen',
      meta: { authenticated: true }
    },
    register: {
      component: 'screen/KRegisterScreen',
      tour: tours.register
    },
    'resend-verify-signup': {
      component: 'account/KResendVerifySignup',
      meta: { authenticated: true }
    },
    'verify-signup': {
      component: 'account/KVerifySignup',
      meta: { authenticated: true }
    },
    'send-reset-password': {
      component: 'account/KSendResetPassword',
      tour: tours['send-reset-password']
    },
    'change-password': {
      component: 'account/KChangePassword',
      meta: { authenticated: true, unauthenticated: false },
      tour: tours['change-password']
    },
    'reset-password/:email': 'account/KResetPassword',
    'send-change-identity': {
      component: 'account/KSendChangeIdentity',
      meta: { authenticated: true, unauthenticated: false },
      tour: tours['send-change-identity']
    },
    'change-identity': {
      component: 'account/KChangeIdentity',
      meta: { authenticated: true }
    },
    home: {
      // The name of the route has to be set the default child
      name: '',
      component: 'app/KHome',
      meta: { authenticated: true, unauthenticated: false },
      children: {
        'default-home-view': {
          // Because this child is the default one path is empty and name is the one of the parent route
          path: '',
          name: 'home',
          tour: tours['side-nav'],
          redirect: { name: 'organisations-activity' }
        },
        organisations: {
          name: 'organisations-activity',
          component: 'team/KOrganisationsActivity',
          tour: {
            'organisations-activity': tours.organisations
          },
          children: {
            create: {
              name: 'create-organisation',
              component: 'editor/KModalEditor',
              props: true,
              tour: tours['create-organisation']
            },
            'edit/:objectId/:schemaProperties?': {
              name: 'edit-organisation',
              component: 'editor/KModalEditor',
              props: true,
              tour: tours['edit-organisation']
            }
          }
        },
        ':contextId': {
          // The name of the route has to be set the default child
          name: '',
          component: 'Context',
          props: true,
          meta: { can: ['read', 'members', ':contextId'] },
          children: {
            'default-context-view': {
              // Because this child is the default one path is empty and name is the one of the parent route
              path: '',
              name: 'context',
              redirect: { name: 'events-activity' },
              tour: tours.context
            },
            members: {
              name: 'members-activity',
              component: 'team/KMembersActivity',
              props: true,
              children: {
                add: {
                  name: 'add-member',
                  component: 'team/KAddMember',
                  props: true,
                  tour: tours['add-member']
                },
                'edit/:objectId/role': {
                  name: 'edit-member-role',
                  component: 'team/KChangeRole',
                  props: true,
                  tour: tours['edit-member-role']
                },
                'add-tag/:objectId': {
                  name: 'add-tag',
                  component: 'team/KAddTag',
                  props: true,
                  tour: tours['add-tag']
                },
                'join-group/:objectId': {
                  name: 'join-group',
                  component: 'team/KJoinGroup',
                  props: true,
                  tour: tours['join-group']
                }
              },
              tour: tours.members
            },
            tags: {
              name: 'tags-activity',
              component: 'team/KTagsActivity',
              props: true,
              children: {
                create: {
                  name: 'create-tag',
                  component: 'editor/KModalEditor',
                  props: true,
                  tour: tours['create-tag']
                },
                'edit/:objectId/:schemaProperties?': {
                  name: 'edit-tag',
                  component: 'editor/KModalEditor',
                  props: true
                }
              },
              tour: tours.tags
            },
            groups: {
              name: 'groups-activity',
              component: 'team/KGroupsActivity',
              props: true,
              children: {
                create: {
                  name: 'create-group',
                  component: 'editor/KModalEditor',
                  props: true,
                  tour: tours['create-group']
                },
                'edit/:objectId/:schemaProperties?': {
                  name: 'edit-group',
                  component: 'editor/KModalEditor',
                  props: true
                }
              },
              tour: tours.groups
            },
            'catalog/:south?/:west?/:north?/:east?': {
              name: 'catalog-activity',
              component: 'CatalogActivity',
              props: true,
              tour: {
                'catalog-activity': tours.catalog,
                'navigation-bar': tours['navigation-bar'],
                'favorite-views': tours['favorite-views'],
                'catalog-panel': tours['catalog-panel'],
                'catalog-categories': tours['catalog-categories'],
                timeline: tours.timeline,
                fab: tours.fab
              },
              children: {
                'create-view': {
                  name: 'create-map-view',
                  component: 'catalog/KCreateView',
                  tour: tours['create-view']
                },
                'add-layer': {
                  name: 'add-map-layer',
                  component: 'catalog/KAddLayer',
                  tour: {
                    'add-layer': tours['add-layer'],
                    'import-layer': tours['import-layer'],
                    'connect-layer': tours['connect-layer'],
                    'create-layer': tours['create-layer']
                  }
                },
                'layer-chart/:layerId?': {
                  name: 'map-layer-chart',
                  component: 'KFeaturesChart',
                  props: true
                },
                'layer-filter/:layerId?': {
                  name: 'map-layer-filter',
                  component: 'KFeaturesFilter',
                  props: true
                },
                'layer-table/:layerId?': {
                  name: 'map-layer-table',
                  component: 'KFeaturesTable',
                  props: true
                },
                'edit-layer/:layerId': {
                  name: 'edit-map-layer',
                  component: 'KLayerEditor',
                  props: true
                },
                'edit-layer-style/:layerId?': {
                  name: 'edit-map-layer-style',
                  component: 'KLayerStyleEditor',
                  props: true
                },
                'edit-layer-feature/:layerId?/:featureId': {
                  name: 'edit-map-layer-feature',
                  component: 'KFeatureEditor',
                  props: true
                },
                categories: {
                  name: 'manage-layer-categories',
                  component: 'catalog/KLayerCategories',
                  tour: tours['catalog-categories']
                }
              }
            },
            plans: {
              name: 'plans-activity',
              component: 'PlansActivity',
              props: true,
              children: {
                'create/:templateId?': {
                  name: 'create-plan',
                  component: 'PlanEditor',
                  props: true,
                  tour: tours['create-plan']
                },
                'edit/:objectId/objectives': {
                  name: 'edit-plan-objectives',
                  component: 'PlanObjectivesEditor',
                  props: true
                },
                'edit/:objectId/:schemaProperties?': {
                  name: 'edit-plan',
                  component: 'editor/KModalEditor',
                  props: true
                }
              },
              tour: tours.plans
            },
            'archived-plans': {
              name: 'archived-plans-activity',
              component: 'ArchivedPlansActivity',
              props: true,
              children: {
                'view/:objectId': {
                  name: 'view-plan-event',
                  component: 'viewer/KModalViewer',
                  props: true
                }
              },
              tour: tours['archived-plans']
            },
            events: {
              name: 'events-activity',
              component: 'EventsActivity',
              props: true,
              children: {
                'create/:templateId/:layerId?/:featureId?/:longitude?/:latitude?': {
                  name: 'create-event',
                  component: 'EventEditor',
                  // Required to cast to numbers
                  props: (route) => {
                    const props = _.get(route, 'params', {})
                    if (_.has(props, 'longitude')) _.set(props, 'longitude', _.toNumber(_.get(props, 'longitude')))
                    if (_.has(props, 'latitude')) _.set(props, 'latitude', _.toNumber(_.get(props, 'latitude')))
                    return props
                  },
                  tour: tours['create-event']
                },
                'edit/:objectId/:schemaProperties?': {
                  name: 'edit-event',
                  component: 'EventEditor',
                  props: true
                }
              },
              tour: tours.events
            },
            'archived-events/:south?/:west?/:north?/:east?': {
              name: 'archived-events-activity',
              component: 'ArchivedEventsActivity',
              props: true,
              children: {
                'view/:objectId': {
                  name: 'view-event',
                  component: 'viewer/KModalViewer',
                  props: true
                }
              },
              tour: {
                'archived-events-activity': tours['archived-events'],
                map: tours['archived-events-map'],
                chart: tours['archived-events-chart']
              }
            },
            'events/:objectId/:south?/:west?/:north?/:east?': {
              name: 'event-activity',
              component: 'EventActivity',
              props: true,
              children: {
                'log/:logId': {
                  name: 'event-log',
                  component: 'EventLogEditor',
                  props: true
                },
                edit: {
                  name: 'edit-map-event',
                  component: 'EventEditor',
                  props: true
                }
              }
            },
            'event-templates': {
              name: 'event-templates-activity',
              component: 'EventTemplatesActivity',
              props: true,
              children: {
                'create/:templateId?': {
                  name: 'create-event-template',
                  component: 'EventTemplateEditor',
                  props: true,
                  tour: tours['create-event-template']
                },
                'edit/:objectId/:schemaProperties?': {
                  name: 'edit-event-template',
                  component: 'EventTemplateEditor',
                  props: true
                },
                'edit-workflow/:objectId': {
                  name: 'edit-event-template-workflow',
                  component: 'EventTemplateWorkflowEditor',
                  props: function (route) {
                    return {
                      contextId: route.params.contextId,
                      objectId: route.params.objectId,
                      perspective: 'workflow',
                      perspectiveAsObject: false
                    }
                  },
                  tour: tours['edit-event-template-workflow']
                }
              },
              tour: tours['event-templates']
            },
            'plan-templates': {
              name: 'plan-templates-activity',
              component: 'PlanTemplatesActivity',
              props: true,
              children: {
                'create/:templateId?': {
                  name: 'create-plan-template',
                  component: 'editor/KModalEditor',
                  props: true,
                  tour: tours['create-plan-template']
                },
                'edit/:objectId/objectives': {
                  name: 'edit-plan-template-objectives',
                  component: 'PlanObjectivesEditor',
                  props: true
                },
                'edit/:objectId/:schemaProperties?': {
                  component: 'editor/KModalEditor',
                  props: true
                }
              },
              tour: tours['plan-templates']
            }
          }
        }
      }
    }
  }
},
// Always leave this as last one,
// but you can also remove it
{
  path: '/:catchAll(.*)*',
  component: 'screen/KErrorScreen'
}
]
