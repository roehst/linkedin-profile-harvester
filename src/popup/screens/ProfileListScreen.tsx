import React, { useEffect, useState } from 'react';
import { Profile } from '../../types/Profile';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ExportDataService } from '../../services/ExportDataService';

interface ProfileListScreenProps {
  profiles: Profile[];
  onProfileClick: (profile: Profile) => void;
  onSettingsClick: () => void;
  onProfilesLoaded: (profiles: Profile[]) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const ProfileListScreen: React.FC<ProfileListScreenProps> = ({
  profiles,
  onProfileClick,
  onSettingsClick,
  onProfilesLoaded,
  onError,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [harvesting, setHarvesting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [displayProfiles, setDisplayProfiles] = useState(profiles);
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadProfiles();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setDisplayProfiles(profiles);
  }, [profiles]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_ALL_PROFILES' });
      if (!isMountedRef.current) return;

      if (response.success) {
        onProfilesLoaded(response.profiles || []);
      } else {
        onError('Failed to load profiles');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      onError('Error loading profiles');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleHarvestCurrent = async () => {
    setHarvesting(true);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!isMountedRef.current) return;

      if (!tabs[0]?.url) {
        onError('No active tab found');
        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'ENRICH_PROFILE',
        url: tabs[0].url,
        tabId: tabs[0].id
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        onSuccess('Profile harvested successfully!');
        await loadProfiles();
      } else {
        onError(response.error || 'Failed to harvest profile');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      onError('Error harvesting profile');
    } finally {
      if (isMountedRef.current) {
        setHarvesting(false);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'DELETE_PROFILE',
        id
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        onSuccess('Profile deleted');
        await loadProfiles();
      } else {
        onError('Failed to delete profile');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      onError('Error deleting profile');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setDisplayProfiles(profiles);
      return;
    }

    setSearching(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SEARCH_PROFILES',
        query: searchQuery
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        setDisplayProfiles(response.profiles || []);
      } else {
        onError('Search failed');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      onError('Error searching profiles');
    } finally {
      if (isMountedRef.current) {
        setSearching(false);
      }
    }
  };

  const handleExport = (format: 'json' | 'markdown' | 'csv') => {
    if (displayProfiles.length === 0) {
      onError('No profiles to export');
      return;
    }

    try {
      switch (format) {
        case 'json':
          ExportDataService.exportAsJson(displayProfiles);
          break;
        case 'markdown':
          ExportDataService.exportAsMarkdown(displayProfiles);
          break;
        case 'csv':
          ExportDataService.exportAsCsv(displayProfiles);
          break;
      }
      onSuccess(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      onError('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">LinkedIn Profiles</h1>
          <Button variant="secondary" onClick={onSettingsClick}>
            Settings
          </Button>
        </div>

        <Button
          onClick={handleHarvestCurrent}
          disabled={harvesting}
          className="w-full mb-4"
        >
          {harvesting ? 'Harvesting...' : 'Harvest Current Profile'}
        </Button>

        <div className="flex gap-2 mb-4">
          <Input
            type="search"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search profiles with AI..."
            disabled={searching}
          />
          <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {searchQuery && (
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setDisplayProfiles(profiles);
            }}
            className="w-full text-sm"
          >
            Clear Search
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {displayProfiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {profiles.length === 0
                ? 'No profiles yet. Harvest a LinkedIn profile to get started!'
                : 'No profiles match your search'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => onProfileClick(profile)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                    <p className="text-sm text-gray-600">{profile.title}</p>
                    {profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {profile.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{profile.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      const e = { stopPropagation: () => {} } as React.MouseEvent;
                      handleDelete(profile.id, e);
                    }}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {displayProfiles.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Export {displayProfiles.length} profiles:</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleExport('json')} className="flex-1 text-sm">
              JSON
            </Button>
            <Button variant="secondary" onClick={() => handleExport('markdown')} className="flex-1 text-sm">
              Markdown
            </Button>
            <Button variant="secondary" onClick={() => handleExport('csv')} className="flex-1 text-sm">
              CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
