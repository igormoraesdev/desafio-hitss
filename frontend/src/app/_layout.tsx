import { theme } from "@/styles/theme";
import { Roboto_400Regular } from "@expo-google-fonts/roboto/400Regular";
import { Roboto_700Bold } from "@expo-google-fonts/roboto/700Bold";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DripsyProvider } from "dripsy";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const queryClient = new QueryClient();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DripsyProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
      </DripsyProvider>
    </QueryClientProvider>
  );
}
