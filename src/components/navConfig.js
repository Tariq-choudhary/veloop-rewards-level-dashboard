// Shared nav item config used by both TopBar's drawer and BottomNav, so the
// two stay in sync without duplicating markup. Purely presentational
// in-page navigation — "earn" and "rewards" smooth-scroll to existing
// sections; no new routes are introduced.
import { DollarSign, Gift, Home, User, Wallet } from "lucide-react";

export const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "earn", label: "Earn", icon: DollarSign },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "profile", label: "Profile", icon: User },
];
