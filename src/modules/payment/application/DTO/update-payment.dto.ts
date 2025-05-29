import { PaymentStatus } from '../../domain/entities/payment.entity';

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  transactionId?: string;
  errorMessage?: string;
} 