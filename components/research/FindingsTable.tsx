import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { ResearchFinding } from "@/types/research";

interface FindingsTableProps {
  findings: ResearchFinding[];
}

export function FindingsTable({ findings }: FindingsTableProps) {
  if (findings.length === 0) {
    return <p className="text-sm text-muted-foreground">Дані ще формуються...</p>;
  }

  return (
    <Table>
      <TableCaption>Автоматично зібрані результати.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Entity</TableHead>
          <TableHead>Criterion</TableHead>
          <TableHead>Snippet</TableHead>
          <TableHead>Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {findings.map((finding, index) => (
          <TableRow key={`${finding.entity}-${index}`}>
            <TableCell>{finding.entity}</TableCell>
            <TableCell>{finding.criterion}</TableCell>
            <TableCell className="max-w-xs text-sm text-muted-foreground">
              {finding.snippet}
            </TableCell>
            <TableCell>
              <a
                href={finding.evidence}
                className="text-primary underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
