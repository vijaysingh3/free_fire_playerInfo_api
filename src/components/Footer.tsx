import Link from "next/link";
import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Flame className="h-4 w-4" />
              </div>
              <span className="font-bold">FF Players Info</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Free Fire player data API for developers. Fast, reliable, and
              easy to integrate.
            </p>
          </div>

          {/* API */}
          <div>
            <h4 className="text-sm font-semibold">API</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/lab"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Live Testing Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Status Page
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Changelog</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Rate Limits
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Refund Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 FF Players Info API. Built by Vijay Singh.
          </p>
        </div>
      </div>
    </footer>
  );
}
