import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart3,
    Calendar,
    Download,
    Filter,
    Pizza,
    TrendingUp,
    Loader2,
    ChevronRight,
    Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orderService, analyticsService } from "@shared/services";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/components/ui/tabs";
import { RevenueTrendChart } from "../components/dashboard/DashboardCharts";

const Reports = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [visibleCount, setVisibleCount] = useState(15);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await orderService.getAllOrders();
                setOrders(response.data || []);
            } catch (err) {
                console.error("Reports data fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Filter orders based on dateRange
    const filteredOrdersByTime = useMemo(() => {
        const start = new Date(dateRange.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);

        return orders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= start && d <= end;
        });
    }, [orders, dateRange]);

    // KPIs derived only from the rows currently visible in the ledger
    const visibleStats = useMemo(() =>
        analyticsService.calculateKPIs(filteredOrdersByTime.slice(0, visibleCount)),
        [filteredOrdersByTime, visibleCount]
    );

    // Date range processing for Chart
    const reportData = useMemo(() => {
        return analyticsService.getRevenueTrend(orders, dateRange.start, dateRange.end);
    }, [orders, dateRange]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compiling Analytical Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
                            Azzipizza <span className="text-red-600 underline underline-offset-8 decoration-slate-200">Reports</span>
                        </h1>
                        <p className="text-slate-500 text-xs md:text-sm font-medium">Deep insights into business scale and performance.</p>
                    </div>
                    <div className="flex items-center gap-3 print:hidden">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="rounded-2xl border-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 h-12 bg-white flex gap-2"
                        >
                            <Printer className="w-4 h-4" /> Print Report
                        </Button>
                        <Button className="hidden rounded-2xl bg-red-600 text-white hover:bg-red-700 font-bold text-[10px] uppercase tracking-widest px-8 shadow-xl shadow-red-200 h-12 gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                    </div>
                </header>

                {/* Filters/Tabs Replacement: Custom Range Picker */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 print:hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Range Start</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="bg-slate-50 border border-slate-100 rounded-2xl px-6 h-14 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all text-xs"
                            />
                        </div>
                        <div className="h-px w-4 bg-slate-200 mt-5 hidden sm:block"></div>
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Range End</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="bg-slate-50 border border-slate-100 rounded-2xl px-6 h-14 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 h-14 bg-red-600 rounded-2xl shadow-lg shadow-red-200 text-white">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Applying Custom Intelligence
                            </span>
                        </div>
                        <Button variant="outline" className="hidden h-14 w-14 rounded-2xl border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Filter className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                </div>

                {/* Revenue Trend Visualization */}
                <Card className="border-none shadow-premium rounded-44 bg-white overflow-hidden p-4 sm:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-xl font-serif font-black text-slate-900">Revenue Trajectory</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                Visualizing fiscal momentum for your selected date range
                            </p>
                        </div>
                        <div className="px-5 py-2.5 bg-red-50 rounded-2xl flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">
                                Optimized Momentum
                            </span>
                        </div>
                    </div>
                    <RevenueTrendChart data={reportData} />
                </Card>

                {/* Detailed Stats Table */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="border-none shadow-premium rounded-44 bg-white overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-50 py-6 px-6 md:py-8 md:px-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <CardTitle className="text-2xl font-serif font-black text-slate-800">Operational Breakdown</CardTitle>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Granular order history & unit metrics</p>
                                </div>
                                <div className="flex gap-6 md:gap-10">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Flow</p>
                                        <p className="text-xl font-serif font-black text-slate-900">${visibleStats.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Volume</p>
                                        <p className="text-xl font-serif font-black text-slate-900">{visibleStats.totalOrders} Units</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 md:px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                                            <th className="px-6 md:px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Temporal Stamp</th>
                                            <th className="px-6 md:px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Entities</th>
                                            <th className="px-6 md:px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Flow Status</th>
                                            <th className="px-6 md:px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Net Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredOrdersByTime.length > 0 ? (
                                            filteredOrdersByTime.slice(0, visibleCount).map((order, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 md:px-10 py-6">
                                                        <span className="font-mono text-[10px] font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-6 hidden sm:table-cell">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-slate-900">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                {new Date(order.createdAt).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-6 hidden md:table-cell">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                                <Pizza className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">
                                                                {order.items?.length || 0} Items ordered
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-6">
                                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            order.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                            {order.orderStatus}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-6 text-right">
                                                        <span className="text-lg font-serif font-black text-slate-900 tracking-tight">
                                                            ${parseFloat(order.totalPrice || order.totalAmount || order.total || 0).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-10 py-20 text-center">
                                                    <BarChart3 className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                                    <h3 className="text-xl font-serif font-black text-slate-900 mb-2">Architecting Reports...</h3>
                                                    <p className="text-slate-400 font-medium text-xs max-w-xs mx-auto">Transactional data will automatically populate this ledger as sales occur.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredOrdersByTime.length > visibleCount && (
                                <div className="p-8 border-t border-slate-50 flex justify-center print:hidden">
                                    <Button
                                        variant="ghost"
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600"
                                        onClick={() => setVisibleCount(prev => prev + 15)}
                                    >
                                        Load Full Intelligence Ledger <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
