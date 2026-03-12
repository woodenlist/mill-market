# s3-presign

Supabase Edge Function that generates presigned PUT URLs for uploading objects to the `millmarket-s3` S3 bucket (us-east-2).

## Required environment variables

Set these as Edge Function secrets before deploying:

```bash
supabase secrets set AWS_ACCESS_KEY_ID=<your-key>
supabase secrets set AWS_SECRET_ACCESS_KEY=<your-secret>
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided automatically by the runtime.

## Deploy

```bash
supabase functions deploy s3-presign --project-ref qmhfvwyfodqacwghudij
```

## Usage

```bash
curl -X POST https://qmhfvwyfodqacwghudij.supabase.co/functions/v1/s3-presign \
  -H "Authorization: Bearer <USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"key": "uploads/photo.jpg", "contentType": "image/jpeg"}'
```

Response:

```json
{ "url": "https://millmarket-s3.s3.us-east-2.amazonaws.com/uploads/photo.jpg?X-Amz-Algorithm=..." }
```

The returned presigned URL is valid for 15 minutes. Use it with a PUT request to upload the file directly to S3.
