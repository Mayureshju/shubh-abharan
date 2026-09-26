import { NextResponse } from "next/server";
import { quoteCart, type CartLineInput } from "@/lib/commerce/quote";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    lines?: CartLineInput[];
    couponCode?: string;
    pincode?: string;
  };
  const quote = await quoteCart(body.lines ?? [], {
    couponCode: body.couponCode,
    pincode: body.pincode,
  });
  return NextResponse.json(quote);
}
