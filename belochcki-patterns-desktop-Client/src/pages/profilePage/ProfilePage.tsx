import React, { useEffect, useState } from "react";
import { ProfileCard } from "../../entities/profile/ProfileCard";
import { EditProfile } from "../../features/editProfile/EditProfile";
import { apiRequest } from "../../shared/api/ApiClient";
import { SERVICES } from "../../types/Services";

import type {
  EmployeeProfile,
  UpdateEmployeeProfileDto,
} from "../../shared/api/types/UserProfile";

import "./ProfilePage.css";

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleError = (err: any, setErr?: (v: string) => void) => {
    if (err?.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (err?.status === 503) {
      console.warn("PROFILE circuit open");
      return;
    }

    const msg = err?.message || "Ошибка";
    setErr?.(msg);
    console.error(msg, err);
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiRequest<EmployeeProfile>(
        SERVICES.CORE,
        `/profile`
      );

      setProfile(data);
    } catch (err: any) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (dto: UpdateEmployeeProfileDto) => {
    try {
      setSaveError(null);

      const data = await apiRequest<EmployeeProfile>(
        SERVICES.CORE,
        `/profile`,
        { method: "PUT", body: dto }
      );

      setProfile(data);
    } catch (err: any) {
      handleError(err, setSaveError);
      throw err;
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Нет профиля</div>;

  return (
    <div className="profile-page">
      <ProfileCard profile={profile} onEdit={() => setEditing(true)} />

      {editing && (
        <EditProfile
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={handleSave}
        />
      )}

      {saveError && <div>{saveError}</div>}
    </div>
  );
};