import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Download, Mail, Calendar, MessageSquare, Send, Inbox, ImagePlus, X, Bold, Italic, Underline, Heading1, Heading2, Link, List, ListOrdered, Minus, Type, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [newsletterImages, setNewsletterImages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setImageUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); continue; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB per image"); continue; }
        const ext = file.name.split(".").pop();
        const path = `newsletter/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("email-assets").upload(path, file);
        if (error) { toast.error("Upload failed"); continue; }
        const { data: urlData } = supabase.storage.from("email-assets").getPublicUrl(path);
        setNewsletterImages((prev) => [...prev, urlData.publicUrl]);
      }
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setNewsletterImages((prev) => prev.filter((_, i) => i !== idx));
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
        body: { subject: newsletterSubject.trim(), body: newsletterBody.trim(), imageUrls: newsletterImages },
      });
      if (res.error) throw res.error;
      const result = res.data;
      toast.success(`Newsletter sent to ${result.sent}/${result.total} subscribers`);
      setNewsletterSubject("");
      setNewsletterBody("");
      setNewsletterImages([]);
    } catch (err) {
      toast.error("Failed to send newsletter");
    } finally {
      setNewsletterSending(false);
    }
  };

  const previewHtml = useMemo(() => {
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#4a5568";
    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const subj = (newsletterSubject || "Your Subject Line").replace(/</g, "&lt;");
    const body = newsletterBody ? newsletterBody.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\n/g, "<br>") : "Your email content will appear here...";
    const imgs = newsletterImages.map((u) => `<div style="text-align:center;margin:0 0 20px;"><img src="${u}" style="max-width:100%;height:auto;border-radius:8px;" /></div>`).join("");
    return `<div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <div style="background:${navy};padding:32px 30px;text-align:center;">
        <img src="${LOGO_URL}" alt="VLS" width="140" style="display:block;margin:0 auto 12px;max-width:140px;height:auto;" />
        <p style="color:${white};margin:0;font-size:20px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Virginia Laser Specialists</p>
      </div>
      <div style="padding:36px 28px;">
        <h1 style="color:${textDark};font-size:20px;margin:0 0 20px;font-weight:700;text-align:center;">${subj}</h1>
        <div style="color:${textMedium};font-size:14px;line-height:1.7;margin:0 0 24px;">${body}</div>
        ${imgs}
        <div style="text-align:center;margin:0 0 24px;">
          <span style="display:inline-block;background:${navy};color:${white};padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;">BOOK AN APPOINTMENT</span>
        </div>
      </div>
      <div style="background:${navyDark};padding:24px 28px;text-align:center;">
        <p style="color:${seafoamLight};margin:0 0 4px;font-size:13px;font-weight:700;">Virginia Laser Specialists</p>
        <p style="color:rgba(255,255,255,0.6);margin:0;font-size:11px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
        <p style="color:rgba(255,255,255,0.6);margin:3px 0 0;font-size:11px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
      </div>
    </div>`;
  }, [newsletterSubject, newsletterBody, newsletterImages]);

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
                      <div className="space-y-3 pt-2 border-t border-border">
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
                        {/* Live reply preview */}
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Email Preview</p>
                          <div
                            className="bg-muted/30 border border-border rounded-lg p-4 overflow-y-auto max-h-[400px]"
                            dangerouslySetInnerHTML={{ __html: (() => {
                              const navy = "#3d5a80";
                              const navyDark = "#2c4360";
                              const seafoam = "#6dbfa0";
                              const seafoamLight = "#85ccb3";
                              const cream = "#f8f7f4";
                              const white = "#ffffff";
                              const textDark = "#1f2d3d";
                              const textMedium = "#4a5568";
                              const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
                              const msg = (replyMessage || "Your reply will appear here...").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
                              return `<div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                                <div style="background:${navy};padding:28px 26px;text-align:center;">
                                  <img src="${LOGO_URL}" alt="VLS" width="130" style="display:block;margin:0 auto 10px;max-width:130px;height:auto;" />
                                  <p style="color:${white};margin:0;font-size:18px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Virginia Laser Specialists</p>
                                </div>
                                <div style="padding:32px 26px;">
                                  <h1 style="color:${textDark};font-size:18px;margin:0 0 14px;font-weight:700;">Hello ${inq.name},</h1>
                                  <p style="color:${textMedium};font-size:13px;line-height:1.7;margin:0 0 18px;">Thank you for reaching out to Virginia Laser Specialists. Here is our response to your inquiry:</p>
                                  <div style="background:${cream};border-left:4px solid ${seafoam};border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 18px;">
                                    <p style="color:${textDark};font-size:13px;line-height:1.7;margin:0;">${msg}</p>
                                  </div>
                                  <p style="color:${textMedium};font-size:12px;line-height:1.6;margin:0 0 18px;">If you have any further questions, feel free to reply to this email or call us at <strong style="color:${textDark};">703-547-4499</strong>.</p>
                                  <div style="text-align:center;">
                                    <span style="display:inline-block;background:${navy};color:${white};padding:10px 28px;border-radius:8px;font-size:13px;font-weight:700;">BOOK A FREE CONSULTATION</span>
                                  </div>
                                </div>
                                <div style="background:${navyDark};padding:20px 26px;text-align:center;">
                                  <p style="color:${seafoamLight};margin:0 0 4px;font-size:12px;font-weight:700;">Virginia Laser Specialists</p>
                                  <p style="color:rgba(255,255,255,0.6);margin:0;font-size:10px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
                                  <p style="color:rgba(255,255,255,0.6);margin:3px 0 0;font-size:10px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
                                </div>
                              </div>`;
                            })() }}
                          />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compose */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Compose</h3>
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
                  <TooltipProvider delayDuration={200}>
                    <div className="flex flex-wrap items-center gap-0.5 border border-border rounded-t-md px-2 py-1.5 bg-muted/30">
                      {([
                        { icon: Bold, label: "Bold", tag: "b", wrap: true },
                        { icon: Italic, label: "Italic", tag: "i", wrap: true },
                        { icon: Underline, label: "Underline", tag: "u", wrap: true },
                      ] as const).map(({ icon: Icon, label, tag }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => {
                                const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                                if (!ta) return;
                                const { selectionStart: s, selectionEnd: e } = ta;
                                const sel = newsletterBody.substring(s, e) || label.toLowerCase();
                                setNewsletterBody(newsletterBody.substring(0, s) + `<${tag}>${sel}</${tag}>` + newsletterBody.substring(e));
                              }}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
                        </Tooltip>
                      ))}

                      <div className="h-5 w-px bg-border mx-1" />

                      {([
                        { icon: Heading1, label: "Large Heading", style: "font-size:20px;font-weight:700;margin:16px 0 8px;", tag: "h2" },
                        { icon: Heading2, label: "Small Heading", style: "font-size:16px;font-weight:600;margin:12px 0 6px;", tag: "h3" },
                      ] as const).map(({ icon: Icon, label, style, tag }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => {
                                const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                                if (!ta) return;
                                const { selectionStart: s, selectionEnd: e } = ta;
                                const sel = newsletterBody.substring(s, e) || "Heading";
                                setNewsletterBody(newsletterBody.substring(0, s) + `<${tag} style="${style}">${sel}</${tag}>` + newsletterBody.substring(e));
                              }}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
                        </Tooltip>
                      ))}

                      <div className="h-5 w-px bg-border mx-1" />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s, selectionEnd: e } = ta;
                              const sel = newsletterBody.substring(s, e);
                              const items = sel ? sel.split("\n").filter(Boolean).map(l => `<li>${l}</li>`).join("") : "<li>Item 1</li>\n<li>Item 2</li>";
                              setNewsletterBody(newsletterBody.substring(0, s) + `<ul style="padding-left:20px;margin:12px 0;">${items}</ul>` + newsletterBody.substring(e));
                            }}
                          >
                            <List className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Bullet List</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s, selectionEnd: e } = ta;
                              const sel = newsletterBody.substring(s, e);
                              const items = sel ? sel.split("\n").filter(Boolean).map((l, i) => `<li>${l}</li>`).join("") : "<li>First</li>\n<li>Second</li>\n<li>Third</li>";
                              setNewsletterBody(newsletterBody.substring(0, s) + `<ol style="padding-left:20px;margin:12px 0;">${items}</ol>` + newsletterBody.substring(e));
                            }}
                          >
                            <ListOrdered className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Numbered List</TooltipContent>
                      </Tooltip>

                      <div className="h-5 w-px bg-border mx-1" />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const url = prompt("Enter URL:");
                              if (!url) return;
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s, selectionEnd: e } = ta;
                              const sel = newsletterBody.substring(s, e) || "Click here";
                              setNewsletterBody(newsletterBody.substring(0, s) + `<a href="${url}" style="color:#3d5a80;font-weight:600;text-decoration:underline;">${sel}</a>` + newsletterBody.substring(e));
                            }}
                          >
                            <Link className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Insert Link</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s } = ta;
                              setNewsletterBody(newsletterBody.substring(0, s) + `<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />` + newsletterBody.substring(s));
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Divider Line</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s, selectionEnd: e } = ta;
                              const sel = newsletterBody.substring(s, e) || "highlighted text";
                              setNewsletterBody(newsletterBody.substring(0, s) + `<span style="color:#3d5a80;font-weight:600;">${sel}</span>` + newsletterBody.substring(e));
                            }}
                          >
                            <Palette className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Brand Color</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              const ta = document.getElementById("nl-body") as HTMLTextAreaElement;
                              if (!ta) return;
                              const { selectionStart: s, selectionEnd: e } = ta;
                              const sel = newsletterBody.substring(s, e) || "small print";
                              setNewsletterBody(newsletterBody.substring(0, s) + `<span style="font-size:12px;color:#718096;">${sel}</span>` + newsletterBody.substring(e));
                            }}
                          >
                            <Type className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Fine Print</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  <Textarea
                    id="nl-body"
                    value={newsletterBody}
                    onChange={(e) => setNewsletterBody(e.target.value)}
                    placeholder="Write your newsletter content here. Select text and use the toolbar above to format it — see changes instantly in the preview →"
                    rows={10}
                    maxLength={10000}
                    className="rounded-t-none border-t-0 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground text-right">{newsletterBody.length}/10,000</p>
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-wrap gap-2">
                    {newsletterImages.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-20 w-20"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                    >
                      <ImagePlus className="w-5 h-5" />
                    </Button>
                  </div>
                  {imageUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                </div>
                <Button
                  onClick={handleSendNewsletter}
                  disabled={newsletterSending || !newsletterSubject.trim() || !newsletterBody.trim() || !leads.length}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {newsletterSending ? "Sending..." : `Send to ${leads.length} Subscriber(s)`}
                </Button>
              </div>
              {/* Preview */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Email Preview</h3>
                <div
                  className="bg-muted/30 border border-border rounded-lg p-4 overflow-y-auto max-h-[600px]"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
