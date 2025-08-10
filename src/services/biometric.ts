import * as LocalAuthentication from 'expo-local-authentication'

export const isBiometricAvailable = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  return !!(hasHardware && isEnrolled)
}

/**
 * Prompt biometric (fingerprint/face) and return boolean success.
 */
export const promptBiometric = async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use device passcode',
    })
    return !!result.success
  } catch (e) {
    return false
  }
}