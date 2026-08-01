import { randomUUID } from "node:crypto";
import {
  DocumentStatus,
  DocumentUploadPayloadSchema,
  JobType,
} from "@ac/shared";
import { getUserOrgContext } from "@/lib/auth/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }
  const context = await getUserOrgContext();
  if (!context) return Response.json({ error: "unauthorized" }, { status: 401 });

  const documentId = randomUUID();
  const safeFilename = file.name.replace(/[^\w.\- ()]/g, "_");
  const storagePath = `${context.orgId}/${documentId}/${safeFilename}`;

  const upload = DocumentUploadPayloadSchema.safeParse({
    orgId: context.orgId,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    storagePath,
  });

  if (!upload.success) {
    return Response.json({ error: upload.error.flatten() }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();
  const { error: storageError } = await admin.storage
    .from("documents")
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: upload.data.mimeType,
      upsert: false,
    });
  if (storageError) {
    return Response.json({ error: storageError.message }, { status: 500 });
  }

  const { data: document, error: documentError } = await admin
    .from("documents")
    .insert({
    id: documentId,
      org_id: context.orgId,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: upload.data.mimeType,
    status: DocumentStatus.Received,
      created_by: context.userId,
    })
    .select("id, org_id, storage_path, original_filename, status")
    .single();
  if (documentError) {
    await admin.storage.from("documents").remove([storagePath]);
    return Response.json({ error: documentError.message }, { status: 500 });
  }

  const { data: job, error: jobError } = await admin
    .from("document_jobs")
    .insert({
      org_id: context.orgId,
      document_id: documentId,
      type: JobType.Ocr,
      status: "pending",
      payload: {
        storagePath,
        originalFilename: file.name,
        mimeType: upload.data.mimeType,
      },
    })
    .select("id, type, status")
    .single();
  if (jobError) {
    await admin.from("documents").delete().eq("id", documentId);
    await admin.storage.from("documents").remove([storagePath]);
    return Response.json({ error: jobError.message }, { status: 500 });
  }

  return Response.json(
    {
      document: {
        id: document.id,
        orgId: document.org_id,
        storagePath: document.storage_path,
        status: document.status,
        originalFilename: document.original_filename,
      },
      job,
    },
    { status: 201 },
  );
}
