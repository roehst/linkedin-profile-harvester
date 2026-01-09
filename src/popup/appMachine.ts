import { setup, assign } from 'xstate';
import { Profile } from '../types/Profile';

interface AppContext {
  profiles: Profile[];
  selectedProfile: Profile | null;
  apiKey: string | null;
  searchQuery: string;
  errorMessage: string | null;
  successMessage: string | null;
}

type AppEvents =
  | { type: 'SHOW_SETTINGS' }
  | { type: 'SHOW_PROFILE_LIST' }
  | { type: 'SHOW_PROFILE_DETAIL'; profile: Profile }
  | { type: 'SET_API_KEY'; apiKey: string }
  | { type: 'LOAD_PROFILES'; profiles: Profile[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'SET_SUCCESS'; message: string }
  | { type: 'CLEAR_MESSAGES' };

export const appMachine = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppEvents
  }
}).createMachine({
  id: 'app',
  initial: 'profileList',
  context: {
    profiles: [],
    selectedProfile: null,
    apiKey: null,
    searchQuery: '',
    errorMessage: null,
    successMessage: null
  },
  states: {
    profileList: {
      on: {
        SHOW_SETTINGS: 'settings',
        SHOW_PROFILE_DETAIL: {
          target: 'profileDetail',
          actions: assign({
            selectedProfile: ({ event }) => event.profile
          })
        },
        LOAD_PROFILES: {
          actions: assign({
            profiles: ({ event }) => event.profiles
          })
        },
        SET_ERROR: {
          actions: assign({
            errorMessage: ({ event }) => event.message
          })
        },
        SET_SUCCESS: {
          actions: assign({
            successMessage: ({ event }) => event.message
          })
        },
        CLEAR_MESSAGES: {
          actions: assign({
            errorMessage: () => null,
            successMessage: () => null
          })
        }
      }
    },
    settings: {
      on: {
        SHOW_PROFILE_LIST: 'profileList',
        SET_API_KEY: {
          actions: assign({
            apiKey: ({ event }) => event.apiKey
          })
        },
        SET_ERROR: {
          actions: assign({
            errorMessage: ({ event }) => event.message
          })
        },
        SET_SUCCESS: {
          actions: assign({
            successMessage: ({ event }) => event.message
          })
        },
        CLEAR_MESSAGES: {
          actions: assign({
            errorMessage: () => null,
            successMessage: () => null
          })
        }
      }
    },
    profileDetail: {
      on: {
        SHOW_PROFILE_LIST: {
          target: 'profileList',
          actions: assign({
            selectedProfile: () => null
          })
        }
      }
    }
  }
});
