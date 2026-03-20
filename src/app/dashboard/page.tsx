import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Select a report type to generate
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/audit">
          <Card className="cursor-pointer border-border/50 transition-colors hover:border-[#3B82F6]/50 hover:bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">
                Opportunity Execution Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate a branded PDF audit report analyzing lead follow-up
                performance and identifying missed opportunities.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
