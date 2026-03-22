import React, { useState } from 'react';
import type {EmployeeProfile,UpdateEmployeeProfileDto} from '../../shared/api/types/UserProfile';
import './EditProfile.css';

interface EditProfileProps {
  profile: EmployeeProfile;
  onClose: () => void;
  onSave: (updatedProfile: UpdateEmployeeProfileDto) => Promise<void>;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  profile,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [login, setLogin] = useState(profile.login);
  const [password, setPassword] = useState(profile.password || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Имя не может быть пустым');
      return false;
    }

    if (name.trim().length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return false;
    }

    if (!login.trim()) {
      setError('Логин не может быть пустым');
      return false;
    }

    if (login.trim().length < 3) {
      setError('Логин должен содержать минимум 3 символа');
      return false;
    }

    if (!password.trim()) {
      setError('Пароль не может быть пустым');
      return false;
    }

    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        name: name.trim(),
        login: login.trim(),
        password: password.trim(),
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div className="edit-profile-modal" onClick={handleClose}>
      <div className="edit-profile-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h3>Редактировать профиль</h3>
          <button
            className="close-button"
            onClick={handleClose}
            disabled={isSaving}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">
              Имя <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              disabled={isSaving}
              className={error?.includes('Имя') ? 'error' : ''}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="login">
              Логин <span className="required">*</span>
            </label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              disabled={isSaving}
              className={error?.includes('Логин') ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
              disabled={isSaving}
              className={error?.includes('Пароль') ? 'error' : ''}
            />
          </div>

          {error && (
            <div className="form-error">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={isSaving}
            >
              Отмена
            </button>

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner"></span>
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </button>
          </div>
        </form>

        {isSaving && (
          <div className="saving-overlay">
            <div className="saving-indicator">
              <div className="spinner-large"></div>
              <p>Сохранение изменений...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};