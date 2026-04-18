interface DnaPaymentMethods {
  BankCard: string;
  ApplePay: string;
  GooglePay: string;
  PayPal: string;
  PayByBank: string;
  EcoSpend: string;
  Klarna: string;
  AlipayPlus: string;
  WeChatPay: string;
}

interface DnaPaymentMethodConfig {
  name: string;
  message?: string;
}

interface DnaConfigureEvents {
  opened?: () => void;
  cancelled?: () => void;
  paid?: () => void;
  declined?: () => void;
}

interface DnaEmbeddedWidgetConfig {
  container?: string;
  widgetType?: "SEAMLESS" | "EMBEDDED" | "HOSTED";
  maxVisiblePaymentMethods?: number;
  orderButtonText?: string;
}

interface DnaConfigureOptions {
  isTestMode?: boolean;
  isEnableDonation?: boolean;
  paymentMethods?: DnaPaymentMethodConfig[];
  events?: DnaConfigureEvents;
  embeddedWidget?: DnaEmbeddedWidgetConfig;
  cards?: Array<{
    merchantTokenId: string;
    panStar: string;
    cardSchemeId: string;
    cardName: string;
    expiryDate: string;
    isCSCRequired?: boolean;
    useStoredBillingData?: boolean;
  }>;
  disabledCardSchemes?: Array<{
    cardSchemeId?: number;
    cardSchemeName?: string;
  }>;
}

interface DnaPaymentSettings {
  terminalId: string;
  returnUrl?: string;
  failureReturnUrl?: string;
  callbackUrl?: string;
  failureCallbackUrl?: string;
}

interface DnaCustomerDetails {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  accountDetails?: {
    accountId?: string;
    [key: string]: unknown;
  };
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    [key: string]: unknown;
  };
  deliveryDetails?: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface DnaAuth {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface DnaPaymentRequest {
  invoiceId: string;
  amount: number | string;
  currency: string;
  description?: string;
  transactionType?: string;
  paymentSettings: DnaPaymentSettings;
  customerDetails?: DnaCustomerDetails;
  auth: DnaAuth;
  [key: string]: unknown;
}

interface DNAPaymentsGlobal {
  paymentMethods: DnaPaymentMethods;
  configure(options: DnaConfigureOptions): void;
  openPaymentPage(request: DnaPaymentRequest): void;
  openPaymentIframeWidget(request: DnaPaymentRequest): void;
  openEmbeddedWidget(request: DnaPaymentRequest): void;
  closePaymentWidget(): void;
}

interface Window {
  DNAPayments: DNAPaymentsGlobal;
}
