"use client";

import useSWR from "swr";
import { z } from "zod";
import { FileContent } from "./db";
import { fileContentToZip } from "@/lib/file-content-to-zip";
import { v4 as uuidv4 } from "uuid";

const uploadContractResponseSchema = z.string();

export async function uploadContractCode(files: FileContent[]) {
  const zippedData = fileContentToZip(files);

  const formData = new FormData();
  const filePath = uuidv4() + ".zip";
  formData.append(
    "file",
    new File([zippedData], filePath, { type: "application/zip" }),
    filePath
  );

  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  const res = await fetch(`/api/audit/uploadContractCode`, requestInit);

  return await res.text();
}

const auditSchema = z.object({ reportUrl: z.string() });

export function useAudit(auditId?: string, transactionId?: string) {
  return useSWR(
    auditId && transactionId ? `audit-${auditId}-${transactionId}` : undefined,
    async () => {
      const res = await fetch(
        `/api/audit/auditContractCode?auditId=${auditId}&transactionId=${transactionId}`
      );

      const data = await res.json();

      const { reportUrl } = auditSchema.parse(data);

      return reportUrl;
    }
  );
}

const auditReportSchema = z.record(
  z.array(
    z.object({
      Description: z.string(),
      Content: z.string(),
      Detail: z.object({ Original: z.string(), Updated: z.string() }),
    })
  )
);

export function useAuditReport(auditId?: string) {
  return useSWR(auditId ? `audit-report-${auditId}` : undefined, async () => {
    const res = await fetch(`/api/audit/report/${auditId}`);

    const data = await res.json();

    const report = auditReportSchema.parse(data);

    return report;
  });
}
