import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import {
  Order,
  OrderItem,
  OrderTracking,
  ReturnRequest,
  CancellationRequest,
  OrderStatus,
  ReturnStatus,
} from '@/types/order';
import { ordersApi } from './ordersApi';

// Entity adapters for normalization
const ordersAdapter = createEntityAdapter<Order>();
const orderItemsAdapter = createEntityAdapter<OrderItem>();
const orderTrackingAdapter = createEntityAdapter<OrderTracking>();
const returnRequestsAdapter = createEntityAdapter<ReturnRequest>();
const cancellationRequestsAdapter = createEntityAdapter<CancellationRequest>();

// Define the state
interface OrdersState {
  orders: ReturnType<typeof ordersAdapter.getInitialState>;
  orderItems: ReturnType<typeof orderItemsAdapter.getInitialState>;
  orderTracking: ReturnType<typeof orderTrackingAdapter.getInitialState>;
  returnRequests: ReturnType<typeof returnRequestsAdapter.getInitialState>;
  cancellationRequests: ReturnType<typeof cancellationRequestsAdapter.getInitialState>;
  activeOrderId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: OrdersState = {
  orders: ordersAdapter.getInitialState(),
  orderItems: orderItemsAdapter.getInitialState(),
  orderTracking: orderTrackingAdapter.getInitialState(),
  returnRequests: returnRequestsAdapter.getInitialState(),
  cancellationRequests: cancellationRequestsAdapter.getInitialState(),
  activeOrderId: null,
  status: 'idle',
  error: null,
};

// Create the slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setActiveOrder: (state, action: PayloadAction<string>) => {
      state.activeOrderId = action.payload;
    },
    clearActiveOrder: (state) => {
      state.activeOrderId = null;
    },
    // These are mostly for offline/mock use, real data comes from API
    addOrder: (state, action: PayloadAction<Order>) => {
      ordersAdapter.addOne(state.orders, action.payload);
      
      // Add order items
      action.payload.items.forEach(item => {
        orderItemsAdapter.addOne(state.orderItems, item);
      });
      
      // Add tracking if present
      if (action.payload.tracking) {
        orderTrackingAdapter.addOne(state.orderTracking, action.payload.tracking);
      }
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const { orderId, status } = action.payload;
      ordersAdapter.updateOne(state.orders, {
        id: orderId,
        changes: { status },
      });
    },
    addReturnRequest: (state, action: PayloadAction<ReturnRequest>) => {
      returnRequestsAdapter.addOne(state.returnRequests, action.payload);
      
      // Update the order item status
      orderItemsAdapter.updateOne(state.orderItems, {
        id: action.payload.orderItemId,
        changes: { returnStatus: ReturnStatus.REQUESTED },
      });
    },
    updateReturnStatus: (state, action: PayloadAction<{ returnId: string; status: ReturnStatus }>) => {
      const { returnId, status } = action.payload;
      returnRequestsAdapter.updateOne(state.returnRequests, {
        id: returnId,
        changes: { status },
      });
      
      // Also update the related order item's return status
      const returnRequest = state.returnRequests.entities[returnId];
      if (returnRequest) {
        orderItemsAdapter.updateOne(state.orderItems, {
          id: returnRequest.orderItemId,
          changes: { returnStatus: status },
        });
      }
    },
    addCancellationRequest: (state, action: PayloadAction<CancellationRequest>) => {
      cancellationRequestsAdapter.addOne(state.cancellationRequests, action.payload);
    },
    addOrderTrackingUpdate: (state, action: PayloadAction<{ 
      trackingId: string; 
      update: OrderTracking['updates'][0];
    }>) => {
      const { trackingId, update } = action.payload;
      const tracking = state.orderTracking.entities[trackingId];
      
      if (tracking) {
        orderTrackingAdapter.updateOne(state.orderTracking, {
          id: trackingId,
          changes: { 
            status: update.status,
            updates: [...tracking.updates, update]
          },
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Handle API responses and update the normalized state
    
    // Orders list
    builder.addMatcher(
      ordersApi.endpoints.getOrders.matchFulfilled,
      (state, { payload }) => {
        ordersAdapter.upsertMany(state.orders, payload.orders);
        
        // Process order items for normalization
        payload.orders.forEach(order => {
          orderItemsAdapter.upsertMany(state.orderItems, order.items);
          
          // Add tracking if present
          if (order.tracking) {
            orderTrackingAdapter.upsertOne(state.orderTracking, order.tracking);
          }
        });
      }
    );
    
    // Order details
    builder.addMatcher(
      ordersApi.endpoints.getOrderDetails.matchFulfilled,
      (state, { payload }) => {
        ordersAdapter.upsertOne(state.orders, payload.order);
        orderItemsAdapter.upsertMany(state.orderItems, payload.order.items);
        
        if (payload.tracking) {
          orderTrackingAdapter.upsertOne(state.orderTracking, payload.tracking);
        }
        
        if (payload.returnRequests) {
          returnRequestsAdapter.upsertMany(state.returnRequests, payload.returnRequests);
        }
        
        if (payload.cancellationRequest) {
          cancellationRequestsAdapter.upsertOne(
            state.cancellationRequests, 
            payload.cancellationRequest
          );
        }
      }
    );
    
    // Order tracking
    builder.addMatcher(
      ordersApi.endpoints.getOrderTracking.matchFulfilled,
      (state, { payload }) => {
        orderTrackingAdapter.upsertOne(state.orderTracking, payload.tracking);
      }
    );
    
    // Order tracking (polling)
    builder.addMatcher(
      ordersApi.endpoints.pollOrderTracking.matchFulfilled,
      (state, { payload }) => {
        orderTrackingAdapter.upsertOne(state.orderTracking, payload.tracking);
      }
    );
    
    // Return request submission
    builder.addMatcher(
      ordersApi.endpoints.submitReturnRequest.matchFulfilled,
      (state, { payload }) => {
        returnRequestsAdapter.upsertOne(state.returnRequests, payload.returnRequest);
        
        // Update order item status
        orderItemsAdapter.updateOne(state.orderItems, {
          id: payload.returnRequest.orderItemId,
          changes: { returnStatus: ReturnStatus.REQUESTED },
        });
      }
    );
    
    // Return request details
    builder.addMatcher(
      ordersApi.endpoints.getReturnRequestDetails.matchFulfilled,
      (state, { payload }) => {
        returnRequestsAdapter.upsertOne(state.returnRequests, payload.returnRequest);
      }
    );
    
    // Cancellation request submission
    builder.addMatcher(
      ordersApi.endpoints.submitCancellationRequest.matchFulfilled,
      (state, { payload }) => {
        cancellationRequestsAdapter.upsertOne(state.cancellationRequests, payload.cancellationRequest);
      }
    );
    
    // Cancellation request details
    builder.addMatcher(
      ordersApi.endpoints.getCancellationRequestDetails.matchFulfilled,
      (state, { payload }) => {
        cancellationRequestsAdapter.upsertOne(state.cancellationRequests, payload.cancellationRequest);
      }
    );
  },
});

// Export actions
export const {
  setActiveOrder,
  clearActiveOrder,
  addOrder,
  updateOrderStatus,
  addReturnRequest,
  updateReturnStatus,
  addCancellationRequest,
  addOrderTrackingUpdate,
} = ordersSlice.actions;

// Selectors
const ordersSelectors = ordersAdapter.getSelectors<RootState>(state => state.orders.orders);
const orderItemsSelectors = orderItemsAdapter.getSelectors<RootState>(state => state.orders.orderItems);
const orderTrackingSelectors = orderTrackingAdapter.getSelectors<RootState>(state => state.orders.orderTracking);
const returnRequestsSelectors = returnRequestsAdapter.getSelectors<RootState>(state => state.orders.returnRequests);
const cancellationRequestsSelectors = cancellationRequestsAdapter.getSelectors<RootState>(state => state.orders.cancellationRequests);

export const selectActiveOrderId = (state: RootState) => state.orders.activeOrderId;

export const selectActiveOrder = createSelector(
  [selectActiveOrderId, ordersSelectors.selectEntities],
  (activeOrderId, orders) => {
    if (!activeOrderId) return null;
    return orders[activeOrderId] || null;
  }
);

export const selectOrderById = (id: string) => createSelector(
  [ordersSelectors.selectEntities],
  (orders) => orders[id] || null
);

export const selectOrderItemsByOrderId = (orderId: string) => createSelector(
  [orderItemsSelectors.selectAll],
  (items) => items.filter(item => item.orderId === orderId)
);

export const selectOrderItemById = (id: string) => createSelector(
  [orderItemsSelectors.selectEntities],
  (items) => items[id] || null
);

export const selectTrackingByOrderId = (orderId: string) => createSelector(
  [orderTrackingSelectors.selectAll],
  (trackings) => trackings.find(tracking => tracking.orderId === orderId) || null
);

export const selectReturnRequestsByOrderId = (orderId: string) => createSelector(
  [returnRequestsSelectors.selectAll],
  (requests) => requests.filter(request => request.orderId === orderId)
);

export const selectCancellationRequestByOrderId = (orderId: string) => createSelector(
  [cancellationRequestsSelectors.selectAll],
  (requests) => requests.find(request => request.orderId === orderId) || null
);

export const selectAllOrders = ordersSelectors.selectAll;
export const selectOrdersTotal = ordersSelectors.selectTotal;

// Export reducer
export default ordersSlice.reducer;