import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Content agent not yet connected" }, { status: 501 });
}
