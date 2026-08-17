"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteAccountAction } from "@/server/actions/account"

export function DeleteAccountDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)

  async function onDelete() {
    setDeleting(true)
    const result = await deleteAccountAction()
    if (!result.ok) {
      setDeleting(false)
      toast.error(result.error)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText("") }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account and all your financial data —
            transactions, budgets, goals, recurring items, and reminders. This can&apos;t
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Type <span className="font-semibold">DELETE</span> to confirm
          </label>
          <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={confirmText !== "DELETE" || deleting}
            onClick={onDelete}
          >
            {deleting ? "Deleting…" : "Permanently delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
