"use client";

import { useRef, useState } from "react";
import { CircleCheck, Link2, Upload, Video } from "lucide-react";
import { savePastorSermon } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { parseFacebookUrl } from "@/lib/facebook";
import { todayInChicago } from "@/lib/format";

const bigField =
  "block w-full rounded-2xl border border-midnight-200 bg-white px-5 py-4 text-lg text-midnight-900 placeholder:text-midnight-500/60 focus:border-royal-500";
const bigLabel = "mb-2 block text-lg font-semibold text-midnight-800";

type Phase =
  | { step: "idle" }
  | { step: "uploading"; pct: number; what: string }
  | { step: "saving" }
  | { step: "success"; message: string }
  | { step: "error"; message: string };

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, "_").slice(-80);
}

function uploadWithProgress(
  path: string,
  file: File,
  token: string,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/sermons/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else if (xhr.status === 413) {
        reject(
          new Error(
            "That video is too large for the current storage plan. Try a shorter video, or post it to Facebook and paste the link instead."
          )
        );
      } else {
        reject(
          new Error(
            "The upload didn't finish. Please check your connection and tap Try Again."
          )
        );
      }
    };
    xhr.onerror = () =>
      reject(
        new Error(
          "The upload didn't finish. Please check your connection and tap Try Again."
        )
      );
    xhr.send(file);
  });
}

