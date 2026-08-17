import "server-only"
import type { EmailSender, EmailMessage } from "@/server/email/sender"

/**
 * Development email "sender" — logs the message instead of delivering it.
 * Swap the export in index.ts for a real provider (e.g. Resend) later
 * without touching any call sites.
 */
export const consoleEmailSender: EmailSender = {
  async send(message: EmailMessage) {
    console.log(
      [
        "\n──────── 📧 PockettIQ email (console sender) ────────",
        `To:      ${message.to}`,
        `Subject: ${message.subject}`,
        "",
        message.text,
        "───────────────────────────────────────────────────────\n",
      ].join("\n")
    )
  },
}
