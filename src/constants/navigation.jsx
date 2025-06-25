export const NAV_ITEMS = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <img src="/dashboard.svg" alt="Dashboard" className="w-8 h-8" />,
    navicon: <img src="/dashboard.svg" alt="Dashboard" className="w-6 h-6" />,
    activeIcon: (
      <img src="/dashboard2.svg" alt="Dashboard Active" className="w-8 h-8" />
    ),
  },
  {
    path: "/repositories",
    name: "Repositories",
    icon: <img src="/repo.svg" alt="Repositories" className="w-8 h-8" />,
    navicon: <img src="/repo.svg" alt="Repositories" className="w-6 h-6" />,
    activeIcon: (
      <img src="/repo2.svg" alt="Repositories Active" className="w-8 h-8" />
    ),
  },
  {
    path: "/integration",
    name: "Integrations",
    icon: <img src="/integration.svg" alt="Integration" className="w-8 h-8" />,
    navicon: (
      <img src="/integration.svg" alt="Integration" className="w-6 h-6" />
    ),
    activeIcon: (
      <img
        src="/integraion2.svg"
        alt="Integration Active"
        className="w-8 h-8"
      />
    ),
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <img src="/settings.svg" alt="Settings" className="w-8 h-8" />,
    navicon: <img src="/settings.svg" alt="Settings" className="w-6 h-6" />,
    activeIcon: (
      <img src="/settings.svg" alt="Settings Active" className="w-8 h-8" />
    ),
  },
];
