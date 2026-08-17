import type { Metadata } from "next"
import Link from "next/link"
import { Share, SquarePlus, Smartphone, Monitor } from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { Card, CardContent } from "@/components/ui/card"
import { AndroidInstallAction } from "./install-actions"
import { AlreadyInstalledGate } from "./already-installed-gate"

export const metadata: Metadata = {
  title: "Install PockettIQ",
  description: "Install PockettIQ on your phone or computer for faster access to your money dashboard.",
}

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="mb-8 inline-block">
        <Logo />
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Install PockettIQ</h1>
      <p className="mt-1 text-muted-foreground">
        Get faster access to your money dashboard directly from your home screen.
      </p>

      <AlreadyInstalledGate>
        <div className="mt-8 space-y-4">
          <Card>
            <CardContent>
              <div className="mb-2 flex items-center gap-2">
                <Smartphone className="size-4 text-primary" />
                <h2 className="font-semibold">Android (Chrome)</h2>
              </div>
              <AndroidInstallAction />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <Smartphone className="size-4 text-primary" />
                <h2 className="font-semibold">iPhone (Safari)</h2>
              </div>
              <ol className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">1</span>
                  <span className="flex items-center gap-1.5">
                    Tap the <Share className="size-4" /> <strong>Share</strong> button in Safari.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">2</span>
                  Scroll down the share sheet.
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">3</span>
                  <span className="flex items-center gap-1.5">
                    Tap <SquarePlus className="size-4" /> <strong>Add to Home Screen</strong>.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">4</span>
                  Tap <strong>Add</strong> in the top-right corner.
                </li>
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                This only works from Safari — PockettIQ can&apos;t be installed this way from
                Chrome or other browsers on iPhone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-2 flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                <h2 className="font-semibold">Desktop</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                On Chrome or Edge, click the install icon in the address bar (or open the
                browser menu and choose <strong>Install PockettIQ</strong>). PockettIQ will
                open in its own window like a regular app.
              </p>
            </CardContent>
          </Card>
        </div>
      </AlreadyInstalledGate>
    </div>
  )
}
