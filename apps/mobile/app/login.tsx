import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { gql, useMutation } from "urql";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TextInput,
} from "react-native";

import { Text } from "../src/components/design-kit/Text";
import { Button } from "../src/components/design-kit/Button";

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
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    paddingVertical: 10,
    marginBottom: 40,
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
        <Text variant="h1">
          {step === "phone"
            ? "What's your phone number?"
            : "Enter validation code"}
        </Text>

        <Text variant="h2">
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

        <Button
          onPress={step === "phone" ? handleRequestOtp : handleVerifyCode}
          loading={isLoading}
          label={step === "phone" ? "Send Code" : "Continue"}
        />

        {step === "code" && !isLoading && (
          <Button
            variant="ghost"
            onPress={() => setStep("phone")}
            label="Change phone number"
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
