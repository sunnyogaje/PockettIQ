export type EmailMessage = {
  to: string
  subject: string
  /** Plain text body — kept simple since the dev sender just logs it. */
  text: string
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>
}
