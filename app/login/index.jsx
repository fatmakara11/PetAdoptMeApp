import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, Pressable, Text, View } from "react-native";
import Colors from "../../constants/Colors";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const router = useRouter();

    const onPress = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                router.replace("/(tabs)");
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    return (
        <View style={{ backgroundColor: Colors.WHITE, height: "100%" }}>
            <Image source={require("../../assets/images/login2.png")} style={{ width: "100%", height: 500 }} />
            <View style={{
                padding: 20,
                alignItems: "center",
                display: "flex",
            }}>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 30,
                    textAlign: "center",
                }}>Ready to make a new friend?</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 18,
                    textAlign: 'center',
                    color: Colors.GRAY
                }}>Let's adopt the pet which you like and make their life happy again</Text>
                <Pressable
                    onPress={onPress}
                    style={{
                        padding: 14,
                        marginTop: 100,
                        backgroundColor: Colors.PRIMARY,
                        width: '100%',
                        borderRadius: 14
                    }}
                >
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 20,
                        textAlign: 'center',
                        color: 'white'
                    }}>Sign in with Google</Text>
                </Pressable>
            </View>
        </View>
    );
}