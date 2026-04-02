import { useEffect, useMemo, useState } from 'react';
import { fetchProfile } from '../services/settingsService';

const getInitials = (name) => {
  if (!name || !name.trim()) return 'SA';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const useAdminProfile = () => {
  const [adminName, setAdminName] = useState('');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState('');
  const [adminRole, setAdminRole] = useState('Super Admin');
  const [adminProfileLoading, setAdminProfileLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setAdminProfileLoading(true);
    fetchProfile()
      .then((res) => {
        if (cancelled || !res?.success || !res?.data) return;
        const data = res.data;
        setAdminName(data.fullName ?? '');
        setAdminAvatarUrl(data.avatarUrl ?? '');
        setAdminRole(data.role ?? 'Super Admin');
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAdminProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const adminInitials = useMemo(() => getInitials(adminName), [adminName]);

  return {
    adminName,
    adminAvatarUrl,
    adminRole,
    adminProfileLoading,
    adminInitials,
  };
};
