/**
 * Site-wide constants. The production URL is configurable through
 * NEXT_PUBLIC_SITE_URL so the domain can change without touching code.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agapelifeministry.org"
).replace(/\/+$/, "");

export const CHURCH = {
  name: "Agape Life Ministry",
  pastor: "Founder / Pastor Arthur Warning",
  serviceDay: "Sunday Worship",
  serviceTime: "Every Sunday at 9:00 AM CST",
  addressLine1: "5931 Bullard Avenue",
  addressLine2: "Suite 4",
  city: "New Orleans",
  state: "LA",
  stateFull: "Louisiana",
  zip: "70128",
  tagline: "Sharing God's unconditional love.",
} as const;

export const FULL_ADDRESS = `${CHURCH.addressLine1}, ${CHURCH.addressLine2}, ${CHURCH.city}, ${CHURCH.state} ${CHURCH.zip}`;

const encodedAddress = encodeURIComponent(
  `${CHURCH.addressLine1} ${CHURCH.addressLine2}, ${CHURCH.city}, ${CHURCH.state} ${CHURCH.zip}`
);

export const MAPS = {
  /** Open the location in Google Maps */
  open: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
  /** Turn-by-turn directions to the church */
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
  /** Key-free embeddable map */
  embed: `https://www.google.com/maps?q=${encodedAddress}&output=embed`,
} as const;
