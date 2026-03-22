import React from 'react';
import type { EmployeeProfile } from '../../shared/api/types/UserProfile';
import './ProfileCard.css';

interface ProfileCardProps {
  profile: EmployeeProfile;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-initials">{initials}</span>
        </div>
        <h2 className="profile-name">{profile.name}</h2>
      </div>

      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Логин:</span>
          <span className="info-value">{profile.login}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Статус:</span>
          <span className="info-value">{profile.status}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Кредитный рейтинг:</span>
          <span className="info-value">{profile.creditRating}</span>
        </div>
      </div>

      {onEdit && (
        <button
          className="edit-profile-button"
          onClick={onEdit}
          aria-label="Редактировать профиль"
        >
          <svg className="edit-icon" viewBox="0 0 24 24" width="18" height="18">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          Редактировать профиль
        </button>
      )}
    </div>
  );
};