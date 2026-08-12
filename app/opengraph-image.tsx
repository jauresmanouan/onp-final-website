import { ImageResponse } from "next/og";

export const alt =
  "Office National de la Population, Observatoire Population et Développement";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Vignette de partage, rendue au build plutôt que dessinée dans un fichier :
 * elle reste alignée sur la charte, et le filet tricolore comme la teinte du
 * panneau suivent le site sans qu'un visuel soit à régénérer à la main.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#065F46",
          color: "#ECFDF5",
        }}
      >
        <div style={{ display: "flex", height: 12 }}>
          <div style={{ flex: 1, background: "#FF8200" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#009A44" }} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            République de Côte d&apos;Ivoire
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            Office National de la Population
          </div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#FDBA74" }}>
            Observatoire Population et Développement
          </div>
        </div>
      </div>
    ),
    size,
  );
}
