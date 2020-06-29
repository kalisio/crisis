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
        component: 'Home',
        meta: { authenticated: true, unauthenticated: false },
        children: {
          'default-home-view': {
            // Because this child is the default one path is empty and name is the one of the parent route
            path: '',
            name: 'home',
            redirect: { name: 'dashboard' },
            tour: tours.home
          },
          'dashboard': {
            path: 'dashboard',
            component: 'EventDashboard',
            tour: tours.dashboard
          },
          'help': 'Help',
          'account/:perspective': {
            name: 'account-activity',
            component: 'account/KAccountActivity',
            props: true,
            tour: tours.account
          },
          'create-organisation' : {
            name: 'create-organisation',
            component: 'editor/KModalEditor',
            props: true
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
                redirect: { name: 'events-activity' }
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
                tour: tours.catalog
              },
              'events': {
                name: 'events-activity',
                component: 'EventsActivity',
                props: true,
                children: {
                  'create/:templateId/:layerId?/:featureId?': {
                    name: 'create-event',
                    component: 'EventEditor',
                    props: true,
                    tour: tours['create-event']
                  },
                  'edit/:objectId': {
                    name: 'edit-event',
                    component: 'EventEditor',
                    props: true
                  },
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
                tour: tours['archived-events']
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
              ':perspective': {
                name: 'organisation-settings-activity',
                component: 'OrganisationSettingsActivity',
                props: true
              }
            }
          }
        }
      }
    }
  },
  '*': 'Error404'
}
