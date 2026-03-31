"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { User, Lock, Bell, Shield, Trash2, ChevronRight, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { key: "account",       label: "Account",       icon: User   },
  { key: "password",      label: "Password",      icon: Lock   },
  { key: "notifications", label: "Notifications", icon: Bell   },
  { key: "privacy",       label: "Privacy",       icon: Shield },
  { key: "danger",        label: "Danger Zone",   icon: Trash2 },
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
    try { await fn(); toast.success("Changes saved successfully!"); }
    catch { toast.error("Failed to save changes"); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-low border border-border">
              <Settings2 size={16} className="text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 ml-12">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
          {/* Left nav */}
          <Card className="p-3 sticky top-24 border-transparent bg-transparent sm:bg-surface-low sm:border-border overflow-hidden">
            <div className="space-y-1 relative z-10">
              {SECTIONS.map(({ key, label, icon: Icon }) => {
                const isActive = section === key;
                return (
                  <button key={key} onClick={() => setSection(key)}
                    className={cn("flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
                      isActive ? "text-primary shadow-sm" : "text-muted-foreground hover:bg-surface-high hover:text-foreground",
                      key === "danger" && !isActive && "hover:text-destructive hover:bg-destructive/10"
                    )}>
                    {isActive && (
                      <motion.div layoutId="setting-active" className="absolute inset-0 bg-primary/10 rounded-2xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <Icon size={16} className={cn("relative z-10 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="relative z-10">{label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50 relative z-10" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-8">
                {section === "account" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Account Details</h2>
                      <p className="text-sm text-muted-foreground mt-1 text-balance">Update your email and personal information</p>
                    </div>
                    
                    <div className="grid gap-6 max-w-lg">
                      <Input label="Username" value={user?.username || ""} disabled hint="Username cannot be changed after creation" />
                      <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <Input label="Role" value={user?.role || ""} disabled className="capitalize" />
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button loading={saving} onClick={() => save(async () => { await new Promise(r => setTimeout(r, 600)); })}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {section === "password" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Security & Password</h2>
                      <p className="text-sm text-muted-foreground mt-1">Keep your account secure with a strong password</p>
                    </div>
                    
                    <div className="grid gap-5 max-w-lg">
                      <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} />
                      <Input label="New Password" type="password" value={passwords.newPass} onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
                      <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button loading={saving} onClick={() => {
                        if (passwords.newPass !== passwords.confirm) { toast.error("Passwords don't match"); return; }
                        if (passwords.newPass.length < 6) { toast.error("Password must be at least 6 characters"); return; }
                        save(async () => { await new Promise(r => setTimeout(r, 600)); setPasswords({ current: "", newPass: "", confirm: "" }); });
                      }}>Update Password</Button>
                    </div>
                  </div>
                )}

                {section === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Notification Preferences</h2>
                      <p className="text-sm text-muted-foreground mt-1">Control which updates you want to receive</p>
                    </div>
                    
                    <div className="space-y-3">
                      {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-surface-low border border-border group hover:border-primary/30 transition-colors">
                          <div className="pr-4">
                            <p className="text-sm font-bold capitalize text-foreground">{key}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {key === "connections" && "Get notified about new connection requests and acceptances"}
                              {key === "messages" && "Receive an alert when you get a new direct message"}
                              {key === "projects" && "Updates when your connections share new projects"}
                            </p>
                          </div>
                          
                          <button onClick={() => setNotifs(n => ({ ...n, [key]: !val }))}
                            className={cn("w-12 h-6 rounded-full transition-all relative shrink-0", val ? "bg-primary" : "bg-surface-highest")}
                          >
                            <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ease-out duration-300", val ? "left-[26px]" : "left-0.5")} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Privacy Settings</h2>
                      <p className="text-sm text-muted-foreground mt-1">Control who can find and interact with you</p>
                    </div>
                    
                    <div className="grid gap-6 max-w-lg">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold">Network Reach</label>
                        <select className="h-11 px-4 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium">
                          <option>Everyone on MUSYNC</option>
                          <option>2nd Degree Connections</option>
                          <option>Nobody (Private)</option>
                        </select>
                        <p className="text-[11px] text-muted-foreground mt-1">Who is allowed to send you connection requests</p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold">Profile Visibility</label>
                        <select className="h-11 px-4 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium">
                          <option>Public</option>
                          <option>Connections Only</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button loading={saving} onClick={() => save(async () => { await new Promise(r => setTimeout(r, 600)); })}>
                        Save Settings
                      </Button>
                    </div>
                  </div>
                )}

                {section === "danger" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-destructive">Danger Zone</h2>
                      <p className="text-sm text-muted-foreground mt-1">Irreversible account actions</p>
                    </div>
                    
                    <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
                      <p className="font-bold text-base mb-1">Delete Account</p>
                      <p className="text-sm text-foreground/80 mb-6 max-w-md">
                        Permanently delete your account, including your profile, all projects, connections, and messages. This action cannot be undone.
                      </p>
                      
                      <AnimatePresence mode="wait">
                        {!confirmDelete ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Button variant="destructive" onClick={() => setConfirmDelete(true)} className="font-bold">
                              Delete Account
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2 border-t border-destructive/20">
                            <p className="text-sm text-destructive font-bold flex items-center gap-2">
                              Are you absolutely sure?
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <Button variant="destructive" onClick={logout}>Yes, Delete Everything</Button>
                              <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
