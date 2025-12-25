// src/app/(admin)/admin/orders/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: { id: string; product: { name: string; images: string[] }; quantity: number; price: number }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      console.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (orderId: string, data: { status?: string; trackingNumber?: string }) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch {
      console.error("Failed to update order");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-primary-100 text-primary-800",
      PROCESSING: "bg-purple-100 text-purple-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Package size={16} />;
      case "SHIPPED":
        return <Truck size={16} />;
      case "DELIVERED":
        return <CheckCircle size={16} />;
      case "CANCELLED":
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by order number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-600">
                  #{order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{order.user.name}</p>
                  <p className="text-sm text-gray-500">{order.user.email}</p>
                </td>
                <td className="px-6 py-4">{order.items.length} items</td>
                <td className="px-6 py-4 font-semibold">₹{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-800 font-medium"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-6 text-center text-gray-600">No orders found.</div>
        )}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Order #{selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Customer & Status */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Details</h4>
                <p className="text-gray-700">{selectedOrder.user.name}</p>
                <p className="text-gray-600 text-sm">{selectedOrder.user.email}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrder(selectedOrder.id, { status: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tracking Number</h4>
                  <input
                    type="text"
                    value={selectedOrder.trackingNumber || ""}
                    onChange={(e) =>
                      updateOrder(selectedOrder.id, { trackingNumber: e.target.value })
                    }
                    placeholder="Enter tracking number"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-3 hover:bg-gray-50 rounded">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
