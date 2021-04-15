const tours = require('../tours')

module.exports = {
  '/' : {
    name: 'index',
    component: 'Index',
    // By default all child routes are considered unauthenticated,
    // will be overriden when required
    meta: { unauthenticated: true },
    children: {
      'terms': 'Terms',
      'login': {
        component: 'authentication/KLogin',
        tour: tours.login
      },
      'logout': {
        component: 'authentication/KLogout',
        meta: { authenticated: true }
      },
      'register': {
        component: 'authentication/KRegister',
        tour: tours.register
      },
      'change-endpoint': 'authentication/KChangeEndpoint',
      'resend-verify-signup': {
        component: 'account/KResendVerifySignup',
        meta: { authenticated: true }
      },
      'verify-signup/:token': {
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
      'reset-password/:token': 'account/KResetPassword',
      'send-change-identity': {
        component: 'account/KSendChangeIdentity',
        meta: { authenticated: true, unauthenticated: false },
        tour: tours['send-change-identity']
      },
      'change-identity/:token': {
        component: 'account/KChangeIdentity',
        meta: { authenticated: true }
      },
      'home': {
        // The name of the route has to be set the default child
        name: '',
        component: 'layout/KHome',
        meta: { authenticated: true, unauthenticated: false },
        children: {
          'default-home-view': {
            // Because this child is the default one path is empty and name is the one of the parent route
            path: '',
            name: 'home',
            redirect: { name: 'organisations-activity' }
          },
          'organisations': {
            name: 'organisations-activity',
            component: 'team/KOrganisationsActivity',
            tour: {
              'organisations-activity': tours['organisations'],
              'side-nav': tours['side-nav']
            },
            children: {
              'create': {
                name: 'create-organisation',
                component: 'editor/KModalEditor',
                props: true,
                tour: tours['create-organisation']
              }
            }
          },
          'account/:page': {
            name: 'account-activity',
            component: 'account/KAccountActivity',
            props: true,
            tour: {
              'profile': tours['account-profile'],
              'security': tours['account-security'],
              'danger-zone': tours['account-dz']
            }
          },
          ':contextId': {
            // The name of the route has to be set the default child
            name: '',
            component: 'Context',
            props: true,
            children: {
              'default-context-view': {
                // Because this child is the default one path is empty and name is the one of the parent route
                path: '',
                name: 'context',
                redirect: { name: 'events-activity' },
                tour: tours.context
              },
              'members': {
                name: 'members-activity', 
                component: 'team/KMembersActivity', 
                props: true,
                children: {
                  'invite': {
                    name: 'invite-member',
                    component: 'team/KInviteMember',
                    props: true,
                    tour: tours['invite-member']
                  },
                  'add': {
                    name: 'add-member',
                    component: 'team/KAddMember',
                    props: true,
                    tour: tours['add-member']
                  },
                  ':objectId/tag': {
                    name: 'tag-member',
                    component: 'editor/KModalEditor',
                    props: true,
                    tour: tours['tag-member']
                  },
                  ':objectId/join-group': {
                    name: 'join-group',
                    component: 'team/KJoinGroup',
                    props: true,
                    tour: tours['join-group']
                  },
                  ':objectId/change-role': {
                    name: 'change-role',
                    component: 'team/KChangeRole',
                    props: true,
                    tour: tours['change-role']
                  },
                },
                tour: tours.members
              },
              'tags': {
                name: 'tags-activity',
                component: 'team/KTagsActivity',
                props: true,
                children: {
                  'edit/:objectId': {
                    name: 'edit-tag',
                    component: 'editor/KModalEditor',
                    props: true
                  }
                },
                tour: tours.tags
              },
              'groups': {
                name: 'groups-activity',
                component: 'team/KGroupsActivity',
                props: true,
                children: {
                  'create': {
                    name: 'create-group',
                    component: 'editor/KModalEditor',
                    props: true,
                    tour: tours['create-group']
                  },
                  'edit/:objectId': {
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
                  'timeline': tours['timeline'],
                  'fab': tours['fab']
                },
                children: {
                  add: {
                    name: 'add-layer',
                    component: 'catalog/KAddLayer',
                    tour: {
                      'add-layer': tours['add-layer'],
                      'import-layer': tours['import-layer'],
                      'connect-layer': tours['connect-layer'],
                      'create-layer': tours['create-layer']
                    }
                  },
                  categories: {
                    name: 'manage-layer-categories',
                    component: 'catalog/KLayerCategories',
                    tour: tours['catalog-categories']
                  }
                }
              },
              'events': {
                name: 'events-activity',
                component: 'EventsActivity',
                props: true,
                children: {
                  'create/:templateId/:layerId?/:featureId?/longitude?/:latitude?': {
                    name: 'create-event',
                    component: 'EventEditor',
                    props: true,
                    tour: tours['create-event']
                  },
                  'edit/:objectId': {
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
                  },
                },
                tour: {
                  'archived-events-activity': tours['archived-events'],
                  'map': tours['archived-events-map'],
                  'chart': tours['archived-events-chart']
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
                  'edit': {
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
                    tour: tours['create-event-templates']
                  },
                  'edit/:objectId/:perspective?': {
                    name: 'edit-event-template',
                    component: 'EventTemplateEditor',
                    props: true
                  }
                },
                tour: tours['event-templates']
              },
              ':tab': {
                name: 'organisation-settings-activity',
                component: 'OrganisationSettingsActivity',
                props: true,
                tour: {
                  'properties': tours['organisation-properties'],
                  'billing': tours['organisation-billing'],
                }
              }
            }
          }
        }
      }
    }
  },
  '*': 'Error404'
}
