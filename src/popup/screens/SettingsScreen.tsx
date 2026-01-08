import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface SettingsScreenProps {
  onBack: () => void;
  onSaveSuccess: () => void;
  onError: (message: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onSaveSuccess,
  onError
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_API_KEY' });
      if (response.success && response.apiKey) {
        setApiKey(response.apiKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      onError('Please enter an API key');
      return;
    }

    setLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_API_KEY',
        apiKey: apiKey.trim()
      });

      if (response.success) {
        onSaveSuccess();
      } else {
        onError(response.message || 'Failed to save API key');
      }
    } catch (error) {
      onError('Error saving API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={setApiKey}
            placeholder="sk-..."
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored locally and only used for profile enrichment
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save API Key'}
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an API key?{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
