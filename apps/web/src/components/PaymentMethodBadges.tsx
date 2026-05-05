import Image from "next/image";

type PaymentMethod = {
  label: string;
  src: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    label: "Visa",
    src: "/payment-methods/visa.svg",
  },
  {
    label: "Mastercard",
    src: "/payment-methods/mastercard.svg",
  },
  {
    label: "Google Pay",
    src: "/payment-methods/google-pay.svg",
  },
  {
    label: "Apple Pay",
    src: "/payment-methods/apple-pay.svg",
  },
];

type PaymentMethodBadgesProps = {
  compact?: boolean;
};

export function PaymentMethodBadges({ compact = false }: PaymentMethodBadgesProps) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {paymentMethods.map((method) => (
        <li key={method.label}>
          <Image
            src={method.src}
            alt={method.label}
            width={120}
            height={80}
            className={[
              "rounded-md bg-white object-contain shadow-sm ring-1 ring-slate-200/70",
              compact
                ? "h-8 w-12"
                : "h-10 w-16",
            ].join(" ")}
            title={method.label}
          />
        </li>
      ))}
    </ul>
  );
}
