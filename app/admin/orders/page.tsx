// app/admin/orders/page.tsx
import React from 'react';
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Prisma, OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminOrdersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const search = (searchParams.search as string) || '';

  let where: Prisma.OrderWhereInput = {};

  if (search) {
    where = {
      OR: [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { planName: { contains: search, mode: 'insensitive' } },
        { status: { equals: search as OrderStatus } },
      ],
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
  });

  const totalOrders = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <div className="mb-4">
        <form className='flex'>
          <Input
            type="text"
            placeholder="Search orders..."
            name="search"
            defaultValue={search}
          />
          <Button type="submit" className="ml-2">Search</Button>
        </form>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
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
            <PaginationPrevious href={page > 1 ? `/admin/orders?page=${page - 1}&search=${search}` : '#'} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink 
                href={`/admin/orders?page=${pageNum}&search=${search}`} 
                isActive={pageNum === page}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href={page < totalPages ? `/admin/orders?page=${page + 1}&search=${search}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}