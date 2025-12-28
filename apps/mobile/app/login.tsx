import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { gql, useMutation } from "urql";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const REQUEST_PHONE_OTP_MUTATION = gql`
  mutation ($phoneNumber: String!) {
    requestPhoneVerificationCode(phoneNumber: $phoneNumber)
  }
`;

const LOGIN_WITH_PHONE_OTP_MUTATION = gql`
  mutation ($phoneNumber: String!, $code: Float!) {
    loginWithPhoneCode(phoneNumber: $phoneNumber, code: $code) {
      id
      username
      phoneNumber
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    paddingVertical: 10,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backLink: {
    marginTop: 20,
  },
  backText: {
    color: "#666",
  },
});

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");

  const [resOtp, requestOtp] = useMutation(REQUEST_PHONE_OTP_MUTATION);
  const [resLogin, loginWithPhoneCode] = useMutation(
    LOGIN_WITH_PHONE_OTP_MUTATION
  );

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return alert("Please enter a valid phone number.");
    }

    const result = await requestOtp({ phoneNumber });
    if (result.error) {
      return alert(
        `Failed to request OTP. Please try again. ${result.error.message}`
      );
    }
    setStep("code");
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 4) {
      return alert("Please enter a valid 4-digit code.");
    }

    const result = await loginWithPhoneCode({
      phoneNumber,
      code: Number(code),
    });

    if (!result.data) {
      return alert(`Invalid code. Please try again. ${result.error?.message}`);
    }
    await signIn(result.data.loginWithPhoneCode);
  };

  const isLoading = resOtp.fetching || resLogin.fetching;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {step === "phone"
            ? "What's your phone number?"
            : "Enter validation code"}
        </Text>

        <Text style={styles.subtitle}>
          {step === "phone"
            ? "A 4-digit code will be sent to your phone."
            : `Code sent to ${phoneNumber}`}
        </Text>

        {step === "phone" ? (
          <TextInput
            style={styles.input}
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
            placeholderTextColor={"#ccc"}
            autoFocus
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!isLoading}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="1234"
            keyboardType="number-pad"
            placeholderTextColor={"#ccc"}
            autoFocus
            value={code}
            onChangeText={setCode}
            editable={!isLoading}
          />
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={step === "phone" ? handleRequestOtp : handleVerifyCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={styles.buttonText}>
              {step === "phone" ? "Send Code" : "Continue"}
            </Text>
          )}
        </TouchableOpacity>

        {step === "code" && !isLoading && (
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => setStep("phone")}
          >
            <Text style={styles.backText}>Change phone number</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
