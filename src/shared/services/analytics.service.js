/**
 * Service to process order data into analytics and chart formats.
 */
export const analyticsService = {
  /**
   * Calculates Key Performance Indicators (KPIs)
   */
  calculateKPIs: (orders = []) => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.orderStatus === "Delivered");
    
    // Using reduce for total revenue (ensuring safe decimal math)
    const netRevenue = completedOrders.reduce((sum, order) => {
        const total = parseFloat(order.totalPrice || order.totalAmount || order.total || 0);
        return sum + total;
    }, 0);

    const activeOrders = orders.filter(o => 
        !["Delivered", "Cancelled"].includes(o.orderStatus)
    ).length;

    const averageOrderValue = totalOrders > 0 ? netRevenue / completedOrders.length || 0 : 0;

    // Simple growth calculation mockup (comparing to a filtered "previous" period could be added)
    return {
      totalRevenue: netRevenue,
      totalOrders,
      activeOrders,
      averageOrderValue,
      growth: 12.5 // Mock growth percentage
    };
  },

  /**
   * Generates Revenue Trend for a specific date range
   */
  getRevenueTrend: (orders = [], startDate, endDate) => {
    const rawTrend = {};
    
    // Provide fallback range if dates are missing (Last 7 Days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(end.getDate() - 6));
    
    // Initialize all dates in range with 0
    let current = new Date(start);
    while (current <= end) {
        const dateKey = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        rawTrend[dateKey] = 0;
        current.setDate(current.getDate() + 1);
    }

    orders.forEach(order => {
      if (order.orderStatus === "Delivered") {
        const d = new Date(order.createdAt);
        if (d >= start && d <= end) {
            const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (rawTrend.hasOwnProperty(dateKey)) {
                rawTrend[dateKey] += parseFloat(order.totalPrice || order.totalAmount || order.total || 0);
            }
        }
      }
    });

    return Object.entries(rawTrend)
      .map(([date, amount]) => ({ date, amount }));
  },

  /**
   * Calculates sales distribution by category
   */
  getCategoryDistribution: (orders = []) => {
    const categories = {};
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const cat = item.menuItem?.category || "Other";
                categories[cat] = (categories[cat] || 0) + 1;
            });
        }
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  },

  /**
   * Peak hours analysis (Orders count per hour)
   */
  getPeakHours: (orders = []) => {
      const hours = Array.from({ length: 24 }, (_, i) => ({ 
          hour: `${i}:00`, 
          orders: 0 
      }));

      orders.forEach(order => {
          const hour = new Date(order.createdAt).getHours();
          hours[hour].orders += 1;
      });

      return hours;
  }
};

export default analyticsService;
