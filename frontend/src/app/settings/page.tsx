"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { User, Lock, Bell, Shield, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "account",       label: "Account",       icon: User   },
  { key: "password",      label: "Password",       icon: Lock   },
  { key: "notifications", label: "Notifications",  icon: Bell   },
  { key: "privacy",       label: "Privacy",        icon: Shield },
  { key: "danger",        label: "Danger Zone",    icon: Trash2 },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("account");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [notifs, setNotifs] = useState({ connections: true, messages: true, projects: false });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = async (fn: () => Promise<void>) => {
    setSaving(true);
    try { await fn(); toast.success("Saved!"); }
    catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-5 items-start">
          {/* Left nav */}
          <Card className="p-2 sticky top-20">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSection(key)}
                className={cn("flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  section === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  key === "danger" && section !== key && "text-destructive hover:bg-destructive/10")}>
                <Icon size={15} />
                {label}
                <ChevronRight size={13} className="ml-auto opacity-40" />
              </button>
            ))}
          </Card>

          {/* Content */}
          <Card className="p-6">
            {section === "account" && (
              <div className="space-y-5">
                <div><h2 className="font-semibold">Account</h2><p className="text-sm text-muted-foreground mt-0.5">Manage your account information</p></div>
                <Input label="Username" value={user?.username || ""} disabled hint="Username cannot be changed" />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Role" value={user?.role || ""} disabled className="capitalize" />
                <Button loading={saving} onClick={() => save(async () => { await new Promise(r => setTimeout(r, 500)); })}>
                  Save Changes
                </Button>
              </div>
            )}

            {section === "password" && (
              <div className="space-y-5">
                <div><h2 className="font-semibold">Change Password</h2><p className="text-sm text-muted-foreground mt-0.5">Use a strong password you don't use elsewhere</p></div>
                <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} />
                <Input label="New Password" type="password" value={passwords.newPass} onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
                <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                <Button loading={saving} onClick={() => {
                  if (passwords.newPass !== passwords.confirm) { toast.error("Passwords don't match"); return; }
                  if (passwords.newPass.length < 6) { toast.error("Min. 6 characters"); return; }
                  save(async () => { await new Promise(r => setTimeout(r, 500)); setPasswords({ current: "", newPass: "", confirm: "" }); });
                }}>Update Password</Button>
              </div>
            )}

            {section === "notifications" && (
              <div className="space-y-5">
                <div><h2 className="font-semibold">Notifications</h2><p className="text-sm text-muted-foreground mt-0.5">Choose what you want to be notified about</p></div>
                {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                    <div>
                      <p className="text-sm font-medium capitalize">{key}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {key === "connections" && "New connection requests and acceptances"}
                        {key === "messages" && "New messages from connections"}
                        {key === "projects" && "Activity on your projects"}
                      </p>
                    </div>
                    <button onClick={() => setNotifs(n => ({ ...n, [key]: !val }))}
                      className={cn("w-11 h-6 rounded-full transition-all relative", val ? "bg-primary" : "bg-muted-foreground/30")}>
                      <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", val ? "left-[22px]" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === "privacy" && (
              <div className="space-y-5">
                <div><h2 className="font-semibold">Privacy</h2><p className="text-sm text-muted-foreground mt-0.5">Control who can find and connect with you</p></div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Who can send connection requests</label>
                  <select className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Everyone</option><option>Connections of connections</option><option>Nobody</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Profile visibility</label>
                  <select className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Public</option><option>Connections only</option>
                  </select>
                </div>
                <Button loading={saving} onClick={() => save(async () => { await new Promise(r => setTimeout(r, 500)); })}>Save Privacy Settings</Button>
              </div>
            )}

            {section === "danger" && (
              <div className="space-y-5">
                <div><h2 className="font-semibold text-destructive">Danger Zone</h2><p className="text-sm text-muted-foreground mt-0.5">These actions are permanent and cannot be undone</p></div>
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                  <p className="font-medium text-sm mb-1">Delete Account</p>
                  <p className="text-xs text-muted-foreground mb-4">Permanently delete your account, profile, projects, and all data.</p>
                  {!confirmDelete ? (
                    <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>Delete Account</Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-destructive font-medium">Are you sure? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={logout}>Yes, Delete Everything</Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
