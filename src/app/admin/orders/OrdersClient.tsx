"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOrderStatus } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type OrderStatus = Order['orderStatus'];
type PaymentStatus = Order['paymentStatus'];

const statusColors: Record<OrderStatus, string> = {
    Pending: "bg-yellow-500",
    Confirmed: "bg-blue-500",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
};

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = React.useState(initialOrders);
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, orderStatus: OrderStatus, paymentStatus: PaymentStatus) => {
    try {
        const updatedOrder = await updateOrderStatus(orderId, orderStatus, paymentStatus);
        if(updatedOrder){
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            toast({ title: "Status Updated", description: `Order ${orderId} has been updated.`});
        }
    } catch (error) {
        toast({ title: "Update Failed", variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => `PKR ${row.original.total.toFixed(2)}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => <Badge variant="outline">{row.original.paymentMethod}</Badge>,
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment Status",
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            const isPaid = status === 'Paid';
            const isPending = status.startsWith('Pending');

            return (
                 <Badge className={isPaid ? 'bg-green-500' : isPending ? 'bg-yellow-500' : 'bg-gray-500'}>
                    {status}
                </Badge>
            )
        }
    },
    {
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusColors[row.original.orderStatus]}`} />
            {row.original.orderStatus}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {order.paymentProofUrl && (
                    <DialogTrigger asChild>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" /> View Payment Proof
                        </DropdownMenuItem>
                    </DialogTrigger>
                  )}
                  {order.paymentStatus === 'Pending Verification' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Confirmed', 'Paid')}>
                      Mark as Paid & Confirm
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={order.orderStatus}
                    onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus, order.paymentStatus)}
                  >
                    {(['Pending', 'Confirmed', 'Delivered', 'Cancelled'] as OrderStatus[]).map(status => (
                        <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Payment Proof for Order {order.id}</DialogTitle>
                  </DialogHeader>
                  {order.paymentProofUrl && 
                    <div className="relative aspect-[9/16] w-full mt-4">
                        <Image src={order.paymentProofUrl} alt="Payment proof" fill objectFit="contain" />
                    </div>
                  }
              </DialogContent>
            </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
         <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
