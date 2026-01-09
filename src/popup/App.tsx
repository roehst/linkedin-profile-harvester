import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { appMachine } from './appMachine';
import { ProfileListScreen } from './screens/ProfileListScreen';
import { ProfileDetailScreen } from './screens/ProfileDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const App: React.FC = () => {
  const [state, send] = useMachine(appMachine);

  useEffect(() => {
    // Clear messages after 3 seconds
    if (state.context?.errorMessage || state.context?.successMessage) {
      const timer = setTimeout(() => {
        send({ type: 'CLEAR_MESSAGES' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.context?.errorMessage, state.context?.successMessage, send]);

  return (
    <div className="w-full h-[600px] bg-gray-50 flex flex-col">
      {/* Messages */}
      {state.context?.errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {state.context.errorMessage}
        </div>
      )}
      {state.context?.successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 text-sm">
          {state.context.successMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {state.matches('profileList') && (
          <ProfileListScreen
            profiles={state.context?.profiles || []}
            onProfileClick={(profile) => send({ type: 'SHOW_PROFILE_DETAIL', profile })}
            onSettingsClick={() => send({ type: 'SHOW_SETTINGS' })}
            onProfilesLoaded={(profiles) => send({ type: 'LOAD_PROFILES', profiles })}
            onError={(message) => send({ type: 'SET_ERROR', message })}
            onSuccess={(message) => send({ type: 'SET_SUCCESS', message })}
          />
        )}

        {state.matches('settings') && (
          <SettingsScreen
            onBack={() => send({ type: 'SHOW_PROFILE_LIST' })}
            onSaveSuccess={() => {
              send({ type: 'SET_SUCCESS', message: 'API key saved successfully' });
              send({ type: 'SHOW_PROFILE_LIST' });
            }}
            onError={(message) => send({ type: 'SET_ERROR', message })}
          />
        )}

        {state.matches('profileDetail') && state.context?.selectedProfile && (
          <ProfileDetailScreen
            profile={state.context.selectedProfile}
            onBack={() => send({ type: 'SHOW_PROFILE_LIST' })}
          />
        )}
      </div>
    </div>
  );
};

export default App;
