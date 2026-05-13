import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text(); // read as text first
    console.log("Backend raw response:", text); // check your terminal for this

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { message: `Backend returned invalid JSON: ${text.slice(0, 200)}` },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Login failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      token: result.token ?? result.data?.token ?? result.accessToken,
    });

  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}