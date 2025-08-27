import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {
  PieChart,
  BarChart,
  LineChart,
} from 'react-native-chart-kit';
import {AnimatedSwipeRightHint} from '@/src/features/farmer/components/animated-swipe-right-indicator';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "4",
    strokeWidth: "1",
    stroke: "#2196F3",
  },
};

// 4-hour interval timestamps
const timestamps = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

const devices = [
  {
    id: '1',
    name: "Soil Moisture Sensor",
    icon: "tint",
    status: "Active",
    values: [55, 60, 62, 58, 57, 56],
  },
  {
    id: '2',
    name: "pH Sensor",
    icon: "flask",
    status: "Inactive",
    values: [6.8, 7.0, 7.2, 6.9, 7.1, 7.2],
  },
  {
    id: '3',
    name: "Soil Temperature Sensor",
    icon: "thermometer-half",
    status: "Active",
    values: [20, 22, 23, 21, 22, 23],
  },
  {
    id: '4',
    name: "NPK Sensor",
    icon: "leaf",
    status: "Inactive",
    values: [35, 40, 41, 36, 38, 37],
  },
  {
    id: '5',
    name: "Light Sensor (LDR)",
    icon: "sun-o",
    status: "Active",
    values: [200, 800, 750, 300, 700, 1000],
  },
  {
    id: '6',
    name: "CO2 Sensor",
    icon: "cloud",
    status: "Active",
    values: [380, 400, 410, 395, 370, 390],
  },
];

const soldProductsAnalytics = [
  { crop: 'Tomatoes', sales: 40 },
  { crop: 'Maize', sales: 25 },
  { crop: 'Carrots', sales: 20 },
  { crop: 'Lettuce', sales: 15 },
];

const DashboardHomeScreen = () => {
  const activeDevices = devices.filter(d => d.status === 'Active').length;
  const inactiveDevices = devices.length - activeDevices;

  const pieData = [
    {
      name: 'Active',
      population: activeDevices,
      color: '#1D1041',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Inactive',
      population: inactiveDevices,
      color: '#F44336',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Agro Companion</Text>
      <Text style={styles.subTitle}>Welcome, SAMUEL!</Text>
      <AnimatedSwipeRightHint />

      {/* Device List */}
      <CardView style={styles.cardDevices}>
        <Text style={styles.chartTitle}>Installed Devices</Text>
        <FlatList
          scrollEnabled={false}
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.deviceItem}>
              <FontAwesome
                name={item.icon}
                size={24}
                color={item.status === 'Active' ? '#1D1041' : '#F44336'}
              />
              <Text style={styles.deviceText}>{item.name}</Text>
              <Text style={[styles.deviceStatus, {
                color: item.status === 'Active' ? '#1D1041' : '#F44336'
              }]}>[{item.status}]</Text>
            </View>
          )}
        />
      </CardView>

      {/* Device Status Pie Chart */}
      <CardView style={styles.card}>
        <Text style={styles.chartTitle}>Device Status Overview</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
        />
      </CardView>

      {/* Number of Farm Products */}
      <CardView style={styles.card}>
        <Text style={styles.chartTitle}>
          Products Listed by Farmer: {soldProductsAnalytics.length}
        </Text>
        <BarChart
          data={{
            labels: soldProductsAnalytics.map(item => item.crop),
            datasets: [{ data: soldProductsAnalytics.map(item => item.sales) }]
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </CardView>

      {/* Sensor Readings Over Time */}
      {devices.map(device => (
        <CardView key={device.id} style={styles.card}>
          <Text style={styles.chartTitle}>
            <FontAwesome
              name={device.icon}
              size={18}
              color={device.status === 'Active' ? '#4CAF50' : '#F44336'}
            />{" "}
            {device.name}
          </Text>
          <LineChart
            data={{
              labels: timestamps,
              datasets: [{ data: device.values }],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </CardView>
      ))}
    </ScrollView>
  );
};

const CardView = ({ children, style }) => (
  <View style={style}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
  },
  title: {
    fontSize:24, 
    marginVertical:10,
    padding:10,
    textAlign:'center',
    fontWeight:'bold',
    color:'#1D1041',
    backgroundColor:'#EDEDED',
    borderRadius:10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDevices: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    flex: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  deviceText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  deviceStatus: {
    fontWeight: '600',
  },
});

export default DashboardHomeScreen;
