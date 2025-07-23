import { eq } from 'drizzle-orm';
import { farmers,buyers,orders,products,devices } from '../database/schema.js';
import bcrypt from 'bcrypt';

// Farmer Controllers
export const addFarmer = async (req, res) => {
  try {
    const { name, address, location, phone, password, email, avatar } = req.body;
    const result = await req.db.insert(farmers).values({
      name,
      address,
      location,
      phone,
      password,
      email,
      avatar,
    });
    res.status(201).json({ message: "Farmer created", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.db.delete(farmers).where(eq(farmers.id, Number(id)));
    res.status(200).json({ message: "Farmer deleted", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await req.db.update(farmers).set(data).where(eq(farmers.id, Number(id)));
    res.status(200).json({ message: "Farmer updated", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await req.db.select().from(farmers).where(eq(farmers.id, Number(id)));
    if (farmer.length === 0) {
        return res.status(404).json({ message: "Farmer not found" });
        }
    res.status(200).json(farmer[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarmers = async (req, res) => {
  try {
    const allFarmers = await req.db.select().from(farmers);
    res.status(200).json(allFarmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Buyer Controllers
export const addBuyer = async (req, res) => {
  try {
    const { name, email, phone, location, avatar, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await req.db.insert(buyers).values({ name, email, phone, location, avatar, password: hash });
    res.status(201).json({ message: 'Buyer added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBuyer = async (req, res) => {
  try {
    await req.db.delete(buyers).where(eq(buyers.id, +req.params.id));
    res.json({ message: 'Buyer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    await req.db.update(buyers).set(data).where(eq(buyers.id, +id));
    res.json({ message: 'Buyer updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await req.db.select().from(buyers).where(eq(buyers.id, +id));
    if (buyer.length === 0) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res.json(buyer[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getBuyers = async (req, res) => {
  try {
    const allBuyers = await req.db.select().from(buyers);
    res.json(allBuyers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Product Controllers
export const addProduct = async (req, res) => {
  try {
    const { name, quantity, price, status, productLocation, avatar, farmerId } = req.body;
    await req.db.insert(products).values({
      name, quantity, price, status, productLocation, avatar, farmerId
    });
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await req.db.delete(products).where(eq(products.id, +req.params.id));
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyProduct = async (req, res) => {
  try {
    await req.db.update(products).set(req.body).where(eq(products.id, +req.params.id));
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await req.db.select().from(products).where(eq(products.id, +id));
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getProducts = async (req, res) => {
  try {
    const allProducts = await req.db.select().from(products);
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Device Controllers
export const installDevice = async (req, res) => {
  try {
    await req.db.insert(devices).values(req.body);
    res.status(201).json({ message: 'Device installed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyDevice = async (req, res) => {
  try {
    await req.db.update(devices).set(req.body).where(eq(devices.id, +req.params.id));
    res.json({ message: 'Device updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uninstallDevice = async (req, res) => {
  try {
    await req.db.delete(devices).where(eq(devices.id, +req.params.id));
    res.json({ message: 'Device uninstalled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await req.db.select().from(devices).where(eq(devices.id, +id));
    if (device.length === 0) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(device[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getDevices = async (req, res) => {
  try {
    const allDevices = await req.db.select().from(devices);
    res.json(allDevices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Order Controllers
export const addOrder = async (req, res) => {
  try {
    await req.db.insert(orders).values(req.body);
    res.status(201).json({ message: 'Order placed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeOrder = async (req, res) => {
  try {
    await req.db.delete(orders).where(eq(orders.id, +req.params.id));
    res.json({ message: 'Order removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateOrder = async (req, res) => {
  try {
    await req.db.update(orders).set(req.body).where(eq(orders.id, +req.params.id));
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Cart controllers
export const addToCart = async (req, res) => {
  try {
    await req.db.insert(carts).values(req.body);
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await req.db.delete(carts).where(eq(carts.id, +req.params.id));
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Chat controllers
export const addChat = async (req, res) => {
  try {
    await req.db.insert(chats).values(req.body);
    res.status(201).json({ message: 'Chat record added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// You can add fetch logic if needed for retrieving conversation histories:
export const getChats = async (req, res) => {
  try {
    const log = await req.db.select().from(chats).all();
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Farms controllers
export const addFarm = async (req, res) => {
  try {
    await req.db.insert(farms).values(req.body);
    res.status(201).json({ message: 'Farm added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFarm = async (req, res) => {
  try {
    await req.db.delete(farms).where(eq(farms.id, +req.params.id));
    res.json({ message: 'Farm removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyFarm = async (req, res) => {
  try {
    await req.db.update(farms).set(req.body).where(eq(farms.id, +req.params.id));
    res.json({ message: 'Farm updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarms = async (req, res) => {
  try {
    const all = await req.db.select().from(farms).all();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const subscribeToFarm = async (req, res) => {
  try {
    await req.db.insert(farm_subscribers).values(req.body);
    res.status(201).json({ message: 'Subscribed to farm' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

