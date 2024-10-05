// app/payment-complete/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const REVOLUT_API_URL = "https://sandbox-merchant.revolut.com/api/orders";

async function getRevolutOrderStatus(revolutOrderId: string) {
  try {
    const response = await fetch(`${REVOLUT_API_URL}/${revolutOrderId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order status from Revolut');
    }

    const orderData = await response.json();
    return orderData.state;
  } catch (error) {
    console.error('Error fetching Revolut order status:', error);
    return null;
  }
}

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: { itineraryId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/api/auth/signin");
  }

  const { itineraryId } = searchParams;

  if (!itineraryId) {
    return <div>Error: No itinerary ID provided.</div>;
  }

  try {
    // Find the order associated with the itinerary
    const order = await prisma.order.findFirst({
      where: {
        status: 'PENDING',
        schedule: {
          contains: itineraryId
        }
      }
    });

    if (!order) {
      return <div>Error: No pending order found for this itinerary.</div>;
    }

    const revolutOrderStatus = await getRevolutOrderStatus(order.revolutOrderId);

    if (revolutOrderStatus === 'completed') {
      // Update order status in our database
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      return (
        <div>
          <h1>Payment Successful!</h1>
          <p>Your payment has been completed and your itinerary is now confirmed.</p>
          <a href="/profile">View My Orders</a>
        </div>
      );
    } else if (revolutOrderStatus === 'failed') {
      // Update order status in our database
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      });

      return (
        <div>
          <h1>Payment Failed</h1>
          <p>Unfortunately, your payment could not be processed. Please try again.</p>
          <a href="/profile">Back to Profile</a>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Payment Pending</h1>
          <p>Your payment is still being processed. Please check back later.</p>
          <a href="/profile">Back to Profile</a>
        </div>
      );
    }
  } catch (error) {
    console.error('Error processing payment completion:', error);
    return <div>An error occurred while processing your payment. Please contact support.</div>;
  }
}