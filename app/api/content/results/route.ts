import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Content agent not yet connected" }, { status: 501 });
}
