import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AQA A-Level Maths Paper 3 Rescue Sheet";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0F3460",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#16A085",
            color: "white",
            padding: "10px 24px",
            borderRadius: "9999px",
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Pure Maths & Statistics | 7357/3
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          AQA A-Level Maths Paper 3<br />Rescue Sheet
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#e2e8f0",
            fontWeight: 500,
            maxWidth: "900px",
          }}
        >
          Your exam is on June 18th. The exact examiner-approved revision checklist and formula triage.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