export default function PastorSermonForm() {
  const [source, setSource] = useState<"facebook" | "upload">("facebook");
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  // Remember completed uploads so a retry never re-uploads the video.
  const uploadedVideoUrl = useRef<string | null>(null);
  const uploadedThumbUrl = useRef<string | null>(null);
  const lastVideoName = useRef<string | null>(null);

  const busy = phase.step === "uploading" || phase.step === "saving";

  async function handlePublish() {
    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const facebookUrl = String(fd.get("facebook_url") ?? "").trim();
    const videoFile = fd.get("video_file") as File | null;
    const thumbFile = fd.get("thumbnail_file") as File | null;

    if (!title) {
      setPhase({ step: "error", message: "Please give the sermon a title." });
      return;
    }

    if (source === "facebook") {
      const parsed = parseFacebookUrl(facebookUrl);
      if (!parsed.ok) {
        setPhase({
          step: "error",
          message: parsed.error ?? "Please paste the Facebook Reel link.",
        });
        return;
      }
    } else {
      const hasNewFile = videoFile && videoFile.size > 0;
      if (!hasNewFile && !uploadedVideoUrl.current) {
        setPhase({
          step: "error",
          message: "Please choose a video from your phone first.",
        });
        return;
      }
      if (hasNewFile) {
        if (
          !videoFile.type.startsWith("video/") &&
          !/\.(mp4|mov|webm)$/i.test(videoFile.name)
        ) {
          setPhase({
            step: "error",
            message: "Please choose a video file (MP4, MOV, or WebM).",
          });
          return;
        }
        if (videoFile.size > 500 * 1024 * 1024) {
          setPhase({
            step: "error",
            message:
              "That video is larger than 500 MB. Try a shorter video, or post it to Facebook and paste the link instead.",
          });
          return;
        }
      }
    }

    try {
      const supabase = createBrowserSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setPhase({
          step: "error",
          message: "Your sign-in expired. Please refresh and sign in again.",
        });
        return;
      }

      // Upload the video (skipped on retry if it already made it up).
      if (source === "upload" && videoFile && videoFile.size > 0) {
        const alreadyUploaded =
          uploadedVideoUrl.current && lastVideoName.current === videoFile.name;
        if (!alreadyUploaded) {
          const path = `videos/${Date.now()}-${sanitizeFileName(videoFile.name)}`;
          setPhase({ step: "uploading", pct: 0, what: "video" });
          await uploadWithProgress(path, videoFile, session.access_token, (pct) =>
            setPhase({ step: "uploading", pct, what: "video" })
          );
          uploadedVideoUrl.current = `${SUPABASE_URL}/storage/v1/object/public/sermons/${path}`;
          lastVideoName.current = videoFile.name;
        }
      }

      if (thumbFile && thumbFile.size > 0 && !uploadedThumbUrl.current) {
        if (thumbFile.type.startsWith("image/") && thumbFile.size <= 10 * 1024 * 1024) {
          const path = `thumbs/${Date.now()}-${sanitizeFileName(thumbFile.name)}`;
          setPhase({ step: "uploading", pct: 0, what: "picture" });
          await uploadWithProgress(path, thumbFile, session.access_token, (pct) =>
            setPhase({ step: "uploading", pct, what: "picture" })
          );
          uploadedThumbUrl.current = `${SUPABASE_URL}/storage/v1/object/public/sermons/${path}`;
        }
      }

      setPhase({ step: "saving" });
      const actionData = new FormData();
      actionData.set("title", title);
      actionData.set("sermon_date", String(fd.get("sermon_date") ?? ""));
      actionData.set("speaker_name", String(fd.get("speaker_name") ?? ""));
      actionData.set(
        "scripture_reference",
        String(fd.get("scripture_reference") ?? "")
      );
      actionData.set("description", String(fd.get("description") ?? ""));
      if (source === "facebook") {
        actionData.set("facebook_url", facebookUrl);
      } else if (uploadedVideoUrl.current) {
        actionData.set("video_url", uploadedVideoUrl.current);
      }
      if (uploadedThumbUrl.current) {
        actionData.set("thumbnail_url", uploadedThumbUrl.current);
      }

      const result = await savePastorSermon(initialFormState, actionData);
      if (result.status === "success") {
        setPhase({ step: "success", message: result.message });
        uploadedVideoUrl.current = null;
        uploadedThumbUrl.current = null;
        lastVideoName.current = null;
        form.reset();
      } else {
        setPhase({ step: "error", message: result.message });
      }
    } catch (err) {
      setPhase({
        step: "error",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong. Please tap Try Again.",
      });
    }
  }

  if (phase.step === "success") {
    return (
      <div className="rounded-3xl border border-gold-200 bg-gold-50 p-8 text-center">
        <CircleCheck className="mx-auto h-12 w-12 text-gold-600" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-midnight-900">
          {phase.message}
        </p>
        <button
          type="button"
          onClick={() => setPhase({ step: "idle" })}
          className="mt-6 inline-flex min-h-14 items-center justify-center rounded-2xl bg-royal-600 px-8 py-4 text-lg font-semibold text-white hover:bg-royal-500"
        >
          Post Another Sermon
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void handlePublish();
      }}
    >
      <div>
        <label htmlFor="ps-title" className={bigLabel}>
          Sermon title
        </label>
        <input
          id="ps-title"
          name="title"
          type="text"
          required
          placeholder="Example: Love That Never Lets Go"
          className={bigField}
        />
      </div>

      <div>
        <label htmlFor="ps-date" className={bigLabel}>
          Sermon date
        </label>
        <input
          id="ps-date"
          name="sermon_date"
          type="date"
          required
          defaultValue={todayInChicago()}
          className={bigField}
        />
      </div>

      <div>
        <label htmlFor="ps-speaker" className={bigLabel}>
          Speaker
        </label>
        <input
          id="ps-speaker"
          name="speaker_name"
          type="text"
          defaultValue="Founder / Pastor Arthur Warning"
          className={bigField}
        />
      </div>

      <div>
        <label htmlFor="ps-scripture" className={bigLabel}>
          Scripture{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <input
          id="ps-scripture"
          name="scripture_reference"
          type="text"
          placeholder="Example: John 3:16"
          className={bigField}
        />
      </div>

      <div>
        <label htmlFor="ps-description" className={bigLabel}>
          Short description{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <textarea
          id="ps-description"
          name="description"
          rows={3}
          maxLength={600}
          className={bigField}
        />
      </div>

      <fieldset>
        <legend className={bigLabel}>Where is the sermon video?</legend>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSource("facebook")}
            aria-pressed={source === "facebook"}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-4 font-semibold ${
              source === "facebook"
                ? "border-royal-600 bg-royal-50 text-royal-800"
                : "border-midnight-200 bg-white text-midnight-700"
            }`}
          >
            <Link2 className="h-6 w-6" aria-hidden />
            Facebook Link
          </button>
          <button
            type="button"
            onClick={() => setSource("upload")}
            aria-pressed={source === "upload"}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-4 font-semibold ${
              source === "upload"
                ? "border-royal-600 bg-royal-50 text-royal-800"
                : "border-midnight-200 bg-white text-midnight-700"
            }`}
          >
            <Video className="h-6 w-6" aria-hidden />
            Upload Video
          </button>
        </div>
      </fieldset>

      {source === "facebook" ? (
        <div>
          <label htmlFor="ps-fb" className={bigLabel}>
            Facebook Reel link
          </label>
          <input
            id="ps-fb"
            name="facebook_url"
            type="url"
            inputMode="url"
            placeholder="https://www.facebook.com/reel/…"
            className={bigField}
          />
          <p className="mt-2 text-midnight-600">
            Post your sermon to Facebook first. Then copy the Reel link,
            paste it here, and press Publish.
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="ps-video" className={bigLabel}>
            Choose a video from your phone
          </label>
          <input
            id="ps-video"
            name="video_file"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/*"
            className="block w-full rounded-2xl border border-dashed border-royal-400 bg-royal-50 p-5 text-midnight-800 file:mr-4 file:rounded-full file:border-0 file:bg-royal-600 file:px-5 file:py-3 file:font-semibold file:text-white"
          />
          <p className="mt-2 text-midnight-600">
            MP4, MOV, or WebM — straight from your camera roll.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="ps-thumb" className={bigLabel}>
          Picture for the sermon card{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <input
          id="ps-thumb"
          name="thumbnail_file"
          type="file"
          accept="image/*"
          className="block w-full rounded-2xl border border-midnight-200 bg-white p-4 text-midnight-800 file:mr-4 file:rounded-full file:border-0 file:bg-midnight-50 file:px-5 file:py-2.5 file:font-semibold file:text-midnight-800"
        />
      </div>

      {phase.step === "uploading" && (
        <div role="status" className="rounded-2xl border border-royal-200 bg-royal-50 p-5">
          <p className="font-semibold text-midnight-900">
            Uploading your {phase.what}… {phase.pct}%
          </p>
          <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-royal-600 transition-[width] duration-300"
              style={{ width: `${phase.pct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-midnight-700">
            Please keep this page open until it finishes.
          </p>
        </div>
      )}

      {phase.step === "saving" && (
        <p role="status" className="rounded-2xl border border-royal-200 bg-royal-50 p-5 font-semibold text-midnight-900">
          Publishing your sermon…
        </p>
      )}

      {phase.step === "error" && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-800">
          {phase.message}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gold-400 px-8 py-5 text-xl font-bold text-midnight-950 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Upload className="h-6 w-6" aria-hidden />
        {busy
          ? "Working…"
          : phase.step === "error"
            ? "Try Again"
            : "Publish Sermon"}
      </button>
    </form>
  );
}
