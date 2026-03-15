import { ChartAreaInteractive } from "../../default/_components/chart-area-interactive";
import data from "../../default/_components/data.json";
import { ProposalSectionsTable } from "../../default/_components/proposal-sections-table/table";
import { SectionCards } from "../../default/_components/section-cards";

export default function StoreDashboardPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <ProposalSectionsTable data={data} />
    </div>
  );
}
