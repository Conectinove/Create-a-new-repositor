import { PlannerProvider } from '@/lib/planner-context'
import AppShell from '@/components/planner/AppShell'

export default function Page() {
  return (
    <PlannerProvider>
      <AppShell />
    </PlannerProvider>
  )
}
