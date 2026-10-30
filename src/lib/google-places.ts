import "server-only";

type PlaceReview = {
  authorAttribution?: { displayName?: string };
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
};

export type GoogleReviews = {
  rating: number;
  total: number;
  mapsUri: string;
  reviews: { author: string; rating: number; text: string; when: string }[];
};

/**
 * Integração oficial com a Places API (New). Exige GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID.
 * Retorna null se não configurada ou se a API falhar; a página nunca depende desse retorno.
 */
export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId || !/^[A-Za-z0-9_-]+$/.test(placeId)) return null;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=pt-BR`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    if (typeof j.rating !== "number") return null;
    return {
      rating: j.rating,
      total: j.userRatingCount ?? 0,
      mapsUri: typeof j.googleMapsUri === "string" ? j.googleMapsUri : "",
      reviews: ((j.reviews ?? []) as PlaceReview[]).slice(0, 5).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Usuário do Google",
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        when: r.relativePublishTimeDescription ?? "",
      })).filter((r: { text: string }) => r.text),
    };
  } catch {
    return null;
  }
}
