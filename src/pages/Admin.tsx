import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, Download, Mail, Calendar } from "lucide-react";

interface EmailLead {
  id: string;
  email: string;
  source: string | null;
  subscribed_at: string;
  confirmation_sent: boolean | null;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<EmailLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setIsAuthenticated(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        fetchLeads();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    const { data, error } = await supabase
      .from("email_leads")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch leads");
    } else {
      setLeads(data || []);
    }
    setLeadsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Invalid credentials");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLeads([]);
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["Email", "Source", "Subscribed At", "Confirmation Sent"];
    const rows = leads.map((l) => [
      l.email,
      l.source || "",
      new Date(l.subscribed_at).toLocaleString(),
      l.confirmation_sent ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage email leads</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Email Leads Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={!leads.length}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Mail className="w-4 h-4" /> Total Leads
            </div>
            <p className="text-3xl font-bold text-foreground">{leads.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Calendar className="w-4 h-4" /> This Month
            </div>
            <p className="text-3xl font-bold text-foreground">
              {leads.filter((l) => new Date(l.subscribed_at).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Mail className="w-4 h-4" /> Emails Sent
            </div>
            <p className="text-3xl font-bold text-foreground">
              {leads.filter((l) => l.confirmation_sent).length}
            </p>
          </div>
        </div>

        {leadsLoading ? (
          <p className="text-center text-muted-foreground">Loading leads...</p>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Email</th>
                    <th className="text-left p-3 font-medium text-foreground">Source</th>
                    <th className="text-left p-3 font-medium text-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-foreground">Confirmed</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-foreground">{lead.email}</td>
                      <td className="p-3 text-muted-foreground">{lead.source || "—"}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(lead.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${lead.confirmation_sent ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {lead.confirmation_sent ? "Sent" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!leads.length && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No leads yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
