export function WhatsappIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.27-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.13.89.84-3.05-.2-.31a8.2 8.2 0 1 1 7 3.8Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.12-.55.12-.17.25-.63.8-.77.96-.14.17-.29.18-.53.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.71-1.32.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.2 3.7 1.55.67 2.15.73 2.93.62.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
