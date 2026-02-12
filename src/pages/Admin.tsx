import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Download, Mail, Calendar, MessageSquare, Send, Inbox } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailLead {
  id: string;
  email: string;
  source: string | null;
  subscribed_at: string;
  confirmation_sent: boolean | null;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string | null;
  contact_method: string;
  message: string | null;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<EmailLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [newsletterSending, setNewsletterSending] = useState(false);

  const verifyAdmin = async (session: any) => {
    if (!session) {
      setIsAuthenticated(false);
      return;
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "admin" as const,
    });
    if (isAdmin) {
      setIsAuthenticated(true);
      fetchLeads();
      fetchInquiries();
    } else {
      setIsAuthenticated(false);
      toast.error("Access denied: admin role required");
      await supabase.auth.signOut();
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyAdmin(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAdmin(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    const { data, error } = await supabase
      .from("email_leads")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (error) toast.error("Failed to fetch leads");
    else setLeads(data || []);
    setLeadsLoading(false);
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to fetch inquiries");
    else setInquiries(data || []);
    setInquiriesLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error("Invalid credentials");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLeads([]);
    setInquiries([]);
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

  const handleReply = async (inquiryId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    setReplySending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("send-inquiry-reply", {
        body: { inquiryId, replyMessage: replyMessage.trim() },
      });
      if (res.error) throw res.error;
      toast.success("Reply sent successfully");
      setReplyingTo(null);
      setReplyMessage("");
      fetchInquiries();
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setReplySending(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterSubject.trim() || !newsletterBody.trim()) {
      toast.error("Please enter both subject and body");
      return;
    }
    if (!confirm(`Send newsletter to ${leads.length} subscriber(s)?`)) return;
    setNewsletterSending(true);
    try {
      const res = await supabase.functions.invoke("send-newsletter", {
        body: { subject: newsletterSubject.trim(), body: newsletterBody.trim() },
      });
      if (res.error) throw res.error;
      const result = res.data;
      toast.success(`Newsletter sent to ${result.sent}/${result.total} subscribers`);
      setNewsletterSubject("");
      setNewsletterBody("");
    } catch (err) {
      toast.error("Failed to send newsletter");
    } finally {
      setNewsletterSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" /> Inquiries
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Leads
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Newsletter
            </TabsTrigger>
          </TabsList>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Contact Inquiries</h2>
              <Button variant="outline" size="sm" onClick={fetchInquiries}>Refresh</Button>
            </div>
            {inquiriesLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-card border border-border rounded-lg p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{inq.name}</p>
                        <p className="text-sm text-muted-foreground">{inq.email} · {inq.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          inq.status === "replied"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {inq.status === "replied" ? "Replied" : "New"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {inq.service && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Service:</strong> {inq.service} · <strong>Prefers:</strong> {inq.contact_method}
                      </p>
                    )}
                    {inq.message && (
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{inq.message}</p>
                      </div>
                    )}
                    {inq.admin_reply && (
                      <div className="border-l-4 border-accent pl-3">
                        <p className="text-xs text-muted-foreground mb-1">Your reply ({new Date(inq.replied_at!).toLocaleDateString()}):</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{inq.admin_reply}</p>
                      </div>
                    )}
                    {replyingTo === inq.id ? (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <Label>Reply (from info@virginialaserspecialists.com)</Label>
                        <Textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReply(inq.id)} disabled={replySending}>
                            {replySending ? "Sending..." : "Send Reply"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyMessage(""); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setReplyingTo(inq.id)}>
                        <MessageSquare className="w-4 h-4 mr-2" /> {inq.status === "replied" ? "Reply Again" : "Reply"}
                      </Button>
                    )}
                  </div>
                ))}
                {!inquiries.length && (
                  <p className="text-center text-muted-foreground py-8">No inquiries yet</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Email Leads</h2>
              <Button variant="outline" size="sm" onClick={exportCSV} disabled={!leads.length}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <p className="text-center text-muted-foreground">Loading...</p>
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
                          <td className="p-3 text-muted-foreground">{new Date(lead.subscribed_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${lead.confirmation_sent ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                              {lead.confirmation_sent ? "Sent" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!leads.length && (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No leads yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Send Newsletter</h2>
            <p className="text-sm text-muted-foreground">
              Send a mass email from <strong>hello@virginialaserspecialists.com</strong> to all {leads.length} subscriber(s).
            </p>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="nl-subject">Subject Line</Label>
                <Input
                  id="nl-subject"
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  placeholder="e.g. February Specials at Virginia Laser Specialists"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nl-body">Email Body</Label>
                <Textarea
                  id="nl-body"
                  value={newsletterBody}
                  onChange={(e) => setNewsletterBody(e.target.value)}
                  placeholder="Write your newsletter content here..."
                  rows={10}
                  maxLength={10000}
                />
                <p className="text-xs text-muted-foreground text-right">{newsletterBody.length}/10000</p>
              </div>
              <Button
                onClick={handleSendNewsletter}
                disabled={newsletterSending || !newsletterSubject.trim() || !newsletterBody.trim() || !leads.length}
              >
                <Send className="w-4 h-4 mr-2" />
                {newsletterSending ? "Sending..." : `Send to ${leads.length} Subscriber(s)`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
