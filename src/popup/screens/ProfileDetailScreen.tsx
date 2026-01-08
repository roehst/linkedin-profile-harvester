import React from 'react';
import { Profile } from '../../types/Profile';
import { Button } from '../../components/Button';

interface ProfileDetailScreenProps {
  profile: Profile;
  onBack: () => void;
}

export const ProfileDetailScreen: React.FC<ProfileDetailScreenProps> = ({
  profile,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Button variant="secondary" onClick={onBack}>
          ← Back to List
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-lg text-gray-600">{profile.title}</p>
          </div>

          <div>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View on LinkedIn →
            </a>
          </div>

          {profile.tags && profile.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Skills & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.summary && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{profile.summary}</p>
            </div>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
              <ul className="space-y-2">
                {profile.experience.map((exp, i) => (
                  <li key={i} className="text-gray-600 pl-4 border-l-2 border-blue-500">
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.education && profile.education.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Education</h3>
              <ul className="space-y-2">
                {profile.education.map((edu, i) => (
                  <li key={i} className="text-gray-600 pl-4 border-l-2 border-green-500">
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Added: {new Date(profile.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
