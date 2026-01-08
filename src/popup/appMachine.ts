import { createMachine, assign } from 'xstate';
import { Profile } from '../types/Profile';

interface AppContext {
  profiles: Profile[];
  selectedProfile: Profile | null;
  apiKey: string | null;
  searchQuery: string;
  errorMessage: string | null;
  successMessage: string | null;
}

export const appMachine = createMachine({
  id: 'app',
  initial: 'profileList',
  types: {} as {
    context: AppContext;
  },
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
            selectedProfile: (_, event: any) => event.profile
          })
        },
        LOAD_PROFILES: {
          actions: assign({
            profiles: (_, event: any) => event.profiles
          })
        },
        SET_ERROR: {
          actions: assign({
            errorMessage: (_, event: any) => event.message
          })
        },
        SET_SUCCESS: {
          actions: assign({
            successMessage: (_, event: any) => event.message
          })
        },
        CLEAR_MESSAGES: {
          actions: assign({
            errorMessage: null,
            successMessage: null
          })
        }
      }
    },
    settings: {
      on: {
        SHOW_PROFILE_LIST: 'profileList',
        SET_API_KEY: {
          actions: assign({
            apiKey: (_, event: any) => event.apiKey
          })
        },
        SET_ERROR: {
          actions: assign({
            errorMessage: (_, event: any) => event.message
          })
        },
        SET_SUCCESS: {
          actions: assign({
            successMessage: (_, event: any) => event.message
          })
        },
        CLEAR_MESSAGES: {
          actions: assign({
            errorMessage: null,
            successMessage: null
          })
        }
      }
    },
    profileDetail: {
      on: {
        SHOW_PROFILE_LIST: {
          target: 'profileList',
          actions: assign({
            selectedProfile: null
          })
        }
      }
    }
  }
});
