import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Search, Users, MailX, Plus, Trash2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  subscribed: boolean;
  opted_out: boolean;
  opted_out_at: string | null;
  opted_back_in_at: string | null;
  opted_back_in_by: string | null;
  source: string;
  created_at: string;
}

const AdminEmailList = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "opted_out">("all");

  // Re-opt-in modal
  const [reoptTarget, setReoptTarget] = useState<Subscriber | null>(null);
  const [sigFirst, setSigFirst] = useState("");
  const [sigLast, setSigLast] = useState("");
  const [reoptSubmitting, setReoptSubmitting] = useState(false);

  // Add subscriber modal
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addFirst, setAddFirst] = useState("");
  const [addLast, setAddLast] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleData) {
        toast.error("Admin access required");
        navigate("/admin");
        return;
      }
      setIsAdmin(true);
      setAuthChecked(true);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) loadSubscribers();
  }, [isAdmin]);

  const loadSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) {
      toast.error("Failed to load subscribers");
    } else {
      setSubscribers((data ?? []) as Subscriber[]);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (statusFilter === "active" && s.opted_out) return false;
      if (statusFilter === "opted_out" && !s.opted_out) return false;
      if (!q) return true;
      const hay = `${s.email} ${s.first_name ?? ""} ${s.last_name ?? ""} ${s.phone ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [subscribers, search, statusFilter]);

  const totalCount = subscribers.length;
  const optedOutCount = subscribers.filter((s) => s.opted_out).length;
  const activeCount = totalCount - optedOutCount;

  const openReoptModal = (sub: Subscriber) => {
    setReoptTarget(sub);
    setSigFirst("");
    setSigLast("");
  };

  const handleReoptIn = async () => {
    if (!reoptTarget) return;
    const first = sigFirst.trim();
    const last = sigLast.trim();
    if (first.length < 2 || last.length < 2) {
      toast.error("Please type your full first and last name as signature.");
      return;
    }
    const adminName = `${first} ${last}`;
    setReoptSubmitting(true);

    const { error: updateErr } = await supabase
      .from("email_subscribers")
      .update({
        opted_out: false,
        subscribed: true,
        opted_back_in_at: new Date().toISOString(),
        opted_back_in_by: adminName,
      })
      .eq("id", reoptTarget.id);

    if (updateErr) {
      setReoptSubmitting(false);
      toast.error("Failed to re-opt in subscriber");
      return;
    }

    const { error: logErr } = await supabase.from("opt_in_confirmations").insert({
      admin_name: adminName,
      subscriber_email: reoptTarget.email,
    });

    setReoptSubmitting(false);

    if (logErr) {
      toast.error("Subscriber updated but audit log failed");
    } else {
      toast.success(`${reoptTarget.email} re-opted in`);
    }

    setReoptTarget(null);
    loadSubscribers();
  };

  const handleAddSubscriber = async () => {
    const email = addEmail.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setAddSubmitting(true);
    const { error } = await supabase.from("email_subscribers").insert({
      email,
      first_name: addFirst.trim() || null,
      last_name: addLast.trim() || null,
      phone: addPhone.trim() || null,
      source: "manual_admin",
    });
    setAddSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("That email is already on the list");
      } else {
        toast.error("Failed to add subscriber");
      }
      return;
    }
    toast.success("Subscriber added");
    setAddOpen(false);
    setAddEmail(""); setAddFirst(""); setAddLast(""); setAddPhone("");
    loadSubscribers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("email_subscribers")
      .delete()
      .eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      toast.error("Failed to delete subscriber");
      return;
    }
    toast.success(`Removed ${deleteTarget.email}`);
    setDeleteTarget(null);
    loadSubscribers();
  };

  const exportCsv = () => {
    const headers = ["email", "first_name", "last_name", "phone", "source", "subscribed", "opted_out", "opted_out_at", "opted_back_in_at", "opted_back_in_by", "created_at"];
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = subscribers.map((s) => headers.map((h) => escape((s as any)[h])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${subscribers.length} subscribers`);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Email Subscribers</h1>
              <p className="text-muted-foreground mt-1">Manage your subscriber list</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>← Back</Button>
              <Button variant="outline" onClick={exportCsv} disabled={subscribers.length === 0}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <Button variant="accent" onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Subscriber
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Total subscribers</span>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">{totalCount}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">{activeCount}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <MailX className="w-5 h-5 text-destructive" />
                <span className="text-sm text-muted-foreground">Opted out</span>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">{optedOutCount}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search email, name, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: "all" | "active" | "opted_out") => setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subscribers</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="opted_out">Opted out only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">First</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Subscribed</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Opted Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No subscribers match your filters.</td></tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                        <td className="py-3 px-4 text-foreground">{s.email}</td>
                        <td className="py-3 px-4 text-foreground">{s.first_name || <span className="text-muted-foreground">-</span>}</td>
                        <td className="py-3 px-4 text-foreground">{s.last_name || <span className="text-muted-foreground">-</span>}</td>
                        <td className="py-3 px-4 text-muted-foreground">{s.phone || "-"}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{s.source}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.subscribed ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                            {s.subscribed ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.opted_out ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                              {s.opted_out ? "Yes" : "No"}
                            </span>
                            {s.opted_out && (
                              <Switch checked={false} onCheckedChange={() => openReoptModal(s)} aria-label={`Re-opt in ${s.email}`} />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(s)}
                            aria-label={`Delete ${s.email}`}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add subscriber modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add subscriber</DialogTitle>
            <DialogDescription>
              Manually add an email subscriber. Only email is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="add-email">Email *</Label>
              <Input id="add-email" type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-first">First name</Label>
                <Input id="add-first" value={addFirst} onChange={(e) => setAddFirst(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="add-last">Last name</Label>
                <Input id="add-last" value={addLast} onChange={(e) => setAddLast(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="add-phone">Phone (optional)</Label>
              <Input id="add-phone" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="accent" onClick={handleAddSubscriber} disabled={addSubmitting}>
              {addSubmitting ? "Adding..." : "Add subscriber"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-opt-in signature modal */}
      <Dialog open={!!reoptTarget} onOpenChange={(open) => !open && setReoptTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm re-opt-in</DialogTitle>
            <DialogDescription>
              You are about to re-opt in <span className="font-semibold text-foreground">{reoptTarget?.email}</span>.
              By signing your name below, you confirm you have explicit, documented consent from this customer to resume sending email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sig-first">First name</Label>
              <Input id="sig-first" value={sigFirst} onChange={(e) => setSigFirst(e.target.value)} placeholder="First" />
            </div>
            <div>
              <Label htmlFor="sig-last">Last name</Label>
              <Input id="sig-last" value={sigLast} onChange={(e) => setSigLast(e.target.value)} placeholder="Last" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReoptTarget(null)}>Cancel</Button>
            <Button variant="accent" onClick={handleReoptIn} disabled={reoptSubmitting}>
              {reoptSubmitting ? "Confirming..." : "Sign & re-opt in"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold text-foreground">{deleteTarget?.email}</span> from your subscriber list. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default AdminEmailList;
