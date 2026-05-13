interface CrumblessGlobal {
  track: (eventName: string) => void;
}

interface Window {
  crumbless?: CrumblessGlobal;
}
