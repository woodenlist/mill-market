import { supabase } from "./supabase";

const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const S3_REGION = import.meta.env.VITE_AWS_S3_REGION;

/**
 * Upload a ticket photo to S3 via a Supabase Edge Function that returns a
 * presigned PUT URL.
 *
 * Flow:
 *   1. Call the `/functions/v1/s3-presign` edge function with the desired key
 *      and content type.
 *   2. PUT the file directly to S3 using the presigned URL.
 *   3. Return the final public S3 URL for the uploaded object.
 *
 * @param {File} file        - The image File object to upload.
 * @param {string} ticketId  - The ticket UUID, used to namespace the S3 key.
 * @returns {Promise<string>} The S3 object key (use {@link getPhotoUrl} to
 *   build the full URL).
 */
export async function uploadTicketPhoto(file, ticketId) {
  const ext = file.name.split(".").pop();
  const key = `tickets/${ticketId}/${Date.now()}.${ext}`;

  // 1. Get presigned URL from the edge function
  const { data: session } = await supabase.auth.getSession();
  const accessToken = session?.session?.access_token;

  const presignRes = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/s3-presign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        key,
        contentType: file.type,
      }),
    }
  );

  if (!presignRes.ok) {
    const err = await presignRes.text();
    throw new Error(`Failed to get presigned URL: ${err}`);
  }

  const { url } = await presignRes.json();

  // 2. PUT the file directly to S3
  const uploadRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`S3 upload failed with status ${uploadRes.status}`);
  }

  return key;
}

/**
 * Build a public S3 URL for a given object key.
 *
 * @param {string} key - The S3 object key (e.g. `tickets/<id>/1234567890.jpg`).
 * @returns {string} The full HTTPS URL pointing to the object.
 */
export function getPhotoUrl(key) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}
