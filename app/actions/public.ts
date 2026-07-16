"use server";

import { createPublicClient } from "@/lib/supabase/public";
import type { FormState } from "@/lib/form-state";

const NOT_CONFIGURED =
  "The website is not connected to its database yet. Please try again later or contact the church directly.";

function trimmed(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Basic honeypot check — bots fill the hidden field, people do not. */
function isBot(formData: FormData): boolean {
  return trimmed(formData, "website") !== "";
}

export async function submitPrayerRequest(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };

  const request = trimmed(formData, "request");
  if (request.length < 3) {
    return {
      status: "error",
      message: "Please share your prayer request before sending.",
    };
  }
  if (request.length > 5000) {
    return {
      status: "error",
      message: "Your request is a little long — please shorten it and try again.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase.from("prayer_requests").insert({
    name: trimmed(formData, "name") || null,
    contact: trimmed(formData, "contact") || null,
    request,
    confidential: formData.get("confidential") === "on",
  });

  if (error) {
    return {
      status: "error",
      message:
        "We couldn't send your request just now. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message:
      "Your prayer request has been received. You are not alone — our church family will be praying with you and for you.",
  };
}

export async function submitContactMessage(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };

  const name = trimmed(formData, "name");
  const contact = trimmed(formData, "contact");
  const message = trimmed(formData, "message");

  if (!name) return { status: "error", message: "Please tell us your name." };
  if (!contact) {
    return {
      status: "error",
      message: "Please include an email or phone number so we can reply.",
    };
  }
  if (message.length < 3) {
    return { status: "error", message: "Please write a short message." };
  }
  if (message.length > 5000) {
    return {
      status: "error",
      message: "Your message is a little long — please shorten it and try again.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, contact, message });

  if (error) {
    return {
      status: "error",
      message:
        "We couldn't send your message just now. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Thank you for reaching out. We will get back to you soon.",
  };
}

export async function submitSmsOptin(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };

  const firstName = trimmed(formData, "first_name");
  const phone = trimmed(formData, "phone");
  const consented = formData.get("consent") === "on";

  if (!firstName) {
    return { status: "error", message: "Please tell us your first name." };
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return {
      status: "error",
      message: "Please enter a valid 10-digit mobile number.",
    };
  }
  if (!consented) {
    return {
      status: "error",
      message: "Please check the consent box to receive text messages.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase.from("sms_optins").insert({
    first_name: firstName,
    phone,
    consented: true,
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't save your signup just now. Please try again soon.",
    };
  }

  return {
    status: "success",
    message: `Thank you, ${firstName}! You're on the list. Text messages will begin once our messaging service launches.`,
  };
}

export async function submitWelcomeCard(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };

  const firstName = trimmed(formData, "first_name");
  if (!firstName) {
    return { status: "error", message: "Please tell us your first name." };
  }
  const wantsContact = formData.get("wants_contact") === "on";
  const contact = trimmed(formData, "contact");
  if (wantsContact && !contact) {
    return {
      status: "error",
      message:
        "Please add a phone number or email so someone from the church can reach you.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase.from("welcome_cards").insert({
    first_name: firstName,
    contact: contact || null,
    questions: trimmed(formData, "questions") || null,
    wants_contact: wantsContact,
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't save your card just now. Please try again soon.",
    };
  }

  return {
    status: "success",
    message: `Welcome, ${firstName}! We're so glad you stopped by. We look forward to meeting you in person.`,
  };
}
