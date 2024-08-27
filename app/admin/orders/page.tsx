// app/admin/orders/page.tsx
import React from 'react';
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const dynamic = 'force-dynamic';

interface AdminOrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortField = (searchParams.sort as string) || 'createdAt';
  const sortOrder = (searchParams.order as 'asc' | 'desc') || 'desc';

  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
    orderBy: {
      [sortField]: sortOrder,
    },
    skip,
    take: limit,
  });

  const totalOrders = await prisma.order.count();
  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Link href={`/admin/orders?sort=id&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                Order ID
              </Link>
            </TableHead>
            <TableHead>
              <Link href={`/admin/orders?sort=user.email&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                User
              </Link>
            </TableHead>
            <TableHead>
              <Link href={`/admin/orders?sort=planName&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                Plan Name
              </Link>
            </TableHead>
            <TableHead>
              <Link href={`/admin/orders?sort=amount&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                Amount
              </Link>
            </TableHead>
            <TableHead>
              <Link href={`/admin/orders?sort=status&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                Status
              </Link>
            </TableHead>
            <TableHead>
              <Link href={`/admin/orders?sort=createdAt&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                Created At
              </Link>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.planName}</TableCell>
              <TableCell>{`${order.currency} ${(order.amount / 100).toFixed(2)}`}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{format(order.createdAt, 'PPP')}</TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={page > 1 ? `/admin/orders?page=${page - 1}` : '#'} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink href={`/admin/orders?page=${pageNum}`} isActive={pageNum === page}>
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href={page < totalPages ? `/admin/orders?page=${page + 1}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}