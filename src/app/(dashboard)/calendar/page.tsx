import PostCalendar from "@/components/calendar/PostCalendar";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Content Calendar</h1>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          All scheduled and published posts across accounts.
        </p>
      </div>
      <PostCalendar />
    </div>
  );
}
