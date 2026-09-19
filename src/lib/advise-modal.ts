export const ADVISE_MODAL_OPEN_EVENT = "diamond-vn:open-advise-modal";

export function openAdviseModal() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(ADVISE_MODAL_OPEN_EVENT));
}
