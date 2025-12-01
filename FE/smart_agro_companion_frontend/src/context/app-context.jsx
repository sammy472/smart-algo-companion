// app/context/AppContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  userType: null, // 'farmer' or 'buyer'
  farms: [],
  products: [],
  cart: [],
  orders: [],
  iotDevices: [],
  loading: false,
  error: null,
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER_TYPE: 'SET_USER_TYPE',
  ADD_FARM: 'ADD_FARM',
  UPDATE_FARM: 'UPDATE_FARM',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  ADD_ORDER: 'ADD_ORDER',
  ADD_IOT_DEVICE: 'ADD_IOT_DEVICE',
  UPDATE_IOT_DEVICE: 'UPDATE_IOT_DEVICE',
  UPDATE_SENSOR_DATA: 'UPDATE_SENSOR_DATA',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
      };
    
    case ActionTypes.SET_USER_TYPE:
      return { ...state, userType: action.payload };
    
    case ActionTypes.ADD_FARM:
      return {
        ...state,
        farms: [...state.farms, { ...action.payload, id: Date.now().toString() }],
      };
    
    case ActionTypes.UPDATE_FARM:
      return {
        ...state,
        farms: state.farms.map(farm =>
          farm.id === action.payload.id ? { ...farm, ...action.payload } : farm
        ),
      };
    
    case ActionTypes.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, { ...action.payload, id: Date.now().toString() }],
      };
    
    case ActionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        ),
      };
    
    case ActionTypes.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    
    case ActionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case ActionTypes.CLEAR_CART:
      return { ...state, cart: [] };
    
    case ActionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, { ...action.payload, id: Date.now().toString() }],
      };
    
    case ActionTypes.ADD_IOT_DEVICE:
      return {
        ...state,
        iotDevices: [...state.iotDevices, { ...action.payload, id: Date.now().toString() }],
      };
    
    case ActionTypes.UPDATE_IOT_DEVICE:
      return {
        ...state,
        iotDevices: state.iotDevices.map(device =>
          device.id === action.payload.id ? { ...device, ...action.payload } : device
        ),
      };
    
    case ActionTypes.UPDATE_SENSOR_DATA:
      return {
        ...state,
        iotDevices: state.iotDevices.map(device =>
          device.id === action.payload.deviceId
            ? {
                ...device,
                sensorData: {
                  ...device.sensorData,
                  ...action.payload.data,
                  lastUpdated: new Date().toISOString(),
                },
              }
            : device
        ),
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
    // Initialize mock data
    initializeMockData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { user, userType } = JSON.parse(userData);
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user, userType },
        });
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const initializeMockData = () => {
    // Mock products
    const mockProducts = [
      {
        id: '1',
        name: 'Fresh Tomatoes',
        price: 2.99,
        category: 'Vegetables',
        farmId: 'farm1',
        farmName: 'Green Valley Farm',
        description: 'Organic, locally grown tomatoes',
        image: 'https://images.unsplash.com/photo-1546470427-e35b91c4ca7d?w=300',
        stock: 50,
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Sweet Corn',
        price: 1.99,
        category: 'Vegetables',
        farmId: 'farm2',
        farmName: 'Sunny Acres',
        description: 'Sweet, fresh corn on the cob',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300',
        stock: 30,
        rating: 4.3,
      },
      {
        id: '3',
        name: 'Free-Range Eggs',
        price: 4.99,
        category: 'Dairy & Eggs',
        farmId: 'farm1',
        farmName: 'Green Valley Farm',
        description: 'Fresh eggs from free-range chickens',
        image: 'https://images.unsplash.com/photo-1569288052389-dac9b01ac7a0?w=300',
        stock: 20,
        rating: 4.8,
      },
    ];

    mockProducts.forEach(product => {
      dispatch({ type: ActionTypes.ADD_PRODUCT, payload: product });
    });

    // Mock IoT devices for farmers
    const mockDevices = [
      {
        id: 'device1',
        name: 'Soil Moisture Sensor #1',
        type: 'sensor',
        farmId: 'farm1',
        status: 'active',
        sensorData: {
          moisture: 65,
          temperature: 22.5,
          humidity: 70,
          pH: 6.8,
          lastUpdated: new Date().toISOString(),
        },
        location: 'Field A - Section 1',
      },
      {
        id: 'device2',
        name: 'Irrigation System #1',
        type: 'actuator',
        farmId: 'farm1',
        status: 'active',
        isOn: false,
        schedule: '6:00 AM - 8:00 AM',
        location: 'Field A',
      },
      {
        id: 'device3',
        name: 'Weather Station',
        type: 'sensor',
        farmId: 'farm1',
        status: 'active',
        sensorData: {
          temperature: 24.8,
          humidity: 68,
          windSpeed: 12.3,
          rainfall: 0,
          pressure: 1013.2,
          lastUpdated: new Date().toISOString(),
        },
        location: 'Central Field',
      },
    ];

    mockDevices.forEach(device => {
      dispatch({ type: ActionTypes.ADD_IOT_DEVICE, payload: device });
    });
  };

  // Actions
  const login = async (email, password, userType) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await api.login(email, password, userType);
      const user = response.user;

      await AsyncStorage.setItem('userData', JSON.stringify({ user, userType }));
      
      // Load cart from AsyncStorage
      const cartData = await AsyncStorage.getItem(`cart_${user.id}`);
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        cartItems.forEach(item => {
          dispatch({ type: ActionTypes.ADD_TO_CART, payload: item });
        });
      }
      
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user, userType },
      });

      return { success: true, user };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Login failed' });
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }
    await AsyncStorage.removeItem('userData');
    if (state.user) {
      await AsyncStorage.removeItem(`cart_${state.user.id}`);
    }
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const addToCart = async (product, buyerId) => {
    dispatch({ type: ActionTypes.ADD_TO_CART, payload: product });
    
    // Save to AsyncStorage
    if (buyerId) {
      try {
        const cartData = await AsyncStorage.getItem(`cart_${buyerId}`);
        const cartItems = cartData ? JSON.parse(cartData) : [];
        const existingIndex = cartItems.findIndex(item => item.id === product.id);
        
        if (existingIndex >= 0) {
          cartItems[existingIndex].quantity += 1;
        } else {
          cartItems.push({ ...product, quantity: 1 });
        }
        
        await AsyncStorage.setItem(`cart_${buyerId}`, JSON.stringify(cartItems));
        
        // Also save to backend if user is logged in
        if (state.isAuthenticated && state.userType === 'buyer') {
          try {
            await api.addToCart(product.id, buyerId, cartItems.find(item => item.id === product.id)?.quantity || 1);
          } catch (error) {
            console.error('Failed to sync cart to backend:', error);
          }
        }
      } catch (error) {
        console.error('Failed to save cart to AsyncStorage:', error);
      }
    }
  };

  const removeFromCart = async (productId, buyerId) => {
    dispatch({ type: ActionTypes.REMOVE_FROM_CART, payload: productId });
    
    // Remove from AsyncStorage
    if (buyerId) {
      try {
        const cartData = await AsyncStorage.getItem(`cart_${buyerId}`);
        if (cartData) {
          const cartItems = JSON.parse(cartData).filter(item => item.id !== productId);
          await AsyncStorage.setItem(`cart_${buyerId}`, JSON.stringify(cartItems));
        }
        
        // Also remove from backend if user is logged in
        if (state.isAuthenticated && state.userType === 'buyer') {
          try {
            // Find cart item ID from backend
            const cartItems = await api.getCartItems(buyerId);
            const cartItem = cartItems.find(item => item.productId === productId);
            if (cartItem) {
              await api.removeFromCart(cartItem.cartId);
            }
          } catch (error) {
            console.error('Failed to remove from backend cart:', error);
          }
        }
      } catch (error) {
        console.error('Failed to remove from AsyncStorage:', error);
      }
    }
  };

  const updateCartQuantity = async (productId, quantity, buyerId) => {
    if (quantity <= 0) {
      await removeFromCart(productId, buyerId);
      return;
    }
    
    // Update in state
    const cartItem = state.cart.find(item => item.id === productId);
    if (cartItem) {
      dispatch({
        type: ActionTypes.ADD_TO_CART,
        payload: { ...cartItem, quantity },
      });
    }
    
    // Update AsyncStorage
    if (buyerId) {
      try {
        const cartData = await AsyncStorage.getItem(`cart_${buyerId}`);
        if (cartData) {
          const cartItems = JSON.parse(cartData);
          const itemIndex = cartItems.findIndex(item => item.id === productId);
          if (itemIndex >= 0) {
            cartItems[itemIndex].quantity = quantity;
            await AsyncStorage.setItem(`cart_${buyerId}`, JSON.stringify(cartItems));
          }
        }
        
        // Update backend
        if (state.isAuthenticated && state.userType === 'buyer') {
          try {
            const cartItems = await api.getCartItems(buyerId);
            const cartItem = cartItems.find(item => item.productId === productId);
            if (cartItem) {
              await api.updateCartItemQuantity(cartItem.cartId, quantity);
            }
          } catch (error) {
            console.error('Failed to update backend cart:', error);
          }
        }
      } catch (error) {
        console.error('Failed to update AsyncStorage:', error);
      }
    }
  };

  const clearCart = async (buyerId) => {
    dispatch({ type: ActionTypes.CLEAR_CART });
    
    if (buyerId) {
      try {
        await AsyncStorage.removeItem(`cart_${buyerId}`);
        
        if (state.isAuthenticated && state.userType === 'buyer') {
          try {
            await api.clearCart(buyerId);
          } catch (error) {
            console.error('Failed to clear backend cart:', error);
          }
        }
      } catch (error) {
        console.error('Failed to clear AsyncStorage:', error);
      }
    }
  };

  const addFarm = (farm) => {
    dispatch({ type: ActionTypes.ADD_FARM, payload: farm });
  };

  const addProduct = (product) => {
    dispatch({ type: ActionTypes.ADD_PRODUCT, payload: product });
  };

  const addIoTDevice = (device) => {
    dispatch({ type: ActionTypes.ADD_IOT_DEVICE, payload: device });
  };

  const updateIoTDevice = (device) => {
    dispatch({ type: ActionTypes.UPDATE_IOT_DEVICE, payload: device });
  };

  const simulateSensorData = (deviceId) => {
    // Simulate real-time sensor data updates
    const randomData = {
      moisture: Math.floor(Math.random() * 40) + 40, // 40-80%
      temperature: Math.floor(Math.random() * 15) + 18, // 18-33°C
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      pH: (Math.random() * 2 + 6).toFixed(1), // 6.0-8.0
    };

    dispatch({
      type: ActionTypes.UPDATE_SENSOR_DATA,
      payload: { deviceId, data: randomData },
    });
  };

  const value = {
    ...state,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addFarm,
    addProduct,
    addIoTDevice,
    updateIoTDevice,
    simulateSensorData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;