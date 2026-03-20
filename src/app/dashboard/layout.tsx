import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1B2A4A]">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="font-semibold">Visquanta</span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set("visquanta-audit-auth", "", { maxAge: 0, path: "/" });
        const { redirect } = await import("next/navigation");
        redirect("/");
      }}
    >
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
