import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal
} from "react-native";

import Animated, { 
    FadeInDown, 
    FadeOutUp 
} from "react-native-reanimated";

import { 
    Ionicons, 
    MaterialIcons 
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export const PaymentCheckout = ({onPayment}) => {
    const navigation = useRouter();
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [method, setMethod] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardholderName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });
    const [momoDetails, setMomoDetails] = useState({
        provider: "",
        phoneNumber: "",
    });

    const renderFields = () => {
    switch (method) {
        case "card":
        return (
            <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
                <TextInput
                    style={styles.input} 
                    placeholder="Cardholder Name"
                    value={cardDetails.cardholderName}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, cardholderName: text })}
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Card Number" 
                    keyboardType="number-pad"
                    value={cardDetails.cardNumber}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
                />
                <View style={styles.row}>
                <TextInput 
                    style={[styles.input, { flex: 1, marginRight: 10 }]} 
                    placeholder="MM/YY"
                />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" secureTextEntry />
                </View>
            </Animated.View>
        );
        case "momo":
        return (
            <Animated.View 
                entering={FadeInDown} 
                exiting={FadeOutUp}
            >
                <Picker
                    selectedValue={momoDetails.provider}
                    onValueChange={(itemValue) => setMomoDetails({ ...momoDetails, provider: itemValue })}
                    style={styles.input}
                >
                    <Picker.Item 
                        label="Select Mobile Money Provider" 
                        value=""
                    />
                    <Picker.Item 
                        label="MTN Mobile Money" 
                        value="MTN" 
                    />
                    <Picker.Item 
                        label="AirtelTigo Money" 
                        value="Airtel" 
                    />
                    <Picker.Item 
                        label="Vodafone Cash" 
                        value="Vodafone"
                    />
                </Picker>
                <TextInput
                    style={styles.input} 
                    placeholder="Phone Number" 
                    keyboardType="phone-pad"
                    value={momoDetails.phoneNumber}
                    onChangeText={(text) => setMomoDetails({ ...momoDetails, phoneNumber: text })}
                />
            </Animated.View>
        );
        case "cash":
        return (
            <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
                <Text style={styles.infoText}>You will pay with cash on delivery.</Text>
            </Animated.View>
        );
        default:
        return null;
    }
    };

    const handlePayment = () => {
        if (!method) {
            Alert.alert("Error", "Please select a payment method.");
            return;
        }
        switch (method) {
            case "card":
                if (!cardDetails.cardholderName || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
                    Alert.alert("Error", "Please fill in all card details.");
                } else {
                    // Here you would typically handle the card payment logic
                    // The example simulates a successful payment after a delay
                    setTimeout(() => {
                        setPaymentSuccess(false);
                        setIsPaymentLoading(true);
                        setIsModalVisible(true);
                    }, 5000);
                    setIsPaymentLoading(false);
                    setPaymentSuccess(true);
                    setIsModalVisible(false);
                    Alert.alert("Success", "Payment successful with card.");
                    onPayment(cardDetails);
                }
                break;
            case "momo":
                if (!momoDetails.provider || !momoDetails.phoneNumber) {
                    Alert.alert("Error", "Please fill in all mobile money details.");
                } else {
                    // Here you would typically handle the card payment logic
                    // The example simulates a successful payment after a delay
                    setTimeout(() => {
                        setPaymentSuccess(false);
                        setIsPaymentLoading(true);
                        setIsModalVisible(true);
                    }, 5000);
                    setIsPaymentLoading(false);
                    setPaymentSuccess(true);
                    setIsModalVisible(false);
                    Alert.alert("Success", "Payment successful with Mobile Money.");
                    onPayment(momoDetails);
                }
                break;
            case "cash":
                // Here you would typically handle the card payment logic
                // The example simulates a successful payment after a delay
                setPaymentSuccess(false);
                setIsPaymentLoading(true);
                setIsModalVisible(true);
                setTimeout(() => {
                    setIsPaymentLoading(false);
                    setPaymentSuccess(true);
                }, 5000);
                onPayment({ method: "cash" });
                break;
            default:
                Alert.alert("Error", "Please select a valid payment method.");
        }
    }

    return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose Payment Method</Text>

        <View style={styles.options}>
        <TouchableOpacity
            style={[styles.option, method === "card" && styles.selected]}
            onPress={() => setMethod("card")}
        >
            <MaterialIcons name="credit-card" size={24} color={method === "card" ? "#fff" : "#555"} />
            <Text style={[styles.optionText, method === "card" && styles.optionTextSelected]}>
            Card
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.option, method === "momo" && styles.selected]}
            onPress={() => setMethod("momo")}
        >
            <Ionicons name="phone-portrait-outline" size={24} color={method === "momo" ? "#fff" : "#555"} />
            <Text style={[styles.optionText, method === "momo" && styles.optionTextSelected]}>
            Mobile Money
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.option, method === "cash" && styles.selected]}
            onPress={() => setMethod("cash")}
        >
            <Ionicons name="cash-outline" size={24} color={method === "cash" ? "#fff" : "#555"} />
            <Text style={[styles.optionText, method === "cash" && styles.optionTextSelected]}>
            Cash
            </Text>
        </TouchableOpacity>
        </View>

        <View style={styles.fieldsWrapper}>{renderFields()}</View>

        {method && (
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
        )}
        {(
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setPaymentSuccess(false)}
            >
                <View style={styles.modalBackground}>
                    {!isPaymentLoading && paymentSuccess ? (<View style={{ width: 300, padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Payment Successful</Text>
                        <Text>Your payment has been processed successfully.</Text>
                        <TouchableOpacity 
                            style={styles.modalCloseButton} 
                            onPress={() => {
                                setIsModalVisible(false); 
                                setPaymentSuccess(false); 
                                navigation.replace('/buyer/app/dashboard/order-summary');
                            }}
                    >
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                ):(<ActivityIndicator size="large" color="#392867" />)}
                </View>
            </Modal>
        )}
    </ScrollView>
    );
};

const styles = StyleSheet.create({
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' ,
    width: '100%',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalCloseButton: {
        backgroundColor: '#392867',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
},
  container: {
    padding: 20,
    backgroundColor: "#f7f8fa",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: "#392867",
  },
  optionText: {
    marginTop: 5,
    color: "#555",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#fff",
  },
  fieldsWrapper: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  infoText: {
    color: "#333",
    fontSize: 16,
    padding: 10,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    borderColor: "#ffeeba",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
  },
  payButton: {
    backgroundColor: "#392867",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});