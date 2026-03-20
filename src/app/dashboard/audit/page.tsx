import { AuditForm } from "@/components/audit/AuditForm";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Opportunity Execution Audit</h1>
        <p className="text-muted-foreground">
          Fill in the audit data or paste GPT output to auto-populate
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
