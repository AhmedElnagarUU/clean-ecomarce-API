import { IPaymentService, PaymentDetails, PaymentResult, PaymentStatus, PaymentMethod } from './payment.types';

export abstract class BasePaymentService implements IPaymentService {
  protected abstract processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult>;
  protected abstract verifyTransaction(paymentId: string): Promise<PaymentResult>;
  protected abstract processRefund(paymentId: string, amount?: number): Promise<PaymentResult>;

  public async initializePayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    try {
      return await this.processPayment(paymentDetails);
    } catch (error) {
      return {
        id: '',
        status: PaymentStatus.FAILED,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async verifyPayment(paymentId: string): Promise<PaymentResult> {
    try {
      return await this.verifyTransaction(paymentId);
    } catch (error) {
      return {
        id: paymentId,
        status: PaymentStatus.FAILED,
        amount: 0,
        currency: '',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      return await this.processRefund(paymentId, amount);
    } catch (error) {
      return {
        id: paymentId,
        status: PaymentStatus.FAILED,
        amount: amount || 0,
        currency: '',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 