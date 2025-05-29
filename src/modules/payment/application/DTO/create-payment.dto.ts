import { PaymentMethod } from '../../domain/entities/payment.entity';

export interface CreatePaymentDto {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  paymentDetails: {
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
    paypalEmail?: string;
  };
} 