"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { profileSchema, passwordSchema } from "@/lib/validation";
import { updateProfile, changePassword } from "@/lib/endpoints";
import { ApiError } from "@/lib/api-error";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  async function onSubmitProfile(e: FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse({ name, email });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});
    setIsSavingProfile(true);
    try {
      const updated = await updateProfile(parsed.data);
      updateUser(updated);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onSubmitPassword(e: FormEvent) {
    e.preventDefault();
    const parsed = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors({});
    setIsSavingPassword(true);
    try {
      await changePassword({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <section className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">User Information</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update your name and email address.</p>
        </div>
        <form onSubmit={onSubmitProfile} noValidate className="flex max-w-md flex-col gap-4">
          <Input
            id="settings-name"
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={profileErrors.name}
          />
          <Input
            id="settings-email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={profileErrors.email}
          />
          <div>
            <Button type="submit" loading={isSavingProfile}>
              Save changes
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Change your account password.</p>
        </div>
        <form onSubmit={onSubmitPassword} noValidate className="flex max-w-md flex-col gap-4">
          <Input
            id="settings-current-password"
            type="password"
            label="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={passwordErrors.currentPassword}
          />
          <Input
            id="settings-new-password"
            type="password"
            label="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={passwordErrors.newPassword}
          />
          <Input
            id="settings-confirm-password"
            type="password"
            label="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordErrors.confirmPassword}
          />
          <div>
            <Button type="submit" loading={isSavingPassword}>
              Update password
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#121130] dark:ring-white/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <div className="flex max-w-md items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Dark mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme.</p>
          </div>
          <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} label="Toggle dark mode" />
        </div>
      </section>
    </div>
  );
}
