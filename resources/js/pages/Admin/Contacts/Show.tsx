import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Inquiry {
  id: number; name: string; email: string; subject: string; message: string;
  status: string; created_at: string;
}

const statusStyles: Record<string, string> = {
  new:     "bg-violet-50 text-violet-700 ring-1 ring-violet-200/80",
  read:    "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80",
  replied: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/80",
};

const Show = ({ inquiry }: { inquiry: Inquiry }) => {
  const { data, setData, post, processing, wasSuccessful, errors } = useForm({
    reply_message: "",
  });

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/contacts/${inquiry.id}/reply`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link
            href="/admin/contacts"
            className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">{inquiry.subject}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyles[inquiry.status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">
              Inquiry #{inquiry.id} · {new Date(inquiry.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Message card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Sender info */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center shrink-0">
              <span className="text-[#1a3a5c] font-semibold text-sm uppercase select-none">
                {inquiry.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{inquiry.name}</p>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-xs text-[#1a3a5c]/70 hover:text-[#1a3a5c] flex items-center gap-1 transition-colors"
              >
                <Mail size={11} />{inquiry.email}
              </a>
            </div>
          </div>

          {/* Message body */}
          <div className="px-6 py-5">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </div>

        {/* Reply form */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Reply to {inquiry.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Reply will be sent to <span className="font-medium">{inquiry.email}</span></p>
          </div>
          <div className="p-6">
            {wasSuccessful ? (
              <div className="flex items-center gap-2.5 text-teal-700 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Reply sent successfully!</span>
              </div>
            ) : (
              <form onSubmit={sendReply} className="space-y-4">
                <Textarea
                  value={data.reply_message}
                  onChange={(e) => setData("reply_message", e.target.value)}
                  placeholder="Type your reply here…"
                  rows={6}
                  className="rounded-xl border-gray-200 resize-none"
                  required
                />
                {errors.reply_message && <p className="text-red-500 text-xs">{errors.reply_message}</p>}
                <button
                  type="submit"
                  disabled={processing || !data.reply_message.trim()}
                  className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm"
                >
                  <Send size={14} />
                  {processing ? "Sending…" : "Send Reply"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex">
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} /> Back to List
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Show;
